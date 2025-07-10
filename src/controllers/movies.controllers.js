import Movie from "../models/movies.models.js";

// obtener todos las peliculas
export const getAllMovies = async (req, res) => {
  const movies = await Movie.findAll();
  res.json(movies);
};

// obtener una pelicula por id
export const getMovieById = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) {
    //si no se encuentra pelicula, devolver un error
    return res.status(404).json({ error: "Pelicula no encontrada" });
  }
  res.json(movie);
};

// crear una pelicula
export const createMovie = async (req, res) => {
  const { title, director, duration, genre, description } = req.body;

  // Validar que los campos obligatorios esten presentes y cumplan con los requisitos.
  if (
    title === undefined || title === null || title === "" ||
    director === undefined || director === null || director === "" ||
    genre === undefined || genre === null || genre === "" || // Si "" es un género válido, usa solo === undefined || === null
    // Validación específica para duration: debe ser un número, entero y positivo (> 0)
    typeof duration !== 'number' || !Number.isInteger(duration) || duration <= 0
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios o son inválidos. Asegúrate de que la duración sea un entero positivo." });
  }

  // Verificar si ya existe una pelicula con el mismo nombre (title debe ser único)
  const exists = await Movie.findOne({ where: { title } });
  if (exists) {
    // Si ya existe una pelicula con el mismo nombre, devolver un error 400
    return res
      .status(400)
      .json({ error: "Ya existe una pelicula con ese nombre." });
  }

  const movie = await Movie.create({
    title,
    director,
    duration,
    genre,
    description,
  });
  // Devolver la nueva película con status 201 (Created)
  res.status(201).json(movie);
};

// actualizar una pelicula
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, director, duration, genre, description } = req.body;

  //buscar pelicula por id
  const movie = await Movie.findByPk(id);
  if (!movie) {
    return res.status(404).json({ error: "Pelicula no encontrada" });
  }

  //validar que los campos obligatorios esten presentes y q esten bien
  if (!title || !director || !duration || genre === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  //verificar si ya existe una pelicula con el mismo nombre, pero no el mismo id
  const exists = await Movie.findOne({ where: { title } });
  if (exists && exists.id !== movie.id) {
    //si ya existe una pelicula con el mismo nombre, devolver un error
    return res
      .status(400)
      .json({ error: "Ya existe una pelicula con ese nombre" });
  }

  //actualizar la pelicula
  movie.title = title;
  movie.director = director;
  movie.duration = duration;
  movie.genre = genre;
  movie.description = description;
  await movie.save();
  res.json(movie);
};

// eliminar una pelicula
export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findByPk(id);
  if (!movie) {
    return res.status(404).json({ error: "Pelicula no encontrada" });
  }
  await movie.destroy();
  res.json({ message: "Pelicula eliminada" });
};
