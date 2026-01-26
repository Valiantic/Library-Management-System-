# Aurevia Library Management System

A modern, full-stack library management system featuring a premium UI, robust tracking capabilities, and a comprehensive set of management tools for both librarians and students.

## 🚀 Overview

**Aurevia** is designed to streamline library operations through an intuitive interface and powerful backend automation. It provides real-time analytics, automated email notifications (OTP), and a secure multi-role authentication system.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Charts/Analytics**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Transitions/Animations**: Custom CSS Animations & Tailwind Transitions
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt for password hashing
- **Mail Service**: [Nodemailer](https://nodemailer.com/) (OTP & Notifications)

## ✨ Key Features

### 👨‍💼 Administrator Portal
- **Dashboard**: Real-time stats on total users, book inventory, availability, and borrowing trends.
- **Inventory Management**: Comprehensive CRUD operations for library books, including archiving functionality.
- **Membership Management**: Oversight of registered users, role assignments, and system access.
- **Borrowing Records**: Track active borrows, return statuses, and historical library usage.

### 🎓 Student / Member Portal
- **Book Discovery**: Browse available books in the library with category filtering.
- **Personal Dashboard**: View active borrows and personal library activity.
- **Secure Access**: Profile management and secure logout.

### 🔒 Security & Utils
- **OTP Verification**: Email-based One-Time Password for secure signup.
- **Password Recovery**: Secure forgot password flow with email verification.
- **Rate Limiting**: Protection against brute-force attacks on sensitive endpoints.
- **Session Management**: JWT-based stateless authentication.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile views.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MySQL Database running

### 1. Clone the repository
```bash
git clone <repository-url>
cd Aurevia-Library-Management-System
```

### 2. Install Dependencies
Install dependencies for the root, client, and server:
```bash
# Root
npm install

# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the `server` directory and configure the following:
```env
# DATABASE CONFIGURATION
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db

# SERVER CONFIGURATION
PORT=8000
JWT_SECRET=your_jwt_secret

# EMAIL CONFIGURATION (Nodemailer)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

### 4. Run the Application
From the **root directory**, run:
```bash
npm run dev
```
- Server will run on `http://localhost:8000`
- Client will run on `http://localhost:5173` (standard Vite port)

---
*Built with ❤️ for ITEC 116 SYSTEM INTEGRATION*
