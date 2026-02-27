# 📦 Enterprise Inventory & Order Management API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

A robust, highly scalable backend application built with **NestJS**, **Prisma ORM**, and **PostgreSQL**. This system is designed to manage complex e-commerce and supply chain operations, featuring comprehensive inventory tracking, transactional order fulfillment, and strict Role-Based Access Control (RBAC).

Built with a strong emphasis on clean architecture, separation of concerns, and security best practices.

---

## ✨ Key Features

* **Advanced Role-Based Access Control (RBAC):** Distinct authentication flows and database tables for `Customers` and `Admins`. Secured via custom Decorators (`@Roles`) and Guards (`JwtGuard`, `RolesGuard`, `LocalGuard`).
* **Transactional Safety:** Critical operations, such as inventory transfers between warehouses and order placements, utilize database transactions to ensure data integrity and prevent race conditions.
* **Smart Order Fulfillment:** Automated stock validation and total price calculation during checkout.
* **Robust Security:** Passwords hashed via `bcrypt`. API endpoints protected by stateless JWT authentication strategies. Payload validation handled cleanly via NestJS Validation Pipes (`class-validator`).
* **Containerized Deployment:** Fully Dockerized local development environment utilizing `docker-compose`.

---

## 🏗️ Architecture Overview

The application follows a modular, domain-driven design pattern:

* **Modules:** Independent domains (`Products`, `Warehouses`, `Inventories`, `Customers`, `Orders`, `Admins`, `Auth`).
* **Controllers:** Handle HTTP routing and payload validation via DTOs.
* **Services:** Contain isolated business logic and interact with the database.
* **Prisma Layer:** Serves as the single source of truth for the database schema, utilizing migrations to track state.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **PostgreSQL** (or Docker Desktop to run the provided container)
* **npm** or **yarn**

### 1. Clone & Install
```bash
git clone https://github.com/DavidkJun/warehouse-storage-system
```
```bash
cd warehouse-storage-system
```
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and configure the following variables. *(Note: Never commit your actual `.env` file to version control)*:
```env
# Application Setup
PORT=3000

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_db?schema=public"

# Authentication Security
JWT_SECRET="your_secret_jwt_key"
JWT_EXPIRATION="24h"
```

### 3. Database Setup (Docker & Prisma)
If you don't have a local Postgres instance, spin up the Docker container:
```bash
docker-compose up -d
```
Run Prisma migrations to generate the schema and TypeScript types:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

---

## 🔐 Security & Authentication Flow

This API utilizes a dual-strategy authentication system to strictly separate Admin and Customer scopes:

1. **Local Strategies:** Separate `LocalStrategy` and `AdminLocalStrategy` validate credentials against their respective database tables.
2. **JWT Issuance:** Upon successful login, the `AuthService` issues a JWT containing the user's UUID and specific `role`.
3. **Route Protection:** The `JwtStrategy` unpacks the token, while the `RolesGuard` strictly enforces authorization rules (e.g., ensuring only Admins can patch order statuses or transfer inventory).

---

## 📡 Core API Endpoints

*Note: This is a high-level overview. All POST/PATCH routes validate incoming data using DTOs.*

### Authentication
* `POST /auth/login` - Customer login
* `POST /auth/admin/login` - Administrator login

### Orders
* `POST /orders` - Place a new order (Validates stock, calculates price) - *[Customer]*
* `GET /orders/:id` - Retrieve order details - *[Customer/Admin]*
* `PATCH /orders/:id/status` - Update order status (NEW, SHIPPED, etc.) - *[Admin Only]*

### Inventory & Warehouses
* `POST /inventory/transfer` - Transactional stock transfer between locations - *[Admin Only]*
* `GET /warehouses/:id/stock` - View current stock levels - *[Admin Only]*

### Products & Customers
* Standard CRUD operations available (`GET`, `POST`, `PATCH`, `DELETE`). Restricted by RBAC.

---

## 🧪 Testing

The project includes End-to-End (e2e) tests to ensure critical user journeys and transactional operations function flawlessly in an isolated environment.

```bash
# Run e2e tests
npm run test:e2e
```

---

## ☁️ Deployment

This application is built to be cloud-native and easily deployable to cloud platforms.
1. Ensure `NODE_ENV=production`.
2. Run `npm run build` to compile the TypeScript application to the `/dist` folder.
3. The built application and database can be deployed using standard container orchestration or via CI/CD pipelines targeting cloud providers.
