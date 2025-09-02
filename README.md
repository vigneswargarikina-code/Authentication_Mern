# MERN Auth

A full-stack authentication system built with MongoDB, Express, React, and Node.js. Features include user registration, login, email verification, password reset, and JWT-based authentication.

## Features

- User registration and login
- Email verification via OTP
- Password reset via OTP
- JWT authentication with cookies
- Protected routes
- Responsive React frontend with Tailwind CSS

## Project Structure

```
client/      # React frontend
server/      # Node.js/Express backend
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account
- Gmail account for sending emails (App Password required)

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/vigneswargarikina-code/Mern_Auth.git
cd Mern_Auth
```

#### 2. Install dependencies

```sh
cd server
npm install
cd ../client
npm install
```

#### 3. Configure environment variables

- Edit `server/.env` and `client/.env` with your MongoDB URI and Gmail credentials.

#### 4. Start the backend server

```sh
cd server
npm run server
```

#### 5. Start the frontend

```sh
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Deployment

To deploy, set your environment variables for production and use a process manager like PM2 for the backend.

## Commands to Push to GitHub

```sh
git init
git remote add origin https://github.com/vigneswargarikina-code/Mern_Auth.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## License

MIT