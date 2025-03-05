# Complaint Management System - Frontend

## Overview
This repository contains the **frontend** of the **Complaint Management System**, built using **React.js** and **Shopify Polaris** for UI components. Users can submit complaints, track their status, and admins can manage complaints efficiently.

## Features
- **User Authentication**: Login and role-based access control.
- **Complaint Submission**: Users can file complaints.
- **Complaint Management**: Admins can view, filter, and reply to complaints.
- **Profile Display**: Users and admins can see their profile information.
- **Responsive UI**: Mobile-friendly design using Shopify Polaris.

## Tech Stack
- **React.js** - Frontend framework
- **Shopify Polaris** - UI Component Library
- **Axios** - API communication
- **React Router** - Navigation handling
- **LocalStorage** - Authentication state persistence

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/complaint-management-frontend.git
   cd complaint-management-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and set:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## Project Structure
```
complaint-management-frontend/
│── src/
│   ├── components/
│   │   ├── AuthContext.jsx       # Manages authentication state
│   │   ├── ProtectedRoute.jsx    # Role-based route protection
│   ├── pages/
│   │   ├── LoginPage.jsx         # User login page
│   │   ├── AdminDashboard.jsx    # Admin panel for managing complaints
│   │   ├── CustomerDashboard.jsx # User dashboard for submitting complaints
│   ├── api/
│   │   ├── api.js                # Axios API configuration
│   ├── App.js                    # Main App Component
│── public/
│── package.json                  # Dependencies
```

## API Endpoints Used
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/users/login` | User authentication |
| `POST` | `/users/register` | User registration |
| `GET` | `/users/profile/:email` | Fetch user details |
| `POST` | `/complaints` | Submit a new complaint |
| `POST` | `/complaints/user` | Fetch user complaints |
| `GET` | `/complaints/admin/all?email=admin@admin.com` | Admin fetches all complaints |
| `PATCH` | `/complaints/reply/:id` | Admin replies to a complaint |
