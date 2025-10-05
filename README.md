# Health Dashboard - Smartwatch Integration

A full-stack health dashboard website that connects to smartwatches via Web Bluetooth API to display real-time health metrics.

## Features

- **Web Bluetooth Integration**: Connect to smartwatches and access GATT services
- **Real-time Health Metrics**: Heart rate, steps, SpO₂, and sleep data
- **Interactive Charts**: Animated, color-coded visualizations
- **Authentication System**: User login and registration
- **Real-time Updates**: WebSocket communication for live data
- **Mobile Responsive**: Modern, mobile-friendly UI
- **Mock Data Support**: Test without physical devices

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB for data storage
- Socket.IO for real-time communication
- JWT for authentication

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Chart.js/Recharts for data visualization
- Web Bluetooth API

## Project Structure

```
health-dashboard/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json
└── package.json           # Root package.json
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in backend directory
   - Add MongoDB connection string and JWT secret

3. **Run development servers:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## Web Bluetooth Integration

The app uses the Web Bluetooth API to:
- Connect to smartwatches with standard GATT services
- Access heart rate, step count, SpO₂, and other health data
- Receive real-time notifications when new data is available
- Handle connection/disconnection events gracefully

## Health Metrics Supported

- **Heart Rate**: Real-time BPM with historical trends
- **Step Count**: Daily step tracking with goals
- **SpO₂**: Blood oxygen saturation levels
- **Sleep Data**: Sleep duration and quality tracking

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## License

MIT
