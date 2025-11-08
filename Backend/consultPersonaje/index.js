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

/**
 * @swagger
 * /personajes:
 *   get:
 *     summary: Obtiene todos los personajes
 *     tags: [Personajes]
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       500:
 *         description: Error al consultar la base de datos
 */
app.get("/personajes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM personajes");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});
/**
 * @swagger
 * /personajes/{id}:
 *   get:
 *     summary: Obtiene un personaje por su ID
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del personaje a consultar
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       404:
 *         description: Personaje no encontrado
 *       500:
 *         description: Error al consultar la base de datos
 */
app.get("/personajes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM personajes WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

app.listen(PORT, () => {
  console.log(`Consulta corriendo en http://0.0.0.0:${PORT}`);
});
