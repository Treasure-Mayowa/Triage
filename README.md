# Triageflow 

An automated real-time emergency management system that streamlines the handling of emergency calls and status updates.

## Features

- AI-powered call handling and transcription
-  Real-time emergency status updates
-  Responsive dashboard interface
-  Automated priority assignment

## Tech Stack

### Frontend
- Next.js 13 (React framework)
- TailwindCSS (Styling)
- Socket.io-client (Real-time updates)

### Backend
- Express.js (Node.js framework)
- MongoDB (Database)
- Socket.io (WebSocket server)
- Twilio (Voice calls & SMS)

### Tools
- Postman (API testing)
- MongoDB Atlas (Cloud database)
- Render (Hosting)

## Getting Started

### Prerequisites
- Node.js 15.2.2 or later
- MongoDB Atlas account
- Twilio account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/triageflow.git
cd triageflow
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../triageflow
npm install
```

3. Set up environment variables

Copy the sample environment files and update it with your own credentials: 

# Server environment setup
```bash
cd server
copy .env.sample .env
```

# Client environment setup
```bash
cd ../triageflow
copy .env.sample .env
```

4. Start the development servers

```bash
# Start the backend server
cd server
npm start

# Start the frontend
cd ../triageflow
npm run dev
```

The application should be available for access

## Project Structure

```
triageflow/
├── server/              # Backend server
│   ├── routes/         # API routes
│   ├── lib/           # Shared utilities
│   └── server.js      # Main server file
└── triageflow/         # Frontend application
    ├── src/
    │  └── app/       # Next.js 13 app directory
    └── public/        # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/yourfeature`)
3. Commit your changes (`git commit -m 'Add some yourfeature'`)
4. Push to the branch (`git push origin feature/yourfeature`)
5. Open a Pull Request
