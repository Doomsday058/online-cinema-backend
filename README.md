<div align="center">

# Основной API-сервер "FilmAdviser" (Node.js)

_Бэкенд-сервис на Node.js/Express для управления пользователями, избранным и базой данных._

</div>

<p align="center">
    <img src="https://img.shields.io/badge/status-live-success?style=for-the-badge" alt="Статус">
    <img src="https://img.shields.io/github/last-commit/Doomsday058/online-cinema-backend?style=for-the-badge" alt="Последний коммит">
    <img src="https://img.shields.io/badge/node.js-v18+-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
</p>

---

### 🏛️ Архитектура проекта

Этот сервис является центральной частью full-stack системы. Он хранит данные и предоставляет их как фронтенду, так и AI-сервису.

| Сервис | Описание | Репозиторий |
| :--- | :--- | :--- |
| 🎨 **Frontend (React)** | Пользовательский интерфейс. | **[Перейти](https://github.com/Doomsday058/online-cinema-frontend)** |
| ⚙️ **Backend (Node.js)** | Основной API для работы с пользователями. | _(текущий)_ |
| 🧠 **AI-Backend (Python)** | Сервис для генерации рекомендаций. | **[Перейти](https://github.com/Doomsday058/online-cinema-flask)** |

---

### 🚀 Основные возможности

| Функция | Описание |
| :--- | :--- |
| **🔑 Аутентификация** | Регистрация и логин пользователей с хешированием паролей. |
| **❤️ CRUD для избранного** | Добавление, получение и удаление фильмов из списка избранного. |
| **🔄 Проксирование запросов** | Обработка и кэширование некоторых запросов к TMDb API. |
| **🧠 Связь с AI-сервисом** | Предоставляет данные об избранном для сервиса рекомендаций. |

---

### 🛠️ Технологический стек

<p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/bcrypt-62A8E5?style=for-the-badge" alt="bcrypt" />
</p>

---

<details>
<summary>▶️ 📦  <strong>Инструкции по установке и запуску</strong></summary>

<br>

1.  **Клонируйте репозиторий:**
    ```bash
    git clone [https://github.com/Doomsday058/online-cinema-backend.git](https://github.com/Doomsday058/online-cinema-backend.git)
    cd online-cinema-backend
    ```

2.  **Установите зависимости:**
    ```bash
    npm install
    ```

3.  **Создайте файл `.env`** в корне проекта и добавьте переменные:
    ```
    # Строка подключения к базе данных PostgreSQL
    DATABASE_URL="postgres://..."

    # API ключ для The Movie Database
    TMDB_API_KEY="..."

    # Порт для локального запуска
    PORT="8000"
    ```

4.  **Запустите сервер:**
    ```bash
    node app.js
    ```

</details>
