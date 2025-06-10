# StudyPlanner

A brief description of your project, its purpose, and functionality. This study
planner is designed to help users stay organized with their studies, tasks, and
learning objectives.

Features include:

- List of features
- Key functionalities of the application
- Automated task schedules based on user behaviors
- Advanced reporting and analytics to track study progress
- Integration with personal advice through IA

Installation Guidelines:

- Step-by-step guides on how to install, setup and use the project locally.
- Prerequisites like Node.js, MongoDB and other dependencies

```bash
git clone https://github.com/yourusername/StudyPlanner.git
cd StudyPlanner
nmp install
```

## Repository Overview

This project is a Node.js/Express application for an AI-assisted study planner. The `package.json` references `app.js` as the main entry point and includes common development tools such as eslint and jest. Key dependencies include Express for routing, Mongoose for MongoDB access, and JWT/bcrypt for authentication.

### Server Code
- **`app.js`** configures middleware (helmet, morgan, rate limiting) and listens on a port. Note that several middleware setups still contain typos that need fixing.
- **`db.js`** manages the MongoDB connection using Mongoose and listens for connection events.

### Data Models
- **User model** (`models/user.js`) defines fields for username, email, and hashed passwords. It hints at account security features but some helpers, such as `findByCredentials`, are missing.
- **Task model** (`models/task.js`) stores tasks with title, description, due date validation, completion status, and priority level.

### API Routes
- **User routes** (`routes/userRoutes.js`) expose `/register` and `/login` endpoints using JWT-based authentication.
- **Task routes** (`routes/taskRoutes.js`) include rate limiting and provide a paginated task listing via `GET /` as well as task retrieval with `GET /:id`.

### Front-End
Static files (`index.html`, `style.css`, and `main.js`) offer a simple interface that fetches and adds tasks. The HTML page still contains unresolved merge conflict markers around a script tag.

### Additional Files
- MongoDB Realm configs reside in directories like `data_sources/mongodb-atlas/` and `sync/`.
- `chatgpt_automation.py` shows OpenAI and GitHub automation for issue and project management.
- Environment templates in `environments/*.json` contain placeholders for configuration values.

### Getting Started
1. Install dependencies and run the server (`npm start` or `npm run dev`).
2. Configure environment variables (MongoDB URI, JWT secret, etc.).
3. Use the API routes to manage users and tasks.

### Suggested Next Steps for Contributors
- Fix typos in `app.js` and the unfinished sections in the front-end files.
- Implement missing helpers like `findByCredentials` in `models/user.js`.
- Clean up merge conflict markers in `index.html`.
- Expand tests to validate API functionality.
- Review MongoDB Realm/Device Sync configuration if remote syncing is intended.

