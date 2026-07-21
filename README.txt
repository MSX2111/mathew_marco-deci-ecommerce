# E-Commerce Fullstack Project

A fullstack e-commerce application with a React + Vite storefront and an Express backend that uses PostgreSQL, MongoDB, and Prisma.

## GitHub repository

https://github.com/MSX2111/mathew_marco-deci-ecommerce

## Tools used

- Frontend: React 19, Vite, Axios, plain CSS
- Backend: Node.js, Express 5, Prisma 7, PostgreSQL, MongoDB, Mongoose, Nodemailer
- Dev: Docker Compose, dotenv, cors, Prisma Client

## Run the project locally

1. Copy environment variables
   - Create `server/.env` from `server/.env.example`
   - Create `client/.env` if you want to override the frontend API base URL

2. Install dependencies
   - `cd e-commerce/server && npm install`
   - `cd e-commerce/client && npm install`

3. Seed the database
   - `cd e-commerce/server && npm run seed`

4. Start the app
   - `cd e-commerce/server && npm run dev`
   - `cd e-commerce/client && npm run dev`

## Run with Docker

From the project root:

```bash
cd e-commerce
docker compose up --build
```

This brings up the frontend, backend, PostgreSQL, and MongoDB services.

## Environment variables

Use the following values in `server/.env`:

```env
DATABASE_URL="postgresql://postgres:16122009@localhost:3000/ecommerce_db?schema=public"
MONGODB_USERNAME="mathewmekaeel_db_user"
MONGODB_PASSWORD="j9NBw6K0XgEuDQAX"
MONGODB_URI="mongodb://mathewmekaeel_db_user:16122009@ac-nynuhzo-shard-00-00.yodzbjs.mongodb.net:27017,ac-nynuhzo-shard-00-01.yodzbjs.mongodb.net:27017,ac-nynuhzo-shard-00-02.yodzbjs.mongodb.net:27017/?ssl=true&replicaSet=atlas-uuno0m-shard-0&authSource=admin&appName=ecommerce"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=mathewmekaeel@gmail.com
EMAIL_PASS=isthzhbzgzuncini
```

Use this in `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Extra info

- The frontend imports shared CSS from `client/src/styles`.
- The backend seed script populates sample users, products, and a cart.
- Keep `.env` files private and do not commit sensitive credentials.
