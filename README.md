# Mini URL Frontend

This is the frontend application for the Mini URL shortener project, built with Vue.js. It provides a user interface for interacting with the backend service, allowing users to register, log in, shorten URLs, manage their shortened URLs, and access redirected links.

You can try it out at [Mini URL](https://miniurl.zeabur.app/)

For the backend service, visit the [Mini URL Backend](https://github.com/ViviSun0725/Mini-URL_backend) repository.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
## Features

- User authentication (Login, Registration)
- URL shortening form
- Display and management of user's shortened URLs
- Redirection handling for short URLs
- Protected link page for password-protected URLs

## Technologies Used

- Vue.js 3 (Frontend Framework)
- Vite (Build Tool)
- Pinia (State Management)
- Vue Router (Routing)
- Axios (HTTP Client for API calls)
- Bootstrap 5 (CSS Framework)

## Getting Started

Follow these instructions to set up and run the frontend locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation

1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the `Frontend` directory based on the `.env.template` file. This file will store your configuration, such as the backend API URL.

```
# .env
VITE_APP_BACKEND_URL="http://localhost:3000" # Or the URL where your backend is running
```

### Running the Application

-   **Development Mode:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

-   **Build for Production:**
    ```bash
    npm run build
    ```
    This command compiles the application into static files in the `dist` directory.