# SoundStream - Music Streaming and Listening App

SoundStream is a modern, full-stack audio platform blending on-demand streaming with real-time social interaction. Built using the MERN stack and Socket.io, it features dedicated creator dashboards and innovative "Live Listening Rooms" for synchronized, communal listening and live chat. SoundStream delivers a premium, scalable experience designed for both content creators and interactive listeners.

## Features

-   **On-Demand Streaming:** Users can browse, search, and listen to a wide variety of audio content.
-   **Live Listening Rooms:** Join virtual rooms for synchronized communal listening sessions with real-time text chat, powered by Socket.io.
-   **Creator Dashboard:** Dedicated tools for content creators to manage their uploads, track analytics, and interact with their audience.
-   **Role-Based Access Control:** Secure JWT-based authentication ensures that different user roles (listeners, creators, admins) have appropriate access levels.
-   **Premium UI/UX:** A modern, responsive design built with Tailwind CSS, utilizing a "Modern Obsidian & Sapphire" color palette for an enterprise SaaS feel.
-   **Progressive Web App (PWA):** Installable on devices for a native-like experience with offline capabilities.

## Technologies Used

### Frontend
-   **React.js (v18):** UI library
-   **Vite:** Build tool & development server
-   **Tailwind CSS (v4):** Utility-first styling
-   **Redux Toolkit:** State management
-   **React Router DOM:** Client-side routing
-   **Socket.io-client:** Real-time communication client
-   **Axios:** HTTP client
-   **Vite PWA Plugin:** PWA configuration

### Backend
-   **Node.js & Express.js:** Server environment and framework
-   **MongoDB & Mongoose:** NoSQL database and ODM
-   **Socket.io:** Real-time communication server
-   **JWT (JSON Web Tokens):** Authentication
-   **Bcrypt.js:** Password hashing
-   **Multer:** File upload handling

## Project Structure

The project is organized into `frontend` and `backend` directories.

```
SoundStream/
├── backend/          # Node.js/Express server
│   ├── src/          # API controllers, models, routes, and socket logic
│   ├── .env          # Backend environment variables
│   └── server.js     # Entry point
└── frontend/         # React/Vite client
    ├── src/          # Components, pages, Redux store, contexts
    ├── .env          # Frontend environment variables
    └── index.html    # Entry point
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn
-   MongoDB (local instance or MongoDB Atlas cluster)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pawanmahajan029/SoundStream.git
    cd SoundStream
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    -   Create a `.env` file in the `backend` directory based on the `.env.example` file (you will need a MongoDB URI, JWT secret, etc.).
    -   Start the backend server:
        ```bash
        npm run dev
        ```

3.  **Frontend Setup:**
    Open a new terminal window/tab.
    ```bash
    cd frontend
    npm install
    ```
    -   Create a `.env` file in the `frontend` directory based on the `.env.example` file (typically just setting the API base URL).
    -   Start the frontend development server:
        ```bash
        npm run dev
        ```

The application should now be running. The frontend typically runs on `http://localhost:5173` and the backend on the port specified in your `.env` file (e.g., `http://localhost:3000`).

## Deployment

This project is configured for deployment on Render. Configuration files (`render.yaml`) are included in the root directory.

## Authors

-   Pawan Mahajan
-   Pradhuman Upadhyay
-   Purva Sharma
-   Rishabh Gautam
