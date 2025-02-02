Project Name

Description

A NestJS-based project with additional features like JWT authentication and pagination.

Addons Features

JWT Signup: Implements authentication using JSON Web Tokens (JWT) with @nestjs/jwt and passport-jwt.

Pagination: Supports paginated responses for API endpoints.

Dependencies

These are the extra dependencies beyond NestJS core:

@nestjs/jwt: Handles JWT authentication.

@nestjs/passport: Integrates Passport.js authentication.

@prisma/client: Prisma ORM for database interactions.

bcrypt: For hashing passwords securely.

class-validator & class-transformer: Enables DTO validation.

passport, passport-jwt, passport-local: Authentication strategies.

Setup and Run

Ensure you have Docker installed and running before proceeding.

# Install dependencies
$ yarn install

# Start database and services
$ docker-compose up -d

# Run Prisma migrations
$ yarn prisma migrate dev

# Start development server
$ yarn start:dev

# Test
$ yarn test

Deployment

For production, make sure to configure environment variables properly and use appropriate database connections.

Enjoy building with NestJS! 🚀