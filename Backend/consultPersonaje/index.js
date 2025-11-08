const express = require("express");
const { Pool } = require("pg");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Consultar Caballeros del Zodiaco",
      version: "1.0.0",
      description: "Microservicio para consultar personajes"
    }
  },
  apis: ["./index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/personajes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM personajes");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

app.listen(PORT, () => {
  console.log(`Consulta corriendo en http://0.0.0.0:${PORT}`);
});
