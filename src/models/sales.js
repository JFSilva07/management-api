import db from "../config/db.js";

// Criar venda
export const createSale = async (client_id, user_id, items) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    const saleItems = [];

    // Criar venda
    const [saleResult] = await conn.query(
      "INSERT INTO sales (client_id, user_id, date) VALUES (?, ?, NOW())",
      [client_id, user_id]
    );
    const saleId = saleResult.insertId;

    // Inserir itens e atualizar estoque
    for (const item of items) {
      const { produtoId, quantidade } = item;

      // Buscar produto com estoque e preço
      const [productRows] = await conn.query(
        "SELECT storage, price FROM products WHERE id = ?",
        [produtoId]
      );
      const product = productRows[0];

      if (!product) throw new Error(`Produto ${produtoId} não encontrado`);
      if (product.storage < quantidade)
        throw new Error(`Estoque insuficiente para o produto ID ${produtoId}`);

      const unit_price = product.price;
      const subtotal = unit_price * quantidade;

      // Inserir item
      await conn.query(
        "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [saleId, produtoId, quantidade, unit_price]
      );

      // Atualizar estoque
      await conn.query(
        "UPDATE products SET storage = storage - ? WHERE id = ?",
        [quantidade, produtoId]
      );
      // Marcar produto como esgotado se estoque zerar
      await conn.query(
        "UPDATE products SET in_stock = CASE WHEN storage - ? <= 0 THEN 0 ELSE 1 END WHERE id = ?",
        [quantidade, produtoId]
      );

      saleItems.push({
        product_id: produtoId,
        quantity: quantidade,
        unit_price,
        subtotal,
      });
      total += subtotal;
    }

    await conn.commit();
    return {
      saleId,
      client_id,
      user_id,
      total,
      items: saleItems,
      message: "Venda registrada com valores oficiais do banco.",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Atualizar venda
export const updateSale = async (saleId, items) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Buscar itens antigos
    const [oldItems] = await conn.query(
      "SELECT product_id, quantity FROM sale_items WHERE sale_id = ?",
      [saleId]
    );

    // Restaurar estoque dos itens antigos
    for (const oldItem of oldItems) {
      await conn.query(
        "UPDATE products SET storage = storage + ? WHERE id = ?",
        [oldItem.quantity, oldItem.product_id]
      );
    }

    // Deletar itens antigos
    if (oldItems.length > 0) {
      await conn.query("DELETE FROM sale_items WHERE sale_id = ?", [saleId]);
    }

    // Se algum item inválido, excluir a venda
    if (items.some((item) => item.quantity <= 0)) {
      await conn.query("DELETE FROM sales WHERE id = ?", [saleId]);
      await conn.commit();
      return {
        message: "Venda deletada pois algum item tinha quantidade <= 0",
      };
    }

    let total = 0;
    const saleItems = [];

    // Inserir novos itens
    for (const item of items) {
      const { productId, quantity } = item;

      // Buscar produto com preço atualizado
      const [productRows] = await conn.query(
        "SELECT storage, price FROM products WHERE id = ?",
        [productId]
      );
      const product = productRows[0];

      if (!product) throw new Error(`Produto ${productId} não encontrado`);
      if (product.storage < quantity)
        throw new Error(`Estoque insuficiente para o produto ${productId}`);

      const unit_price = product.price;
      const subtotal = unit_price * quantity;

      await conn.query(
        "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [saleId, productId, quantity, unit_price]
      );

      await conn.query(
        "UPDATE products SET storage = storage - ? WHERE id = ?",
        [quantity, productId]
      );

      saleItems.push({ product_id: productId, quantity, unit_price, subtotal });
      total += subtotal;
    }

    await conn.commit();
    return {
      saleId,
      total,
      items: saleItems,
      message: "Venda atualizada com valores oficiais do banco.",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Buscar todas as vendas
export const getSales = async () => {
  const sql = `
    SELECT s.id, s.client_id, s.user_id, s.date, 
           SUM(si.quantity * si.unit_price) as total
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    GROUP BY s.id
    ORDER BY s.date DESC
  `;
  const [results] = await db.query(sql);
  return results;
};

// Buscar venda por ID
export const getSaleById = async (id) => {
  const [sales] = await db.query("SELECT * FROM sales WHERE id = ?", [id]);
  if (sales.length === 0) return null;

  const sale = sales[0];
  const [items] = await db.query("SELECT * FROM sale_items WHERE sale_id = ?", [
    id,
  ]);
  sale.items = items;
  return sale;
};

// Deletar venda
// Deletar venda
export const deleteSale = async (saleId) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Buscar itens da venda
    const [oldItems] = await conn.query(
      "SELECT product_id, quantity FROM sale_items WHERE sale_id = ?",
      [saleId]
    );

    // Restaurar estoque e atualizar in_stock
    for (const item of oldItems) {
      await conn.query(
        `UPDATE products 
         SET storage = storage + ?, 
             in_stock = IF(storage + ? > 0, 1, 0)
         WHERE id = ?`,
        [item.quantity, item.quantity, item.product_id]
      );
    }

    // Deletar itens da venda
    if (oldItems.length > 0) {
      await conn.query("DELETE FROM sale_items WHERE sale_id = ?", [saleId]);
    }

    // Deletar venda
    const [result] = await conn.query("DELETE FROM sales WHERE id = ?", [
      saleId,
    ]);

    await conn.commit();
    return { deleted: result.affectedRows > 0 };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
