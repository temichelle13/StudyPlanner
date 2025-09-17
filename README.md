# StudyPlanner

An AI-assisted study planner web application designed to help students organize their studies, manage tasks, and track their learning progress effectively. Built with Node.js, Express, MongoDB, and modern web technologies.

## ✨ Features

### Current Features ✅
- **User Authentication**: Secure JWT-based registration and login system
- **Task Management**: Create, read, update, and delete study tasks
- **Due Date Tracking**: Task scheduling with due date validation
- **Priority Levels**: Organize tasks by Low, Medium, and High priority
- **Task Completion**: Mark tasks as completed and track progress
- **Responsive Design**: Works on desktop and mobile devices
- **Input Validation**: Comprehensive form validation and sanitization
- **Security**: Rate limiting, input sanitization, and secure headers

### Planned Features 📋
- **AI-Powered Recommendations**: Intelligent task prioritization and study suggestions
- **Smart Scheduling**: Automated study schedule generation
- **Progress Analytics**: Study habit analysis and performance tracking
- **Calendar Integration**: Sync with external calendar applications
- **Achievement System**: Gamification with goals and rewards
- **Study Session Tracking**: Time tracking and productivity insights

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/temichelle13/StudyPlanner.git
cd StudyPlanner
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration:
# - MONGODB_URI=your_mongodb_connection_string
# - JWT_SECRET=your_jwt_secret_key
# - PORT=3000
```

4. **Start the application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

5. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing and security

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with responsive design
- **JavaScript**: Dynamic functionality and API communication
- **Fetch API**: HTTP client for backend communication

### Development Tools
- **Jest**: Testing framework with coverage reporting
- **ESLint**: Code linting and style enforcement
- **Nodemon**: Development server with auto-reload
- **GitHub Actions**: Continuous integration and deployment

### Security & Monitoring
- **Helmet**: Security headers middleware
- **Morgan**: HTTP request logging
- **Rate Limiting**: Brute force attack prevention
- **Input Validation**: Data sanitization and validation

## 📁 Project Structure

```
StudyPlanner/
├── models/             # Database models
│   ├── user.js        # User schema and methods
│   └── task.js        # Task schema and validation
├── routes/            # API endpoint definitions
│   ├── userRoutes.js  # Authentication endpoints
│   └── taskRoutes.js  # Task management endpoints
├── test/              # Test suites
│   └── taskModel.test.js
├── .github/           # GitHub workflows and templates
├── app.js            # Express server configuration
├── db.js             # Database connection setup
├── main.js           # Frontend JavaScript functionality
├── index.html        # Main application interface
├── style.css         # Application styling
└── PROJECT_TIMELINE.md # Development roadmap
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /register` - User registration
- `POST /login` - User authentication

### Task Management Endpoints
- `GET /api/tasks` - Retrieve user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🚀 Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

3. **Test your changes**
```bash
npm test
npm run lint
```

4. **Submit a pull request**
- Provide clear description of changes
- Ensure all tests pass
- Request review from maintainers

## 📈 Current Development Status

For detailed information about the development timeline, milestones, and upcoming features, see [PROJECT_TIMELINE.md](./PROJECT_TIMELINE.md).

**Current Phase**: Frontend Enhancement (Week 9-10)
- ✅ Core functionality complete
- 🔄 UI/UX improvements in progress
- 📋 AI features and advanced analytics planned

## 🤝 Contributing

We welcome contributions! Please see our contribution guidelines:

1. **Issues**: Report bugs or suggest features via GitHub Issues
2. **Pull Requests**: Submit PRs for bug fixes or new features
3. **Code Style**: Follow ESLint configuration and existing patterns
4. **Testing**: Include tests for new functionality
5. **Documentation**: Update relevant documentation

## 📋 Known Issues & TODO

### Current Issues
- [ ] Fix ESLint warnings and errors
- [ ] Clean up merge conflict markers in HTML
- [ ] Improve error handling and user feedback
- [ ] Add comprehensive input validation

### Upcoming Features
- [ ] AI-powered study recommendations
- [ ] Calendar integration
- [ ] Progress analytics dashboard
- [ ] Mobile app development
- [ ] Social features and study groups

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check our [PROJECT_TIMELINE.md](./PROJECT_TIMELINE.md) for detailed development information
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/temichelle13/StudyPlanner/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/temichelle13/StudyPlanner/discussions)

---

*Built with ❤️ for students everywhere*