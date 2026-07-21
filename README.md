# E-Commerce Fullstack Project

A complete Node.js / Express backend and React + Vite frontend e-commerce application with PostgreSQL, MongoDB, Jest/Supertest integration tests, React Testing Library, MSW mocking, and Docker Compose support.

## Features

- Backend API using Express, Prisma, PostgreSQL, MongoDB, and Nodemailer
- User authentication workflow, product listing, cart management, and admin logs
- Frontend application using React 19 and Vite
- Protected routes and dashboard/store/cart pages
- Dockerized backend, frontend, PostgreSQL, and MongoDB services

## Testing

- The project is packaged for Docker and ready to run without local test tooling dependencies.

## Repository structure

- `client/`: React frontend app
- `e-commerce/client/`: actual frontend code used in this workspace
- `e-commerce/server/`: Express backend API and tests
- `Dockerfile`: root Dockerfile building backend and frontend
- `docker-compose.yml`: local development stack

## Setup

1. Copy environment variables
   - Create `server/.env` from `.env.example` with your own credentials
   - Create `client/.env` if you want to override the frontend API base URL

2. Install dependencies
   - Backend: `cd e-commerce/server && npm install`
   - Frontend: `cd e-commerce/client && npm install`

3. Run locally
   - Backend: `cd e-commerce/server && npm run dev`
   - Frontend: `cd e-commerce/client && npm run dev`

4. Run tests
   - Backend: `cd e-commerce/server && npm test`
   - Frontend: `cd e-commerce/client && npm test`

## Docker

Start the full stack with:

```bash
cd e-commerce
docker compose up --build
```

This starts:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`
- PostgreSQL on `localhost:5432`
- MongoDB on `localhost:27017`

## Environment variables

Use the following in `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public
MONGODB_URI=mongodb://root:example@localhost:27017/?authSource=admin
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

Use the following in `client/.env` for local frontend development:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Notes

- The backend server exports the Express `app` so Supertest can run integration tests without starting the HTTP listener.
- The frontend uses `VITE_API_BASE_URL` to configure the Axios API base URL.
- Keep `.env` files private and do not commit sensitive credentials.
