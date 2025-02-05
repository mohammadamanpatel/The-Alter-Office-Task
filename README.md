# 🌐 **The Alter Office Task** 🚀


### 🌐 **URL Shortenig App**

Welcome to **The Alter Office Task**! 🎉 This is a full-stack application designed to simplify URL shortening, user authentication, and URL usage analytics. Built using cutting-edge technologies like **Node.js**, **Express**, **MongoDB**, and **React**, this app showcases a powerful combination of backend and frontend development. Let's dive in! 😎

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
9. [API Routes](#-api-routes)
10. [Contributing](#-contributing)


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

### **Key Files:**
- **server.js**: The heart of the backend, running the Express server 💻
- **auth.routes.js**: Handles authentication and Google OAuth 🌐
- **url.routes.js**: Manages the URL shortening and analytics 🔗
- **rate.limiter.js**: Ensures rate-limiting on sensitive routes 🚨
- **DB.config.js**: Configures MongoDB database 🗄️
- **Redis.config.js**: Configures Redis for caching and rate-limiting 🔥
- **App.jsx**: Main React component 🖥️

---

## 📝 **Installation**

Follow these steps to set up the project on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/the-alter-office-task.git
cd the-alter-office-task
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
