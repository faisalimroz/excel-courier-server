# Excel Parcel Delivery System

A courier tracking and parcel management system

## Features

### Customer Features
- **Parcel Booking**: Book parcels with pickup and delivery addresses
- **Barcode Generation**: Automatic barcode generation after successful booking
- **Barcode Download**: Download barcode for offline use
- **Booking History**: View all past bookings
- **Parcel Tracking**: Track parcel status in real-time

### Agent Features
- **Barcode Scanner**: Scan customer barcodes for pickup/delivery confirmation
- **Barcode Generator**: Generate barcodes for assigned parcels
- **Assigned Parcels**: View and manage assigned deliveries
- **Status Updates**: Update parcel status with location tracking
- **Optimized Routes**: Get optimized delivery routes

### Admin Features
- **Parcel Management**: Manage all parcels in the system
- **Agent Management**: Create and manage delivery agents
- **Customer Management**: View and manage customer accounts
- **Reports**: Generate delivery reports and analytics

## Barcode System

### How it Works
1. **Customer Books Parcel**: When a customer books a parcel, a unique tracking number is generated
2. **Barcode Generation**: A barcode is automatically generated for the tracking number
3. **Customer Saves Barcode**: Customer can download or screenshot the barcode
4. **Agent Scans Barcode**: During pickup/delivery, agent scans the customer's barcode
5. **Status Update**: Parcel status is automatically updated based on the scan

## Technology Stack

### Frontend
- React 19
- Redux Toolkit
- React Router
- Tailwind CSS
- Daisyui
- SweetAlert2
- React Toastify
- JsBarcode
- HTML5 QR Code Scanner

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm 

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd excel
 

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd server
   npm install
 

3. **Configure environment variables**
   Create `.env` file in the server directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/excel_parcel
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd server
   npm start

   # Start frontend (in new terminal)
   cd frontend
   npm run dev
   ```

## Usage

### For Customers
1. Register/Login to your account
2. Book a parcel with pickup and delivery details
3. Download or screenshot the generated barcode
4. Show the barcode to the delivery agent during pickup/delivery

### For Agents
1. Login to your agent account
2. View assigned parcel
3. Use the barcode scanner to scan customer barcodes
4. Confirm pickup/delivery through the scanner

### For Admins
1. Login to admin account
2. Manage parcels, agents, and customers
3. Generate reports and analytics
4. Monitor system performance

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Parcels
- `POST /api/parcels/book` - Book new parcel
- `GET /api/parcels/history` - Get booking history
- `GET /api/parcels/all` - Get all parcels (admin)
- `GET /api/parcels/assigned` - Get assigned parcels (agent)
- `PUT /api/parcels/:id/status` - Update parcel status
- `PUT /api/parcels/:id/assign` - Assign agent to parcel

### Users
- `GET /api/users/all` - Get all users (admin)
- `POST /api/users/create-agent` - Create new agent (admin)
