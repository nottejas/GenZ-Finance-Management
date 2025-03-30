# GenZ Finance - Gamified Financial Management App 🚀

A modern, gamified financial management application designed specifically for Gen Z users. The app makes budgeting, saving, and investing engaging, educational, and rewarding through gamification and AI-powered insights.

## Features 🎮

### Core Features
- 📊 Smart expense tracking with AI insights
- 🎯 Gamified budgeting & spending challenges
- 💰 AI-powered saving recommendations
- 📱 BNPL & subscription tracking
- 📚 Financial education via short-form content
- 👥 Social & community engagement

### Technical Features
- 🔐 Secure authentication with Clerk (Google login supported)
- 💾 MongoDB for data persistence
- ⚛️ React with Vite for frontend
- 🎨 Tailwind CSS for styling
- 🛣️ React Router for navigation
- 🔄 Real-time data updates

## Transaction Management Updates

Recent updates implemented:

1. **Real-time Data Updates**:
   - Added global state management with React Context API
   - Transactions now update across all components in real-time
   - Financial metrics (balance, income, expenses) recalculate automatically

2. **Components Updated**:
   - `Home` component displays real-time balance
   - `FinancialOverview` reflects current financial status
   - `TransactionForm` connects to the global transaction state

3. **Technical Implementation**:
   - Created TransactionContext for centralized state management
   - Implemented transaction CRUD operations with API interaction
   - Added automatic financial metric calculations
   - Integrated real-time expense category breakdown

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Clerk account for authentication

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
MONGODB_URI=your_mongodb_uri
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/genz-finance-webapp.git
cd genz-finance-webapp
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Start the development servers
```bash
# Start frontend (in frontend directory)
npm run dev

# Start backend (in backend directory)
npm run dev
```

## Architecture 🏗️

### Frontend Structure
- `/src/components` - React components
  - `/auth` - Authentication components
  - `/dashboard` - Dashboard and financial overview
  - `/gamification` - Challenges and rewards
  - `/education` - Educational content

### Backend Structure
- `/models` - MongoDB schemas
  - `User.js` - User profile and preferences
  - `Transaction.js` - Financial transactions
  - `Challenge.js` - Gamification challenges
  - `Lesson.js` - Educational content

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Clerk for authentication
- MongoDB for database
- React and Vite teams
- Tailwind CSS team

## Setup & Running

### Backend
```
cd backend
npm install
cp .env.example .env  # Configure with your MongoDB credentials
npm run dev
```

### Frontend
```
cd frontend
npm install
cp .env.example .env  # Configure with API keys
npm run dev
```

## API Configuration

The frontend will proxy API requests to the backend. The configuration is in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false
    }
  }
}
``` 