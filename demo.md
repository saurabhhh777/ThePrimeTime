# The Prime Time - Demo Guide

This guide will help you test and demonstrate The Prime Time coding analytics platform.

## 🚀 Quick Start Demo

### 1. Start the Services

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

### 2. Set Up Database

```bash
cd Backend
npx prisma db push
```

### 3. Test the Extension

**Terminal 3 - Extension Development:**
```bash
cd Extension
npm run compile
```

Then in VS Code:
1. Press `F5` to run the extension in development mode
2. Open a new VS Code window (Extension Development Host)
3. Open any project folder
4. Use Command Palette (`Ctrl+Shift+P`) and run "Set Prime Time Token"
5. Enter a test token (e.g., "demo-token-123")

## 🧪 Demo Scenarios

### Scenario 1: Basic Tracking
1. Open a TypeScript/JavaScript file
2. Make some edits and save the file
3. Check the status bar - you should see "Prime Time: X:XX"
4. Switch to another file and continue coding
5. Visit the dashboard to see your activity

### Scenario 2: Language Analytics
1. Work on different file types:
   - `.ts` or `.js` files (JavaScript/TypeScript)
   - `.py` files (Python)
   - `.java` files (Java)
   - `.cpp` files (C++)
2. Check the dashboard to see language breakdown

### Scenario 3: Subscription Features
1. Visit `/subscription` in the web app
2. Try upgrading to different plans
3. Test the data retention limits:
   - Free: 30 days
   - Basic: 3 months
   - Pro: 1 year
   - Enterprise: Unlimited

### Scenario 4: API Testing
Test the API endpoints:

```bash
# Get subscription plans
curl http://localhost:3000/api/v1/subscription/plans

# Submit coding stats (from extension)
curl -X POST http://localhost:3000/api/v1/coding-stats/submit \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user",
    "timestamp": "2024-01-15T10:00:00Z",
    "fileName": "test.ts",
    "filePath": "/project/src/test.ts",
    "language": "typescript",
    "folder": "src",
    "duration": 300000,
    "linesChanged": 10,
    "charactersTyped": 500
  }'
```

## 📊 Expected Results

### Dashboard Analytics
- **Total Coding Time**: Should show accumulated time
- **Coding Sessions**: Number of tracked sessions
- **Lines Changed**: Total lines modified
- **Characters Typed**: Total characters written
- **Top Languages**: Most used programming languages
- **Most Active Folders**: Folders with most activity

### Extension Status Bar
- Shows current session time
- Updates in real-time
- Displays "Ready" when not actively coding

### Subscription Management
- Plan comparison and selection
- Upgrade/downgrade functionality
- Usage statistics

## 🔧 Troubleshooting

### Extension Not Working
1. Check VS Code console for errors
2. Verify API token is set
3. Ensure backend is running
4. Check network connectivity

### Dashboard Not Loading
1. Verify frontend is running on port 5173
2. Check browser console for errors
3. Ensure backend API is accessible
4. Verify database connection

### Data Not Syncing
1. Check extension logs
2. Verify API endpoints are working
3. Ensure proper authentication
4. Check database connectivity

## 🎯 Demo Tips

### For Presentations
1. **Start with the Extension**: Show real-time tracking
2. **Demonstrate Multi-language**: Work on different file types
3. **Show Dashboard**: Display comprehensive analytics
4. **Highlight Subscription**: Explain the business model
5. **Live Coding**: Code during the demo to show real data

### For Development
1. **Use Sample Data**: Create realistic coding sessions
2. **Test Edge Cases**: Try different scenarios
3. **Performance Testing**: Monitor system resources
4. **Error Handling**: Test error scenarios

## 📈 Sample Data

You can create sample coding sessions for testing:

```javascript
// Sample coding stats for testing
const sampleStats = [
  {
    userId: "demo-user",
    timestamp: new Date(),
    fileName: "app.tsx",
    filePath: "/project/src/app.tsx",
    language: "typescript",
    folder: "src",
    duration: 1800000, // 30 minutes
    linesChanged: 25,
    charactersTyped: 1200
  },
  {
    userId: "demo-user",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    fileName: "utils.py",
    filePath: "/project/utils/utils.py",
    language: "python",
    folder: "utils",
    duration: 900000, // 15 minutes
    linesChanged: 15,
    charactersTyped: 800
  }
];
```

## 🎉 Success Indicators

- ✅ Extension shows status in VS Code
- ✅ Dashboard displays coding analytics
- ✅ Subscription plans are accessible
- ✅ API endpoints respond correctly
- ✅ Data persists in database
- ✅ Real-time updates work

## 📞 Support

If you encounter issues during the demo:
1. Check the console logs
2. Verify all services are running
3. Ensure database is properly configured
4. Review the installation guide
5. Check the troubleshooting section 