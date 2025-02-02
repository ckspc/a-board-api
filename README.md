# NestJS Blog API

A robust and scalable blog API built with NestJS, featuring secure authentication, post management, and user profiles.

## Features

- 🔐 **Secure Authentication**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Sign-in status tracking
  
- 👤 **User Management**
  - User registration and login
  - Profile picture management
  - User status tracking
  
- 📝 **Content Management**
  - Create and manage blog posts
  - Comment system
  - Post categorization
  
- 🛠 **Technical Features**
  - PostgreSQL database with Prisma ORM
  - RESTful API design
  - Input validation and sanitization
  - Pagination support
  - Docker support
  - Comprehensive test coverage

## Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- PostgreSQL
- Docker (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

## Running the Application

### Development Mode
```bash
# Start the application
yarn run start

# Watch mode
yarn run start:dev
```

### Docker
```bash
# Run with Docker Compose
docker-compose up
```

## Testing

```bash
# Run unit tests
yarn run test

# Run e2e tests
yarn run test:e2e

# Generate test coverage
yarn run test:cov
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── posts/          # Posts module
├── comments/       # Comments module
├── users/          # Users module
├── prisma/         # Prisma configuration and schema
├── common/         # Shared resources
└── app.module.ts   # Main application module
```

## Dependencies

Key dependencies used in this project:

- **Framework**
  - NestJS - Progressive Node.js framework

- **Database**
  - @prisma/client - Modern database access
  - PostgreSQL - Primary database

- **Authentication**
  - passport - Authentication middleware
  - passport-jwt - JWT authentication strategy
  - passport-local - Username/password authentication
  - bcrypt - Password hashing

- **Validation**
  - class-validator - Input validation
  - class-transformer - Object transformation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
