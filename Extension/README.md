# The Prime Time - VS Code Extension

Track your coding time and productivity with detailed analytics directly from VS Code.

## 🚀 Features

- **Real-time Coding Tracking**: Automatically tracks your coding sessions
- **Language Analytics**: Tracks time spent on different programming languages
- **File-level Insights**: Monitors which files you work on most
- **Productivity Metrics**: Tracks lines changed and characters typed
- **Seamless Integration**: Connects directly to ThePrimeTime dashboard

## 📋 Prerequisites

1. **Backend Server**: Make sure ThePrimeTime backend is running on `http://localhost:7000`
2. **Frontend**: Ensure the frontend is running on `http://localhost:5173`
3. **API Token**: Get your API token from your profile page

## 🔧 Installation & Setup

### 1. Install the Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "The Prime Time"
4. Click Install

### 2. Get Your API Token

1. Open your browser and go to `http://localhost:5173`
2. Sign in to your account
3. Go to your profile page (`/@yourusername`)
4. Click the eye icon to show your API token
5. Copy the API token

### 3. Configure the Extension

#### Method 1: Using Command Palette
1. Open VS Code Command Palette (Ctrl+Shift+P)
2. Type "Set Prime Time Token"
3. Paste your API token when prompted

#### Method 2: Using Settings
1. Open VS Code Settings (Ctrl+,)
2. Search for "Prime Time"
3. Enter your API token in the "API Token" field
4. Verify the API URL is set to `http://localhost:7000`

### 4. Start Tracking

The extension will automatically start tracking when you:
- Open a file
- Make changes to code
- Save files

## 🎯 How It Works

### Data Collection
The extension collects the following data:
- **File Information**: File name, path, and language
- **Session Duration**: Time spent coding
- **Activity Metrics**: Lines changed and characters typed
- **Folder Context**: Which project/folder you're working in

### Data Transmission
- Data is sent to the backend every time you finish a coding session
- Uses secure API token authentication
- Automatically retries on connection failures

### Privacy & Security
- All data is transmitted securely over HTTPS
- API token is stored locally in VS Code
- No data is sent without your API token

## 📊 Available Commands

### Set Prime Time Token
- **Command**: `the-prime-time.setToken`
- **Description**: Set or update your API token
- **Usage**: Command Palette → "Set Prime Time Token"

### Show Prime Time Status
- **Command**: `the-prime-time.showStatus`
- **Description**: Check current tracking status
- **Usage**: Command Palette → "Show Prime Time Status"

### Open Prime Time Dashboard
- **Command**: `the-prime-time.openDashboard`
- **Description**: Open your dashboard in browser
- **Usage**: Command Palette → "Open Prime Time Dashboard"

## ⚙️ Configuration

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `thePrimeTime.apiToken` | `""` | Your Prime Time API token |
| `thePrimeTime.apiUrl` | `http://localhost:7000` | Backend API server URL |
| `thePrimeTime.frontendUrl` | `http://localhost:5173` | Frontend dashboard URL |
| `thePrimeTime.trackingEnabled` | `true` | Enable/disable tracking |

### Example Configuration
```json
{
  "thePrimeTime.apiToken": "your-api-token-here",
  "thePrimeTime.apiUrl": "http://localhost:7000",
  "thePrimeTime.frontendUrl": "http://localhost:5173",
  "thePrimeTime.trackingEnabled": true
}
```

## 🔍 Troubleshooting

### Extension Not Tracking
1. **Check API Token**: Verify your token is correct
2. **Check Server**: Ensure backend is running on port 7000
3. **Check Status**: Use "Show Prime Time Status" command
4. **Restart VS Code**: Sometimes needed after configuration changes

### Connection Errors
1. **Verify Backend**: Check if `http://localhost:7000` is accessible
2. **Check Token**: Ensure API token is valid
3. **Network Issues**: Check firewall/network settings
4. **CORS Issues**: Ensure backend allows requests from VS Code

### Data Not Appearing in Dashboard
1. **Check API Token**: Verify token matches your account
2. **Check Backend Logs**: Look for errors in backend console
3. **Test Connection**: Use the test script provided
4. **Refresh Dashboard**: Data may take a moment to appear

## 🧪 Testing Connection

Use the provided test script to verify your setup:

1. Navigate to the extension directory
2. Install dependencies: `npm install`
3. Edit `test-connection.js` and add your API token
4. Run: `node test-connection.js`

## 📈 Data Flow

```
VS Code Extension → Backend API → Database → Frontend Dashboard
     ↓                    ↓           ↓           ↓
  Tracks coding    Receives data   Stores data   Displays analytics
  sessions         via API token   in PostgreSQL & MongoDB
```

## 🔒 Security Notes

- **API Token**: Keep your token secure and don't share it
- **Local Storage**: Token is stored in VS Code's secure storage
- **HTTPS**: Use HTTPS in production for secure data transmission
- **Token Rotation**: You can regenerate your API token anytime

## 🆘 Support

If you encounter issues:

1. **Check Status**: Use "Show Prime Time Status" command
2. **Test Connection**: Run the test script
3. **Check Logs**: Look at VS Code's Developer Console
4. **Verify Setup**: Ensure backend and frontend are running

## 📝 Changelog

### v1.0.0
- Initial release
- Real-time coding tracking
- API token authentication
- Dashboard integration
- Multi-language support

---

**Happy Coding! 🚀** 