# 🌐 **The Alter Office Task** 🚀


Welcome to **The Alter Office Task**! 🎉 This is a full-stack application designed to simplify URL shortening, user authentication, and URL usage analytics. Built using cutting-edge technologies like **Node.js**, **Express**, **MongoDB**, and **React**, this app showcases a powerful combination of backend and frontend development. Let's dive in! 😎

---

## 🗂 **Table of Contents**

1. [Project Overview](#-project-overview)
2. [Technologies Used](#-technologies-used)
3. [Folder Structure](#-folder-structure)
4. [API Documentation](#-api-documentation)
5. [Video Demonstration](#-video-demonstration)
6. [Video Demonstration of unit Testing](#-video-demonstration)
7. [Installation](#-installation)
8. [Running the Application](#-running-the-application)
9. [Environment Variables](#-environment-variables)
10. [API Routes](#-api-routes)
11. [Contributing](#-contributing)


## 📊 **Project Overview**

**The Alter Office Task** enables users to:

- Shorten long URLs 🔗
- Track shortened URL analytics 📊
- Manage secure user authentication (with **Google OAuth** 🔒)
- Keep track of URL usage with **rate-limiting** 🔐

Built using **Node.js**, **Express**, **MongoDB**, **Redis**, and **React**, this application not only ensures performance but also offers a sleek, interactive frontend.

Key Features:
- 🔑 **Google OAuth** authentication
- 🔗 **Custom URL Shortening** with support for personalized aliases
- 📈 **Analytics Dashboard** for shortened URLs
- ⚙️ **Rate Limiting** to prevent abuse
- 🔒 **JWT Authentication** for secure access to API routes

---

## 🛠 **Technologies Used**

### **Frontend** (Client-side):
- 🖥️ **React.js**
- ⚡ **Axios**
- ⚙️ **Vite** (fast build tool)
- 🎨 **Tailwind CSS** (for beautiful, responsive UI)

### **Backend** (Server-side):
- 🟩 **Node.js**
- 🔧 **Express.js**
- 🛠️ **MongoDB** (via Mongoose)
- 🔒 **JWT Authentication**
- 🛑 **Express Rate Limit** (for rate-limiting)
- 🛠️ **Redis** (for caching and rate-limiting)
- 🧪 **Test** (Unit Testing with Mocha,Chai & SuperTest)
- 🌐 **Google OAuth2** for authentication
- 🍪 **Cookie-parser** (for session handling)

### **Tools & Libraries**:
- 🔄 **Nodemon** (for auto-reloading in development)
- 📦 **dotenv** (for managing environment variables)
- 🛡️ **CORS** (to handle cross-origin requests)

---

## 📂 **Folder Structure**

Here’s an overview of the project structure:

### **Frontend (Client-side)**

```
/client
  /public
  /src
    /components  (Reusable UI components)
    /redux       (State management)
    /Axiosconfig (API configuration)
    /assets      (Images, Icons)
  App.jsx
  App.css
  main.jsx
  vite.config.js
  package.json
  .gitignore
  README.md
```

### **Backend (Server-side)**

```
/backend
  /client       (React client-side for SSR)
  /config       (DB & Redis config)
  /controllers  (Handle requests and logic)
  /middlewares  (Custom middlewares)
  /models       (Database schemas like User, URL)
  /routes       (API routes for all actions)
  /utils        (Utility functions like rate limiters)
  .env          (Environment variables)
  server.js     (Main Express server)
  Testing.js    (Unit Testing)
  package.json
  .gitignore
```

---

## 📘 **API Documentation**

For a detailed description of the API, including request and response formats, refer to the full **API Documentation** here:  
[📄 API Documentation (Postman)](https://www.postman.com/joint-operations-cosmologist-64352344/workspace/url-shortner-docs/collection/30730048-00010ba2-fd51-456c-9c82-7234cfaaa6b0?action=share&creator=30730048)

---

## 🎥 **Video Demonstration**

Watch the **video demonstration** of this project in action here:  
[🎬 Video File (Google Drive)](https://drive.google.com/file/d/1jZEMyiXhFz8TGMjuREmDVnJSTdcQbCyZ/view?usp=sharing)

Watch the **video demonstration** of this unit tests in action here:  
[🎬 Video File (Google Drive)](https://drive.google.com/file/d/171Ztd1fMORCK7xIg6Be8GGwnNXZIf1jG/view?usp=sharing)

### **Key Files:**
- **server.js**: The heart of the backend, running the Express server 💻
- **auth.routes.js**: Handles authentication and Google OAuth 🌐
- **url.routes.js**: Manages the URL shortening and analytics 🔗
- **rate.limiter.js**: Ensures rate-limiting on sensitive routes 🚨
- **DB.config.js**: Configures MongoDB database 🗄️
- **Redis.config.js**: Configures Redis for caching and rate-limiting 🔥
- **Testing.js**: Handles all the unit test work using mocha,chai and supertest
- **App.jsx**: Main React component 🖥️

---

## 📝 **Installation**

Follow these steps to set up the project on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/mohammadamanpatel/The-Alter-Office-Task
cd The-Alter-Office-Task
```

### 2. Install dependencies for the backend

```bash
cd backend
npm install
```

### 3. Install dependencies for the frontend

```bash
cd client
npm install
```

### 4. Testing dependencies
```
npm test
```
---

## 🚀 **Running the Application**

Once everything is set up, follow these steps to run the app:

### 1. Start the backend server

```bash
cd backend
npm run dev
```

This will start the backend server with **nodemon**. Any changes you make will automatically restart the server.

### 2. Start the frontend server

```bash
cd client
npm run dev
```

This will launch the React development server.

### 3. Access the application

- The **frontend** will be available at [http://localhost:3000](http://localhost:3000).
- The **backend API** will be available at [http://localhost:5000](http://localhost:5000).

---

## 🧑‍💻 **Environment Variables**

Make sure to create a `.env` file in the `backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
REDIS_URI=your_redis_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
COOKIE_SECRET=your_cookie_secret
```

---

## 📡 **API Routes**

### Authentication Routes:
- **POST** `/auth/google`: Initiates Google OAuth for authentication 🌐
- **GET** `/auth/google/callback`: Handles the callback after Google authentication 🔑

### URL Routes:
- **POST** `/urls`: Shortens a URL 🔗
  - Request body: `{ "longUrl": "https://example.com" }`

- **GET** `/urls/:alias`: Redirects to the original URL 🔄

- **GET** `/analytics/urls/:alias`: Retrieves analytics for a shortened URL 📊

- AND MORE...

### Rate Limiting:
- Applied on sensitive routes such as URL shortening and analytics to protect against abuse ⚠️

---

## 🤝 **Contributing**

We welcome contributions to **The Alter Office Task**! If you want to contribute:

1. Fork the repository 🍴
2. Create a new branch (`git checkout -b feature-branch`) 🌿
3. Make your changes ✍️
4. Commit and push your changes 🚀
5. Create a pull request (PR) 🎉

---
=======

---

# 🌐 **The Alter Office Task** 🚀

Welcome to **The Alter Office Task**! 🎉 This full-stack application simplifies **URL shortening**, **user authentication**, and **URL usage analytics**, using cutting-edge technologies like **Node.js**, **Express**, **MongoDB**, **Redis**, **React**, and **Docker**. Let’s dive in! 😎

---

## 🗂 **Table of Contents**

1. [Project Overview](#-project-overview)
2. [Technologies Used](#-technologies-used)
3. [Folder Structure](#-folder-structure)
4. [API Documentation](#-api-documentation)
5. [Video Demonstration](#-video-demonstration)
6. [Installation](#-installation)
7. [Running the Application](#-running-the-application)
8. [Environment Variables](#-environment-variables)
9. [Docker Setup](#-docker-setup)
10. [API Routes](#-api-routes)
11. [Contributing](#-contributing)

---

## 📊 **Project Overview**

**The Alter Office Task** enables users to:

- 🔗 **Shorten long URLs**
- 📊 **Track URL usage analytics**
- 🔒 **Secure user authentication** with **Google OAuth**
- 🚀 **Rate Limiting** using **Redis** to prevent abuse

This application is Dockerized for easy setup and deployment. Redis is used for **caching** and **rate-limiting**, ensuring high performance and scalability.

Key Features:

- 🔑 **Google OAuth** authentication
- 🛠️ **Dockerized Backend and Frontend**
- 🔗 **Custom URL Shortening** with personalized aliases
- 📈 **Analytics Dashboard**
- 🔐 **Redis-based Rate Limiting** for enhanced protection
- ⚡ **JWT Authentication**

---

## 🛠 **Technologies Used**

### **Frontend (Client-side)**

- **React.js**
- **Axios**
- **Vite** (fast build tool)
- **Tailwind CSS**

### **Backend (Server-side)**

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Redis** (for caching and rate-limiting)
- **JWT Authentication**
- **Google OAuth2**
- **Mocha, Chai, SuperTest** (for Unit Testing)

### **Tools & Libraries**

- **Docker** (for containerization)
- **Nodemon** (development auto-reload)
- **dotenv** (environment variables)
- **Cookie-parser**
- **CORS**

---

## 📂 **Folder Structure**

```
/client            → React frontend
/backend           → Node.js backend
  /config          → DB & Redis configurations
  /controllers     → Business logic and request handling
  /middlewares     → Custom middlewares (auth, rate-limit, etc.)
  /models          → MongoDB schemas
  /routes          → API endpoints
  /utils           → Utility functions
  Dockerfile       → Docker configuration
  docker-compose.yml → Docker Compose configuration
```

---

## 📘 **API Documentation**

For detailed API specifications, refer to the [📄 API Documentation (Postman)](https://www.postman.com/joint-operations-cosmologist-64352344/workspace/url-shortner-docs/collection/30730048-00010ba2-fd51-456c-9c82-7234cfaaa6b0?action=share&creator=30730048).

---

## 🎥 **Video Demonstration**

- [🎬 Project Demonstration](https://drive.google.com/file/d/1jZEMyiXhFz8TGMjuREmDVnJSTdcQbCyZ/view?usp=sharing)
- [🎬 Unit Testing Demo](https://drive.google.com/file/d/171Ztd1fMORCK7xIg6Be8GGwnNXZIf1jG/view?usp=sharing)

---

## 📝 **Installation**

### 1. Clone the repository

```bash
git clone https://github.com/mohammadamanpatel/The-Alter-Office-Task
cd The-Alter-Office-Task
```

### 2. Set up Docker

Ensure you have **Docker** and **Docker Compose** installed on your system.

### 3. Create the `.env` file

Add the required environment variables in the `backend/.env` file (see [Environment Variables](#-environment-variables) for details).

### 4. Build and Start Services

```bash
docker-compose up --build
```

This will start both the **backend** and **frontend** services in Docker containers.

---

## 🚀 **Running the Application Locally**

### Start Docker Services

```bash
docker-compose up
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🧑‍💻 **Environment Variables**

Create a `.env` file in the `backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
REDIS_URI=your_upstash_redis_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
COOKIE_SECRET=your_cookie_secret
```

---

## 📦 **Docker Setup**

The project is Dockerized using a `Dockerfile` and `docker-compose.yml` for easy deployment and environment management.

### Dockerfile

Defines how to build the backend.

### docker-compose.yml

Manages the services, networking, and environment variables.

```yaml
version: "3.8"

services:
  app:
    build: .
    container_name: alter-office-task
    environment:
      - PORT=${PORT}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - CALL_BACK_URL=${CALL_BACK_URL}
      - FRONTEND_URL=${FRONTEND_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRY=${JWT_EXPIRY}
      - COOKIE_MAX_AGE=${COOKIE_MAX_AGE}
      - MONGO_URL=${MONGO_URL}
      - BASE_URL=${BASE_URL}
      - REDIS_STRING=${REDIS_STRING}
    ports:
      - "3000:3000"
    depends_on:
      - mongo
      - redis
    networks:
      - alter-office-network

  mongo:
    image: mongo:latest
    container_name: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=your_username
      - MONGO_INITDB_ROOT_PASSWORD=your_password
    volumes:
      - mongo_data:/data/db
    networks:
      - alter-office-network

  redis:
    image: redis:alpine
    container_name: redis
    networks:
      - alter-office-network

networks:
  alter-office-network:
    driver: bridge

volumes:
  mongo_data:
```

---

## 📡 **API Routes**

### **Authentication Routes**

- `POST /auth/google` → Google OAuth initiation
- `GET /auth/google/callback` → Google OAuth callback

### **URL Routes**

- `POST /shorten` → Shorten a URL
- `GET /urls/:alias` → Redirect to original URL
- `GET /analytics/urls/:alias` → Get URL analytics

---

## 🤝 **Contributing**

We welcome contributions to **The Alter Office Task**!

1. Fork the repository 🍴
2. Create a new branch (`git checkout -b feature-branch`) 🌿
3. Make changes ✍️
4. Commit and push 🚀
5. Create a pull request 🎉

---
