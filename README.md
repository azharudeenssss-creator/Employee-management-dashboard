# Employee Management Dashboard (MERN)

Full-stack MERN application with JWT authentication, role-based access control, CRUD operations, and analytics charts.

## Tech Stack

**Backend:** Express + Mongoose + JWT + bcrypt + express-validator  
**Frontend:** React 18 + Vite + React Router v6 + React Hook Form + Zod + Recharts + Axios

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Setup Server
```bash
cd server
npm install
# Edit .env → set your MONGO_URI and JWT_SECRET
npm run dev        # starts on :5000
```

### 2. Seed Development Data
```bash
cd server
node seed.js
# Creates: admin@company.com / password123
#          hr@company.com / pascsword123
# + 12 sample employees
```

### 3. Setup Client
```bash
cd client
npm install
npm run dev        # starts on :5173
```

### 4. Run Both Together (from root)
```bash
npm install        # installs concurrently
npm run dev        # starts server + client
```

---

## Features

### Authentication
- JWT stored in `localStorage`, sent via `Authorization: Bearer` header
- Auto-redirect unauthenticated users to `/login`
- Token expiry → auto logout + redirect
- Role-based UI (admin / hr / viewer)

### Roles & Permissions
| Action | admin | hr | viewer |
|--------|-------|----|--------|
| View employees | ✅ | ✅ | ✅ |
| Create/Edit | ✅ | ✅ | ❌ |
| Delete | ✅ | ❌ | ❌ |
| Analytics | ✅ | ✅ | ✅ |

### Employees Module
- Paginated table (10/page) with server-side filtering
- Search by name / email / position
- Filter by department, status
- Create / Edit via modal with full validation
- Delete with confirmation

### Analytics
- Headcount by department (Bar chart)
- Employee status distribution (Pie chart)
- Average salary by department (Bar chart)
- Monthly hiring trend (Area chart)

Screenshot
<img width="1920" height="680" alt="Screenshot (19)" src="https://github.com/user-attachments/assets/f55aad2b-c4de-4755-b1c8-5868b4bdf456" />
<img width="1908" height="905" alt="Screenshot (20)" src="https://github.com/user-attachments/assets/0458fca2-087d-4db2-aadc-8daef14b9204" />
<img width="1920" height="979" alt="Screenshot (21)" src="https://github.com/user-attachments/assets/58def397-47e8-4aaf-a2cd-9938a79552d2" />
---
## Project Structure

```
employee-dashboard/
├── client/                     # React + Vite
│   └── src/
│       ├── api/                # Axios client + endpoint functions
│       ├── components/
│       │   ├── auth/           # ProtectedRoute
│       │   ├── employees/      # EmployeeForm
│       │   └── layout/         # Layout, Modal
│       ├── context/            # AuthContext
│       ├── hooks/              # useEmployees, useAnalytics
│       ├── pages/              # Login, Register, Dashboard, Employees, Analytics
│       └── styles/             # global.css
│
└── server/                     # Express + Mongoose
    ├── controllers/            # authController, employeeController
    ├── middleware/             # auth (JWT verify + role check)
    ├── models/                 # User, Employee
    ├── routes/                 # /api/auth, /api/employees
    ├── index.js
    └── seed.js
```

## API Reference

### Auth
```
POST /api/auth/register   { name, email, password, role }
POST /api/auth/login      { email, password } → { token, user }
GET  /api/auth/me         [auth required]
```

### Employees
```
GET    /api/employees          ?page&limit&department&status&search&sortBy&order
GET    /api/employees/:id
POST   /api/employees          [admin, hr]
PUT    /api/employees/:id      [admin, hr]
DELETE /api/employees/:id      [admin only]
GET    /api/employees/analytics
```

## Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_db
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```
