Project Name

Description

This project is built using the NestJS framework for building scalable and efficient server-side applications.

Project setup

$ yarn install

Compile and run the project

# development
$ yarn run start

# watch mode
$ yarn run start:dev

Run with Docker

$ docker-compose up

Database Migration (Prisma)

$ npx prisma migrate dev

Addons Feature

JWT Signup/Login - Secure authentication with JWT tokens.

Pagination - Efficiently paginate API responses for better performance.

Signin Status - Retrieve and manage user authentication state.

Profile Picture - Users can upload and manage their profile pictures.

Dependencies (Non-Built-in NestJS Packages)

@prisma/client - ORM for database management.

bcrypt - Password hashing for authentication.

passport - Authentication middleware.

passport-jwt - JWT strategy for authentication.

passport-local - Local authentication strategy.

class-validator - Validation for DTOs.

class-transformer - Transform objects between layers.

Run Tests

# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov

License

This project is MIT licensed.