# DevFlow

A productivity and task management application with integrated tools for workflow optimization.

## Features

### Dashboard
- KPI metrics and sprint progress tracking
- Mini calendar for events and deadlines
- Focus cell for priority tasks
- Workflow status bar
- Detailed task rows with status and metadata

### Kanban Board
- Drag-and-drop task management
- Columns: To Do, In Progress, Done
- Real-time synchronization

### Pomodoro Timer
- Configurable work/break intervals
- Session tracking and statistics
- Task focus integration

### Task Management
- CRUD operations for tasks
- Status updates and tagging
- Priority levels and due dates
- Assignee tracking

### Additional Features
- Responsive design (desktop/mobile)
- Real-time data updates
- Secure API with CORS
- Environment-based configuration
- State management for tasks and timers
- Charts and progress visualizations

## Tech Stack

### Backend
- Node.js (ES Modules)
- Express.js
- MongoDB with Mongoose
- CORS, dotenv

### Frontend
- Next.js 15 (App Router)
- React 19, TypeScript
- Tailwind CSS, Radix UI, shadcn/ui
- Zustand for state management
- Recharts for charts
- Zod for validation

## Architecture

### Backend
- MVC pattern: Models (Mongoose), Controllers, Routes, Services
- Main entry: server.js
- Database: config/db.js
- API routes: routes/taskRoutes.js

### Frontend
- Component-based with Next.js App Router
- State stores: store/taskStore.ts, store/timeStore.ts
- UI components: components/ui/
- Types: types/types.ts
- Validation: zod/taskTypes.ts

## Installation

### Prerequisites
- Node.js v18+
- MongoDB

### Backend
```bash
cd backend
npm install
# Set .env: PORT=8080, FRONTEND_ORIGIN=http://localhost:3000, MONGODB_URI=mongodb://localhost:27017/devflow
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access: Frontend at http://localhost:3000, Backend API at http://localhost:8080

## Usage
- Dashboard: Main overview page
- Kanban: /kanban for visual task management
- Pomodoro: /pomodoro for focus sessions
- Task CRUD via dashboard or Kanban

## API Endpoints

Base URL: http://localhost:8080

- GET /kanban - Get all tasks
- GET /kanban/:id - Get task by ID
- PUT /tasks/:id/status - Update task status
- PUT /kanban/:id - Update task
- POST /kanban - Create task
- DELETE /kanban/:id - Delete task

## Contributing
- Fork repository
- Create feature branch
- Commit changes
- Push and create PR

## License
ISC License