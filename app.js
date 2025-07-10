//archivo principal de configuración del servidor
import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";
import moviesRoutes from "./src/routes/movies.routes.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/movies', moviesRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  console.log("Base de datos conectada correctamente");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
