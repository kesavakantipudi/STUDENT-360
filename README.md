# STUDENT 360 - Academic Intelligence Platform

STUDENT 360 is a modern, premium web application designed to monitor and analyze student performance, behavior, and extracurricular activities (like GitHub contributions) at an institutional level. Built with React and Vite, the platform features a sleek, futuristic dark-and-orange UI with fluid animations and rich data visualization.

## 🚀 Features

### 🎓 Student Portal
- **Dashboard:** At-a-glance view of academic standing, recent scores, and upcoming exams.
- **GitHub Analysis:** Deep dive into individual coding activity, language distribution, and commit heatmaps.
- **Academic Records:** Detailed tracking of test scores, historical results, and GPA.
- **Behavior & Gamification:** Monitor rule violations and earn achievement badges for academic and extracurricular excellence.

### 🛡️ Admin Portal
- **Institution Overview:** High-level metrics on total students, average scores, and active alerts.
- **Student Management:** Detailed directory of all enrolled students with search and filtering.
- **GitHub Leaderboard:** Track and compare the coding contributions of all linked students across the institution.
- **Exam & Result Management:** Oversee upcoming test schedules and publish results.
- **Disciplinary Action:** Log and monitor student violations with severity tracking.

## 💻 Tech Stack
- **Frontend Framework:** React, Vite
- **Styling:** Tailwind CSS v4, Custom CSS Variables
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router DOM

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project folder:
   ```bash
   git clone <repository-url>
   cd Student-360TestingApp-main
   ```

2. Copy environment variables from `.env.example` and fill in your Firebase and Power Automate values:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies and start the app:
   ```bash
   npm install
   npm run dev
   ```


2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🔐 Authentication (Demo Mode)

The application currently runs in a fully mocked frontend environment. No backend configuration or database is required. Use the built-in demo credentials to explore the platform:

**Student Access:**
- Email: `student@demo.com`
- Password: `demo1234`

**Admin Access:**
- Email: `admin@demo.com`
- Password: `admin1234`

## 🎨 UI/UX Philosophy
The UI was explicitly designed to break away from traditional, sterile educational software. It utilizes a **Premium Dark/Orange Theme** featuring:
- Glassmorphism effects and ambient glowing backgrounds.
- Pill-shaped components and smooth hover micro-interactions.
- Standardized, spacious grid layouts to ensure dense data readability without cognitive overload.
