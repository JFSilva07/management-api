/*import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    user: required("DB_USER"),
    pass: required("DB_PASS"),
    name: required("DB_NAME"),
  },
};*/
import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required("DATABASE_URL"), // usa apenas a DATABASE_URL
};
