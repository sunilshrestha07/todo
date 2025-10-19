# 🚀 Todo API - Next.js 15 + MongoDB + TypeScript

A modern, full-stack Todo API built with Next.js 15, MongoDB, TypeScript, and comprehensive testing. Features RESTful API endpoints, OpenAPI documentation, validation, and a complete test suite.

## ✨ Features

- **🔐 User Authentication** - JWT-based authentication with signup/login
- **🔄 RESTful API** - Complete CRUD operations for todos
- **👤 User-Specific Data** - Todos are isolated per user
- **📊 MongoDB Integration** - Mongoose ODM with proper schema validation
- **🛡️ Type Safety** - Full TypeScript support with Zod validation
- **📚 API Documentation** - Interactive Swagger UI documentation
- **🧪 Comprehensive Testing** - Jest test suite with 100% API coverage
- **⚡ Next.js 15** - Latest features including async route params
- **🎨 Modern UI** - Tailwind CSS styling with authentication interface
- **🔧 Developer Experience** - ESLint, Turbopack, hot reloading

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── signup/    # User registration
│   │   │   └── login/     # User login
│   │   └── todo/          # Todo endpoints (protected)
│   └── api-docs/          # Swagger UI documentation
├── middleware/            # Authentication middleware
├── models/               # Mongoose schemas (User, Todo)
├── validation/           # Zod validation schemas
├── lib/                  # Database connection & JWT utilities
└── tests/                # Test files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/todo_app
   MONGODB_DB=todo_app
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - API docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🔐 Authentication

The application now includes user authentication with the following features:

### API Endpoints

**Authentication:**

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password

**Todos (Protected - requires JWT token):**

- `GET /api/todo` - Get all todos for the authenticated user
- `POST /api/todo` - Create a new todo
- `GET /api/todo/[id]` - Get a specific todo
- `PUT /api/todo/[id]` - Update a todo
- `DELETE /api/todo/[id]` - Delete a todo

### Usage Example

1. **Sign up a new user:**

   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

2. **Login:**

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

3. **Create a todo (with JWT token):**

   ```bash
   curl -X POST http://localhost:3000/api/todo \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"title": "My first todo", "description": "This is a test todo"}'
   ```

4. **Get all todos:**
   ```bash
   curl -X GET http://localhost:3000/api/todo \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### 🟢 GET /api/todo

**Get all todos**

```bash
curl http://localhost:3000/api/todo
```

**Response:**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 🟡 POST /api/todo

**Create a new todo**

```bash
curl -X POST http://localhost:3000/api/todo \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Next.js 15",
    "status": "pending"
  }'
```

**Request Body:**

```json
{
  "title": "string (3-100 chars)",
  "status": "pending" | "completed"
}
```

#### 🔵 GET /api/todo/{id}

**Get a specific todo**

```bash
curl http://localhost:3000/api/todo/507f1f77bcf86cd799439011
```

#### 🟠 PUT /api/todo/{id}

**Update a todo**

```bash
curl -X PUT http://localhost:3000/api/todo/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "status": "completed"
  }'
```

#### 🔴 DELETE /api/todo/{id}

**Delete a todo**

```bash
curl -X DELETE http://localhost:3000/api/todo/507f1f77bcf86cd799439011
```

### Error Responses

All endpoints return consistent error formats:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

- ✅ **14 test cases** covering all API endpoints
- ✅ **Success scenarios** - Happy path testing
- ✅ **Error scenarios** - Validation and error handling
- ✅ **Edge cases** - Invalid IDs, missing data, etc.

### Test Structure

```
__tests__/
└── todosRoute.test.ts    # Complete API route testing
src/tests/
└── todo.test.ts          # Basic smoke tests
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
```

### Code Quality

- **TypeScript** - Strict type checking enabled
- **ESLint** - Next.js recommended configuration
- **Prettier** - Consistent code formatting
- **Jest** - Unit and integration testing

### Database Schema

```typescript
interface User {
  _id: ObjectId;
  email: string; // Required, unique, validated
  password: string; // Required, hashed with bcrypt
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}

interface Todo {
  _id: ObjectId;
  title: string; // Required, 3-100 chars
  description?: string; // Optional, max 500 chars
  status: 'pending' | 'completed'; // Default: 'pending'
  userId: string; // Required, references User._id
  createdAt: Date; // Auto-generated
}
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description               | Default        |
| ---------------- | ------------------------- | -------------- |
| `MONGODB_URI`    | MongoDB connection string | Required       |
| `MONGODB_DB`     | Database name             | `nextjs_todos` |
| `JWT_SECRET`     | JWT signing secret        | Required       |
| `JWT_EXPIRES_IN` | JWT expiration time       | `7d`           |
| `NODE_ENV`       | Environment mode          | `development`  |

### MongoDB Setup

**Local MongoDB:**

```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
sudo apt install mongodb       # Ubuntu

# Start MongoDB service
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Add to `.env.local`

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Environment Variables for Production

Set these in your deployment platform:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app
MONGODB_DB=todo_app
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📦 Dependencies

### Core Dependencies

- **Next.js 15.5.2** - React framework
- **MongoDB/Mongoose** - Database and ODM
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Swagger UI** - API documentation

### Development Dependencies

- **Jest** - Testing framework
- **ESLint** - Code linting
- **Tailwind CSS** - Styling
- **Turbopack** - Fast bundler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript best practices
- Use conventional commit messages
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/todo/issues)
- **Documentation**: [API Docs](/api-docs)
- **Email**: your.email@example.com

---

**Built with ❤️ using Next.js 15, MongoDB, and TypeScript**
