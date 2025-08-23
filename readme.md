# The Prime Time - Coding Analytics Platform

A comprehensive coding time tracking and analytics platform that helps developers monitor their productivity, track coding patterns, and optimize their workflow.

## 🚀 Features

### VS Code Extension
- **Real-time tracking**: Monitors coding sessions, file changes, and language usage
- **Status bar integration**: Shows current session time in VS Code status bar
- **Token-based authentication**: Secure API token management
- **Automatic data sync**: Sends coding statistics to the web dashboard

### Web Dashboard
- **Comprehensive analytics**: View coding time, sessions, and productivity metrics
- **Language insights**: Track time spent on different programming languages
- **Folder analysis**: Monitor activity across different project folders
- **Subscription tiers**: Free and premium plans with different data retention periods

### Subscription Plans
- **Free Plan**: Last 30 days data, basic analytics
- **Basic Plan ($9.99/month)**: Last 3 months data, custom date ranges
- **Pro Plan ($19.99/month)**: Full year data access, advanced analytics
- **Enterprise Plan ($49.99/month)**: Unlimited data, custom integrations

## 📁 Project Structure

```
ThePrimeTime/
├── Extension/                 # VS Code Extension
│   ├── src/
│   │   ├── extension.ts      # Main extension file
│   │   ├── codingTracker.ts  # Coding time tracking logic
│   │   └── statusBarManager.ts # Status bar management
│   ├── package.json
│   └── tsconfig.json
├── Backend/                   # Node.js API Server
│   ├── controllers/
│   │   ├── codingstats.controller.js
│   │   ├── subscription.controller.js
│   │   └── ...
│   ├── routes/
│   │   ├── codingstats.route.js
│   │   ├── subscription.route.js
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── index.js
├── Frontend/                  # React Web Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Subscription.tsx
│   │   │   └── ...
│   │   └── components/
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- VS Code (for extension development)

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/primetime"
   JWT_SECRET="your-jwt-secret"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### VS Code Extension Setup

1. **Navigate to Extension directory:**
   ```bash
   cd Extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the extension:**
   ```bash
   npm run compile
   ```

4. **Package the extension:**
   ```bash
   npm install -g vsce
   vsce package
   ```

## 🔧 Usage

### For Users

1. **Install the VS Code Extension:**
   - Download the `.vsix` file
   - Install in VS Code: `Extensions > Install from VSIX`

2. **Get your API Token:**
   - Sign up at the web dashboard
   - Navigate to your profile to get your API token

3. **Configure the Extension:**
   - Open VS Code Command Palette (`Ctrl+Shift+P`)
   - Run "Set Prime Time Token"
   - Enter your API token

4. **Start Coding:**
   - The extension will automatically track your coding sessions
   - View your analytics at the web dashboard

### For Developers

1. **API Endpoints:**
   - `POST /api/v1/coding-stats/submit` - Submit coding statistics
   - `GET /api/v1/coding-stats/stats` - Get user's coding statistics
   - `GET /api/v1/subscription/plans` - Get subscription plans
   - `PUT /api/v1/subscription/user` - Update subscription

2. **Database Schema:**
   - Users with subscription management
   - Coding statistics with detailed tracking
   - Projects and blogs for additional features

## 📊 Analytics Features

### Free Plan (30 Days)
- Basic coding time tracking
- Language usage statistics
- File and folder activity
- Session count and duration

### Premium Plans
- Extended data retention (3 months to unlimited)
- Custom date range filtering
- Advanced analytics and reporting
- Export capabilities
- API access for integrations

## 🔒 Security

- JWT-based authentication
- Secure API token management
- Data encryption in transit
- User privacy protection

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

### Extension Distribution
1. Package the extension: `vsce package`
2. Publish to VS Code Marketplace or distribute manually

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the FAQ section in the web dashboard
- Contact the development team

## 🔮 Roadmap

- [ ] Team analytics and collaboration features
- [ ] Integration with Git providers
- [ ] Mobile app for on-the-go analytics
- [ ] Advanced reporting and insights
- [ ] Custom integrations and webhooks
- [ ] Machine learning insights for productivity optimization