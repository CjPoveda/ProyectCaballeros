const express = require("express");
const { Pool } = require("pg");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Insertar Caballeros del Zodiaco",
      version: "1.0.0",
      description: "Microservicio para insertar personajes"
    }
  },
  apis: ["./index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Personaje:
 *       type: object
 *       required:
 *         - nombre
 *         - edad
 *         - altura
 *         - constelacion
 *       properties:
 *         nombre:
 *           type: string
 *         edad:
 *           type: integer
 *         altura:
 *           type: number
 *         constelacion:
 *           type: string
 *         imagen_url:
 *           type: string
 */

/**
 * @swagger
 * /personaje:
 *   post:
 *     summary: Inserta un nuevo personaje
 *     tags: [Personajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personaje'
 *     responses:
 *       201:
 *         description: Personaje insertado exitosamente
 *       500:
 *         description: Error al insertar personaje
 */
app.post("/personaje", async (req, res) => {
  const { nombre, edad, altura, constelacion, imagen_url } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO personajes (nombre, edad, altura, constelacion, imagen_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre, edad, altura, constelacion, imagen_url]
    );

    res.status(201).json({ mensaje: "Personaje insertado", id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: "Error al insertar personaje" });
  }
});

app.listen(PORT, () => {
  console.log(`Insert corriendo en http://0.0.0.0:${PORT}`);
});

