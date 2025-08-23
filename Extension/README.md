# The Prime Time - VS Code Extension

A powerful VS Code extension that tracks your coding time and productivity metrics in real-time.

## Features

- **Real-time tracking**: Monitors your coding sessions automatically
- **Language detection**: Tracks time spent on different programming languages
- **File and folder analytics**: See which files and folders you work on most
- **Status bar integration**: View current session time in the status bar
- **Secure API integration**: Sends data to your Prime Time dashboard
- **Token-based authentication**: Secure and private data transmission

## Installation

### From VSIX File
1. Download the `.vsix` file from the releases
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X`)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded file

### From Source
1. Clone the repository
2. Navigate to the Extension directory
3. Run `npm install`
4. Run `npm run compile`
5. Press `F5` in VS Code to run the extension in development mode

## Setup

1. **Get your API Token:**
   - Sign up at [The Prime Time Dashboard](http://localhost:3000)
   - Go to your profile settings
   - Copy your API token

2. **Configure the Extension:**
   - Open VS Code Command Palette (`Ctrl+Shift+P`)
   - Type "Set Prime Time Token"
   - Enter your API token when prompted

3. **Start Coding:**
   - The extension will automatically start tracking
   - View your current session time in the status bar
   - Check your analytics at the web dashboard

## Commands

- **Set Prime Time Token**: Configure your API token
- **Show Prime Time Status**: Display current tracking status
- **Open Prime Time Dashboard**: Open the web dashboard in your browser

## Configuration

You can customize the extension behavior in VS Code settings:

```json
{
  "thePrimeTime.apiToken": "your-api-token",
  "thePrimeTime.apiUrl": "http://localhost:3000",
  "thePrimeTime.trackingEnabled": true
}
```

## How It Works

The extension tracks:
- **Active coding sessions**: Time spent actively editing files
- **File changes**: Which files you're working on
- **Language usage**: Programming languages detected
- **Folder activity**: Project folder organization
- **Save events**: When you save files
- **Character count**: How much code you write

## Privacy

- All data is sent securely to your Prime Time dashboard
- No data is stored locally beyond session tracking
- You can disable tracking at any time
- Your API token is stored securely in VS Code's global state

## Troubleshooting

### Extension Not Tracking
1. Check if you have a valid API token configured
2. Verify the API URL is correct
3. Check the VS Code output panel for error messages

### Status Bar Not Showing
1. Make sure the extension is enabled
2. Try reloading VS Code (`Ctrl+Shift+P` > "Developer: Reload Window")
3. Check if tracking is enabled in settings

### Data Not Syncing
1. Verify your internet connection
2. Check if the API server is running
3. Ensure your API token is valid

## Development

### Building the Extension
```bash
npm run compile
```

### Watching for Changes
```bash
npm run watch
```

### Packaging for Distribution
```bash
npm install -g vsce
vsce package
```

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the web dashboard FAQ
- Contact the development team

## License

This extension is part of The Prime Time project and is licensed under the MIT License. 