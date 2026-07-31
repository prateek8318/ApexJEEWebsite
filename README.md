# Apex JEE Website (AspirantPro)

Welcome to the **Apex JEE Website**, an advanced e-learning platform specifically designed for IIT JEE (Main & Advanced) and NEET aspirants. The platform offers premium course materials, real-time mock tests, personalized learning paths, and AI-driven analytics.

## 🌟 Key Features

- **Personalized Daily Learning Paths**: Dynamic, adaptive schedules tailored to each student's progress and goals.
- **Comprehensive Study Materials**: Access to revision notes, video lectures, and formula sheets.
- **Assessment & Mock Tests**: A robust question bank with mock tests, PYQs (Previous Year Questions), and real-time performance analytics.
- **Admin Dashboard**: Comprehensive CMS for managing users, subscriptions, subjects, chapters, questions, and approvals.
- **Subscription Plans**: Flexible pricing plans (Trial, Monthly, Quarterly, Yearly) with varied feature access.
- **Doubt Resolution**: Real-time doubt resolution tracking and management.

## 🚀 Technology Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **State Management**: Zustand / React Query
- **Form Handling & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Language**: TypeScript

## 📂 Project Structure

- `/app`: Next.js App Router containing pages for authentication, admin panels, student dashboard, and core features.
- `/components`: Reusable UI components (buttons, dialogs, forms, layout wrappers).
- `/lib`: Utility functions, API clients, and configuration files (Axios, etc.).
- `/types`: TypeScript interfaces for the API data models (Users, Tests, Subscriptions, Admin Profiles).
- `/public`: Static assets, document templates, and images.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/teknikoglobal1326/Apex-jee-website.git
cd Apex-jee-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up Environment Variables:
Create a `.env` file in the root directory and configure the required environment variables:
```env
NEXT_PUBLIC_URL=http://localhost:9070
```

4. Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Build for Production

To create an optimized production build, run:
```bash
npm run build
```
And then start the server:
```bash
npm start
```

## 🔒 Authentication Flow
The application supports multi-role authentication (Admin & Student) with OTP verification and JWT-based session handling.

## 📝 License
Proprietary software. All rights reserved.
