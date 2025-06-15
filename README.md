# 👨‍👩‍👧‍👦 Infant Growth Guardian- Smart Growth Tracker for Infants

A digital health tool to assist community health workers in detecting infant malnutrition (SAM/MAM) early using growth monitoring and real-time alerts.



---

## 🚀 Features

### 🔍 Public Landing Page

- **Early Detection Saves Lives** hero section with call-to-action button
- Overview cards:
  - Child Monitoring
  - Growth Analysis
  - Real-time Alerts
  - Care Recommendations
- Key statistics (e.g., global stunting, mortality)

### 🔐 User Authentication

- **Register**: Full Name, Phone, Password, Role, Location
- **Login**: Phone Number & Password

### 📊 Dashboard (After Login)

- **Header**: Add Child, Logout buttons
- **Stat Cards**:
  - Total Children Under Monitoring
  - Active Alerts (SAM/MAM requiring attention)
  - Recent Records (this week)
  - Recommendations Pending Confirmation
- **Quick Actions**:
  - Register New Child
  - Record Growth Measurement
  - View Active Alerts
- **Recent Alerts**:
  - List of children flagged as SAM or MAM, with name, age and alert type
- **Growth Monitoring Overview**:
  - Status panels for Normal, MAM, SAM

### 👶 Child Management Modals

- **Register New Child**:
  - Name, DOB, Gender, Village/Location, Parent ID (Optional)
- **Record Growth Measurement**:
  - Select Child, Date, Height (cm), Weight (kg), Edema checkbox
- **View Active Alerts**:
  - Modal listing active alerts or showing “No active alerts” message

---

## 🧩 Frontend (UI)

A React-based SPA built with [Next.js](https://nextjs.org/) and styled using [Tailwind CSS](https://tailwindcss.com/).

### 📁 Folder Structure

```
ui/
├── components/      # Reusable UI components (Cards, Modals, Forms)
├── pages/           # Next.js pages (index, login, register, dashboard)
├── public/          # Static assets and screenshots
├── styles/          # Global and Tailwind config
└── utils/           # API client, hooks, context providers
```

### ⚙️ Setup & Run (Frontend)

1. **Navigate to UI folder**
   ```bash
   cd ui
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:6069/api
   ```
4. **Start development server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`

---

## 🧠 Backend & API

The backend powers authentication, child profiles, growth tracking, alert generation, and recommendation workflows.

### 📁 Folder Structure

```
api/
├── controllers/     # Route handlers
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
└── utils/           # Z-score logic, validators, middleware
```

### ⚙️ Setup & Run (Backend)

1. **Navigate to API folder**
   ```bash
   cd api
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure **``
   ```env
   PORT=6069
   SUPABASE_URI=<your_supabase_uri>
   JWT_SECRET=<your_jwt_secret>
   ```
4. **Start in dev mode**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:6069`

### 📡 API Endpoints

All routes are prefixed with `/api` and require a Bearer token unless noted.

#### 🔐 Authentication

- `POST /api/users/register`
- `POST /api/users/login`

#### 👶 Children

- `POST /api/children`
- `GET  /api/children/:childId/history`

#### 📈 Growth Records

- `POST /api/children/:childId/growth`
- `GET  /api/children/:childId/growth/alerts`

#### 📝 Recommendations

- `GET  /api/children/:childId/recommendations`
- `POST /api/children/:childId/recommendations/:recId/confirm`

---

## 🌱 Future Enhancements

- 📊 Supervisor and Admin Analytics Dashboard
- 📱 Offline-first support with Service Workers
- 🗂️ Complete OpenAPI/Swagger documentation
- 🔐 Role-based access control and supervisor escalation

---

## 📎 Repository

```bash
git clone https://github.com/nirant-nk/smart-growth-tracker.git
```

