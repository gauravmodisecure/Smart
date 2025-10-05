# Health Dashboard - Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd health-dashboard

# Install all dependencies
npm run install:all
```

### 2. Set Up Environment Variables

#### Backend Configuration
```bash
# Copy environment file
cd backend
cp .env.example .env

# Edit .env file
nano .env
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/health_dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend Configuration
```bash
# Copy environment file
cd ../frontend
cp .env.example .env

# Edit .env file
nano .env
```

Required environment variables:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongodb

# On Windows
# Start MongoDB service through Services.msc or use mongod command
```

### 4. Run the Application

```bash
# Start both backend and frontend
npm run dev

# Or run them separately:
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development Workflow

### Project Structure

```
health-dashboard/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── hooks/         # Custom React hooks
│   └── package.json
└── README.md
```

### Key Features Implemented

#### ✅ Web Bluetooth Integration
- Connect to smartwatches via Web Bluetooth API
- Access GATT services (Heart Rate, Battery, etc.)
- Real-time data streaming from connected devices
- Automatic reconnection handling

#### ✅ Authentication System
- User registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Password hashing with bcrypt

#### ✅ Real-time Health Dashboard
- Interactive charts for heart rate, steps, SpO₂, sleep
- Real-time data updates via Socket.IO
- Responsive mobile-friendly design
- Modern UI with Tailwind CSS

#### ✅ Data Management
- MongoDB for health data storage
- Historical data analysis
- User-specific data isolation
- RESTful API endpoints

#### ✅ Mock Data Generator
- Generate realistic health data for testing
- Simulate device connections without physical hardware
- Historical data generation for charts

## Usage Guide

### Connecting a Smartwatch

1. **Enable Bluetooth** on your device and smartwatch
2. **Navigate to Connect Page** - Click "Connect Device" in the dashboard
3. **Grant Permissions** - Allow the website to access Bluetooth
4. **Select Device** - Choose your smartwatch from the list
5. **Start Monitoring** - View real-time health data in the dashboard

### Supported Devices

The app supports Bluetooth LE devices that implement standard GATT services:
- **Heart Rate Service** (UUID: 0x180D)
- **Battery Service** (UUID: 0x180F)
- **Device Information Service** (UUID: 0x180A)

Popular compatible devices:
- Fitbit devices with Bluetooth
- Garmin watches
- Samsung Galaxy Watch
- Apple Watch (limited support)
- Other BLE fitness trackers

### Troubleshooting

#### Bluetooth Connection Issues
- Ensure Bluetooth is enabled on your device
- Make sure your smartwatch is in pairing mode
- Check that your browser supports Web Bluetooth API
- Try refreshing the page and reconnecting

#### Data Not Appearing
- Verify your smartwatch is sending data
- Check browser console for error messages
- Ensure proper GATT service implementation
- Try the mock data generator for testing

#### Performance Issues
- Close unused browser tabs
- Clear browser cache if needed
- Restart the development servers
- Check MongoDB connection status

## API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Health Data Endpoints

```http
GET  /api/health/data       # Get current health data
POST /api/health/data       # Save new health data
GET  /api/health/history    # Get historical data
GET  /api/health/aggregated # Get aggregated statistics
DELETE /api/health/data/:id # Delete specific data point
```

## Development Commands

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all prerequisites are properly installed
- Check MongoDB connection and authentication

---

**Note**: This application requires a modern browser that supports the Web Bluetooth API (Chrome, Edge, Opera). Bluetooth functionality may require HTTPS in production environments.
