# Commonality

**Where People Who Aren't "People People" Meet People**

Commonality is a social networking application designed to connect individuals with shared interests for 1-on-1 meetups or small group activities. Unlike traditional meetup apps that focus on large scheduled events, Commonality helps you find people to do specific activities with - whether that's finding a tennis partner, a jam session buddy, or someone to play Warhammer with.

## 🎯 Vision

Commonality exists to help people find others in their area with similar interests to get together and DO stuff. It's not an events app or a general friend-finder - it's specifically designed for connecting people who want to engage in shared activities.

## 🚀 Features

### Core Functionality
- **Profile Creation**: Users create profiles with photos, bios, and interest tags
- **Interest Matching**: Find people who share your specific interests
- **1-on-1 Connections**: Connect with individuals for shared activities
- **Messaging System**: Built-in communication platform for planning meetups


### Interest Categories
- Sports & Fitness (tennis, hiking, gym partners)
- Creative Arts (music, pottery, crafts)
- Gaming (board games, Warhammer, video games)
- Learning & Discussion (book clubs, study groups)
- And many more customizable interests

### Safety Features
- One-sided matching (you can message others only when they match you back)
- Profile verification
- Secure messaging within the platform

## 🛠️ Tech Stack

### Frontend
- **React Router** - Modern React framework for server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Flowbite React** - Component library
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Backend
- **Node.js** with **Express** - Server framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Primary database
- **Redis** - Session management and caching
- **Argon2** - Secure password hashing
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and management
- **Mailgun** - Email services

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development environment
- **Nginx** - Reverse proxy and SSL termination

## 🏗️ Architecture

The application follows a microservices architecture with three main components:

1. **Frontend** (`/frontend`) - React Router application
2. **Backend** (`/backend`) - Express API server
3. **Database** - PostgreSQL with Redis for caching

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL 14+
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd commonality
   ```

2. **Environment Setup**
   Create a `project.env` file in the root directory with:
   ```env
   # Database
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=commonality
   
   # Redis
   REDIS_URL=redis://redis:6379
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Mailgun
   MAILGUN_API_KEY=your_mailgun_key
   MAILGUN_DOMAIN=your_mailgun_domain
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Session
   SESSION_SECRET=your_session_secret
   ```

3. **Start the development environment**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Development Commands

**Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

**Backend:**
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run clean
```

## 📁 Project Structure

```
commonality/
├── frontend/                 # React Router frontend
│   ├── app/                 # Main application code
│   │   ├── components/      # Reusable React components
│   │   ├── layouts/         # Page layouts
│   │   ├── routes/          # Route components
│   │   └── utils/           # Utilities and helpers
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express backend
│   ├── src/
│   │   ├── apis/            # API routes and controllers
│   │   ├── utils/           # Utilities and helpers
│   │   └── index.ts         # Entry point
│   └── package.json
├── sql/                      # Database setup
├── reverse-proxy/           # Nginx configuration
├── documentation/           # Project documentation
└── docker-compose.yml       # Docker services
```

## 🔧 API Endpoints

### Authentication
- `POST /apis/sign-up` - User registration
- `POST /apis/sign-in` - User login
- `POST /apis/sign-out` - User logout
- `POST /apis/activate` - Account activation

### Users
- `GET /apis/users` - Get user profiles
- `GET /apis/users/:id` - Get specific user
- `PUT /apis/users/:id` - Update user profile

### Interests
- `GET /apis/interests` - Get all interests
- `POST /apis/interests` - Add new interest
- `DELETE /apis/interests/:id` - Remove interest

### Matching
- `GET /apis/matching` - Find matches based on interests
- `POST /apis/matching` - Create match request
- `PUT /apis/matching/:id` - Accept/reject match

### Messages
- `GET /apis/messages` - Get user messages
- `POST /apis/messages` - Send new message
- `GET /apis/messages/:id` - Get specific conversation

## 🧪 Testing

- Frontend: Type checking with TypeScript
- Backend: Linting with ts-standard

## 🚀 Deployment

The application is containerized for easy deployment. See `production.yml` for production deployment configuration.

### Production Setup
1. Configure environment variables
2. Set up SSL certificates
3. Configure reverse proxy
4. Deploy with Docker Compose

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.


**Commonality** - Because shared interests make the best connections.