import db from "../config/db.js";

// Function to create sale
export const createSale = (customer_id, items) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Criar a venda
      const saleId = await new Promise((res, rej) => {
        db.query(
          "INSERT INTO sales (customer_id, date) VALUES (?, NOW())",
          [customer_id],
          (error, results) => {
            if (error) return rej(error);
            res(results.insertId);
          }
        );
      });

      // Inserir itens e atualizar estoque
      for (const item of items) {
        const { produtoId, quantidade, precoUnitario } = item;

        // Verificar estoque
        const product = await new Promise((res, rej) => {
          db.query(
            "SELECT storage FROM products WHERE id = ?",
            [produtoId],
            (error, results) => {
              if (error) return rej(error);
              res(results[0]);
            }
          );
        });

        if (!product) {
          return reject(new Error(`Produto ${produtoId} não encontrado`));
        }

        if (product.storage < quantidade) {
          return reject(
            new Error(`Estoque insuficiente para o produto ID ${produtoId}`)
          );
        }

        // Inserir item
        await new Promise((res, rej) => {
          db.query(
            "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
            [saleId, produtoId, quantidade, precoUnitario],
            (error) => {
              if (error) return rej(error);
              res();
            }
          );
        });

        // Atualizar estoque
        await new Promise((res, rej) => {
          db.query(
            "UPDATE products SET storage = storage - ? WHERE id = ?",
            [quantidade, produtoId],
            (error) => {
              if (error) return rej(error);
              res();
            }
          );
        });
      }

      resolve(saleId);
    } catch (error) {
      reject(error);
    }
  });
};

// Read All Sales
export const getSales = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.id, s.customer_id, s.date, SUM(si.quantity * si.unit_price) as total
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      GROUP BY s.id
      ORDER BY s.date DESC
    `;
    db.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

// Read Sale by ID
export const getSaleById = (id) => {
  return new Promise((resolve, reject) => {
    const sqlSale = "SELECT * FROM sales WHERE id = ?";
    db.query(sqlSale, [id], (error, results) => {
      if (error) return reject(error);
      if (results.length === 0) return resolve(null);

      const sale = results[0];
      db.query(
        "SELECT * FROM sale_items WHERE sale_id = ?",
        [id],
        (err, items) => {
          if (err) return reject(err);
          sale.items = items;
          resolve(sale);
        }
      );
    });
  });
};

// Update Sale
export const updateSale = (saleId, items) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Buscar itens antigos da venda...............
      const oldItems = await new Promise((res, rej) => {
        db.query(
          "SELECT product_id, quantity FROM sale_items WHERE sale_id = ?",
          [saleId],
          (err, results) => {
            if (err) return rej(err);
            res(results);
          }
        );
      });

      // Se algum item enviado tiver quantidade <= 0, deletar a venda.
      const hasInvalidQuantity = items.some((item) => item.quantity <= 0);
      if (hasInvalidQuantity) {
        // Devolver estoque dos itens antigos.
        for (const oldItem of oldItems) {
          await new Promise((res, rej) => {
            db.query(
              "UPDATE products SET storage = storage + ? WHERE id = ?",
              [oldItem.quantity, oldItem.product_id],
              (err) => {
                if (err) return rej(err);
                res();
              }
            );
          });
        }

        // Deletar itens antigos
        await new Promise((res, rej) => {
          db.query(
            "DELETE FROM sale_items WHERE sale_id = ?",
            [saleId],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });

        // Deletar a venda
        await new Promise((res, rej) => {
          db.query("DELETE FROM sales WHERE id = ?", [saleId], (err) => {
            if (err) return rej(err);
            res();
          });
        });

        return resolve("Venda deletada pois algum item tinha quantidade <= 0");
      }

      // Restaurar estoque dos itens antigos
      for (const oldItem of oldItems) {
        await new Promise((res, rej) => {
          db.query(
            "UPDATE products SET storage = storage + ? WHERE id = ?",
            [oldItem.quantity, oldItem.product_id],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });
      }

      // Deletar itens antigos
      if (oldItems.length > 0) {
        await new Promise((res, rej) => {
          db.query(
            "DELETE FROM sale_items WHERE sale_id = ?",
            [saleId],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });
      }

      // Inserir novos itens e atualizar estoque
      for (const item of items) {
        const { productId, quantity, unitPrice } = item;

        const product = await new Promise((res, rej) => {
          db.query(
            "SELECT * FROM products WHERE id = ?",
            [productId],
            (err, results) => {
              if (err) return rej(err);
              res(results[0]);
            }
          );
        });

        if (!product || product.storage < quantity) {
          return reject(
            new Error(
              `Estoque insuficiente para o produto ${
                product?.name || productId
              }`
            )
          );
        }

        await new Promise((res, rej) => {
          db.query(
            "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
            [saleId, productId, quantity, unitPrice],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });

        await new Promise((res, rej) => {
          db.query(
            "UPDATE products SET storage = storage - ? WHERE id = ?",
            [quantity, productId],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });
      }

      resolve(1); // Venda atualizada com sucesso
    } catch (error) {
      reject(error);
    }
  });
};

// Delete Sale
export const deleteSale = (saleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Buscar itens da venda, se houver
      const oldItems = await new Promise((res, rej) => {
        db.query(
          "SELECT product_id, quantity FROM sale_items WHERE sale_id = ?",
          [saleId],
          (err, results) => {
            if (err) return rej(err);
            res(results);
          }
        );
      });

      // Restaurar estoque de cada item, se houver
      for (const item of oldItems) {
        await new Promise((res, rej) => {
          db.query(
            "UPDATE products SET storage = storage + ? WHERE id = ?",
            [item.quantity, item.product_id],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });
      }

      // Deletar itens da venda, se houver
      if (oldItems.length > 0) {
        await new Promise((res, rej) => {
          db.query(
            "DELETE FROM sale_items WHERE sale_id = ?",
            [saleId],
            (err) => {
              if (err) return rej(err);
              res();
            }
          );
        });
      }

      // Deletar a venda
      await new Promise((res, rej) => {
        db.query("DELETE FROM sales WHERE id = ?", [saleId], (err, results) => {
          if (err) return rej(err);
          resolve(results.affectedRows);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
