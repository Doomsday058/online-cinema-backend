const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;

const allowedOrigins = [
  'http://localhost:3000', // Для локальной разработки
  'https://doomsday058.github.io' // Твой задеплоенный фронтенд
];

app.use(cors({
  origin: function (origin, callback) {
    // Разрешаем запросы без origin (например, от Postman) или если origin в списке
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const User = sequelize.define('user', { 
  id: {
    type: Sequelize.INTEGER, 
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

const Favorite = sequelize.define('favorite', { 
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tmdbId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'tmdbId']
    }
  ]
});


// Маршрут для получения списка пользователей
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Добавьте этот маршрут перед маршрутом запуска сервера

// Маршрут для получения данных пользователя
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username'], // Выбираем необходимые поля
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Маршрут для получения популярных фильмов через discover
app.get("/api/movies/popular", async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: API_KEY,
        language: "ru-RU",
        sort_by: "popularity.desc",
        "vote_average.gte": 5,
        "vote_count.gte": 100,
        with_original_language: "en",
        page: page
      }
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Ошибка при получении популярных фильмов:", error);
    res.status(500).json({ message: "Ошибка получения данных" });
  }
});

// Маршрут для получения популярных сериалов через discover
app.get("/api/series/popular", async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/tv", {
      params: {
        api_key: API_KEY,
        language: "ru-RU",
        sort_by: "popularity.desc",
        "vote_average.gte": 5,
        "vote_count.gte": 100,
        with_original_language: "en",
        page: page
      }
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Ошибка при получении популярных сериалов:", error);
    res.status(500).json({ message: "Ошибка получения данных" });
  }
});



// Маршрут для получения деталей фильма
app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: API_KEY, 
        language: "ru-RU" 
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ошибка при получении деталей фильма:", error);
    res.status(500).json({ message: "Ошибка получения данных" });
  }
});

// Маршрут для получения деталей сериала
app.get("/api/series/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
      params: {
        api_key: API_KEY,
        language: "ru-RU"
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ошибка при получении деталей сериала:", error);
    res.status(500).json({ message: "Ошибка получения данных" });
  }
});



// Маршрут для проверки избранного
app.get("/api/favorites/check/:userId/:contentId", async (req, res) => {
  const { userId, contentId } = req.params;
  try {
    const favorite = await Favorite.findOne({
      where: {
        userId,
        tmdbId: contentId
      }
    });
    if (favorite) {
      res.status(200).json({ isFavorite: true, favoriteId: favorite.id });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  console.log("Получен запрос на избранное пользователя:", userId);

  if (isNaN(userId)) {
    console.error("Ошибка: Неверный формат userId");
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const favorites = await Favorite.findAll({ where: { userId } });
    console.log("Избранные для пользователя:", userId, favorites);
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Ошибка при получении избранного:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/favorites", async (req, res) => {
  const { userId, tmdbId, type } = req.body;
  console.log("Добавление в избранное:", { userId, tmdbId, type });

  if (!userId || !tmdbId || !type) {
    console.error("Ошибка: userId, tmdbId или type отсутствуют");
    return res.status(400).json({ message: "User ID, tmdbId, and type are required" });
  }

  try {
    // Проверяем, существует ли уже такая запись
    const existingFavorite = await Favorite.findOne({ where: { userId, tmdbId } });
    if (existingFavorite) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    await Favorite.create({ userId, tmdbId, type });
    console.log("Успешно добавлено в избранное:", { userId, tmdbId, type });
    res.status(201).json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Ошибка при добавлении в избранное:", error);
    res.status(500).json({ message: "Error adding to favorites" });
  }
});


app.delete("/api/favorites/:userId/:tmdbId", async (req, res) => {
  const { userId, tmdbId } = req.params;
  console.log("Удаление из избранного:", { userId, tmdbId });

  try {
    await Favorite.destroy({ where: { userId, tmdbId } });
    console.log("Успешно удалено из избранного:", { userId, tmdbId });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error);
    res.status(500).json({ message: "Error removing from favorites" });
  }
});


// Регистрация пользователя
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ where: { username } });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Маршрут для логина
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Возвращаем userId и username
    res.status(200).json({ message: "Login successful", userId: user.id, username: user.username });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/search/movies", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: API_KEY,
        language: "ru-RU",
        query: query,
        include_adult: false,
        page: 1
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ошибка при поиске фильмов:", error);
    res.status(500).json({ message: "Ошибка при поиске фильмов" });
  }
});

// Маршрут для обычного поиска сериалов по названию (по аналогии)
app.get("/api/search/series", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/tv", {
      params: {
        api_key: API_KEY,
        language: "ru-RU",
        query: query,
        include_adult: false,
        page: 1
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ошибка при поиске сериалов:", error);
    res.status(500).json({ message: "Ошибка при поиске сериалов" });
  }
});


// Маршрут для продвинутого поиска фильмов (discover)
app.get("/api/discover/movie", async (req, res) => {
  const {
    with_genres,
    primary_release_date_gte,
    primary_release_date_lte,
    with_cast,
    sort_by,
    page
  } = req.query;

  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: API_KEY,
        language: "ru-RU",
        sort_by: sort_by || "popularity.desc",
        include_adult: false,
        include_video: false,
        page: page || 1,
        with_genres: with_genres,
        "primary_release_date.gte": primary_release_date_gte,
        "primary_release_date.lte": primary_release_date_lte,
        with_cast: with_cast
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ошибка при продвинутом поиске фильмов:", error);
    res.status(500).json({ message: "Ошибка при продвинутом поиске фильмов" });
  }
});

// Маршрут для продвинутого поиска сериалов (discover) - по аналогии
app.get("/api/discover/tv", async (req, res) => {
  const {
    with_genres,
    first_air_date_gte,
    first_air_date_lte,
    with_cast,
    sort_by,
    page
  } = req.query;

  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/tv", {
      params: {
        api_key: API_KEY,
        language: "ru-RU",
        sort_by: sort_by || "popularity.desc",
        include_adult: false,
        include_video: false,
        page: page || 1,
        with_genres: with_genres,
        "first_air_date.gte": first_air_date_gte,
        "first_air_date.lte": first_air_date_lte,
        with_cast: with_cast
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ошибка при продвинутом поиске сериалов:", error);
    res.status(500).json({ message: "Ошибка при продвинутом поиске сериалов" });
  }
});

// Запуск сервера
sequelize.sync().then(() => {
  app.listen(process.env.port, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});

module.exports = {
  User,
  sequelize
};
