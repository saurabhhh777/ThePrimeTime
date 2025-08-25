# 🔄 Extension-Backend Interaction Flow

## 📊 **Complete Data Flow Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VS Code       │    │   Extension     │    │   Backend       │    │   Frontend      │
│   User          │    │   (Local)       │    │   (Server)      │    │   (Dashboard)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │ 1. Install Extension  │                       │                       │
         │──────────────────────▶│                       │                       │
         │                       │                       │                       │
         │ 2. Get API Token      │                       │                       │
         │──────────────────────────────────────────────────────────────────────▶│
         │                       │                       │                       │
         │ 3. Copy Token         │                       │                       │
         │◀──────────────────────────────────────────────────────────────────────│
         │                       │                       │                       │
         │ 4. Set Token          │                       │                       │
         │──────────────────────▶│                       │                       │
         │                       │ 5. Store Token        │                       │
         │                       │ (Local Storage)       │                       │
         │                       │                       │                       │
         │ 6. Start Coding       │                       │                       │
         │──────────────────────▶│                       │                       │
         │                       │ 7. Track Activity     │                       │
         │                       │ (File changes, saves) │                       │
         │                       │                       │                       │
         │ 8. Save File          │                       │                       │
         │──────────────────────▶│                       │                       │
         │                       │ 9. End Session        │                       │
         │                       │                       │                       │
         │                       │ 10. Send Data         │                       │
         │                       │──────────────────────▶│                       │
         │                       │                       │ 11. Validate Token    │
         │                       │                       │                       │
         │                       │                       │ 12. Find User         │
         │                       │                       │                       │
         │                       │                       │ 13. Save to DB        │
         │                       │                       │ (PostgreSQL + MongoDB)│
         │                       │                       │                       │
         │                       │ 14. Success Response  │                       │
         │                       │◀──────────────────────│                       │
         │                       │                       │                       │
         │ 15. Show Success      │                       │                       │
         │◀──────────────────────│                       │                       │
         │                       │                       │                       │
         │ 16. View Dashboard    │                       │                       │
         │──────────────────────────────────────────────────────────────────────▶│
         │                       │                       │                       │
         │ 17. See Analytics     │                       │                       │
         │◀──────────────────────────────────────────────────────────────────────│
```

## 🎯 **Detailed Step-by-Step Process**

### **Phase 1: Installation & Setup**
```
User Action                    Extension Response          Backend Response
─────────────────────────────────────────────────────────────────────────────
1. Install Extension          ✅ Extension loaded          N/A
2. Get API Token from         N/A                         N/A
   Frontend Profile
3. Set Token via Command      ✅ Token stored locally      N/A
   Palette
4. Extension activates        ✅ Tracking started          N/A
```

### **Phase 2: Real-time Tracking**
```
User Action                    Extension Response          Backend Response
─────────────────────────────────────────────────────────────────────────────
5. Open file                  ✅ Session started           N/A
6. Type code                  ✅ Track characters          N/A
7. Save file                  ✅ Track lines changed       N/A
8. Switch files               ✅ End session, start new    N/A
9. Continue coding            ✅ Continue tracking         N/A
```

### **Phase 3: Data Transmission**
```
User Action                    Extension Response          Backend Response
─────────────────────────────────────────────────────────────────────────────
10. Session ends              ✅ Prepare data packet       N/A
11. Send to backend           ✅ HTTP POST request         ✅ Receive data
12. Validate token            N/A                         ✅ Check API token
13. Find user                 N/A                         ✅ Query database
14. Save data                 N/A                         ✅ Store in DB
15. Return success            ✅ Show success message      ✅ Send response
```

### **Phase 4: Dashboard Updates**
```
User Action                    Extension Response          Backend Response
─────────────────────────────────────────────────────────────────────────────
16. Open dashboard            N/A                         N/A
17. View analytics            N/A                         ✅ Serve data
18. See real-time stats       N/A                         ✅ API responses
```

## 🔧 **Technical Implementation Details**

### **Extension Side (VS Code)**
```typescript
// 1. Token Management
context.globalState.update('primeTimeToken', token);

// 2. Event Listeners
vscode.workspace.onDidChangeTextDocument((event) => {
    // Track character changes
});

vscode.window.onDidChangeActiveTextEditor((editor) => {
    // Track file switches
});

vscode.workspace.onDidSaveTextDocument((document) => {
    // Track saves
});

// 3. Data Transmission
const response = await axios.post(`${apiUrl}/api/v1/coding-stats/submit`, data, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

### **Backend Side (Node.js)**
```javascript
// 1. Token Validation
const apiToken = authHeader.substring(7);
const user = await prisma.user.findFirst({
    where: { apiToken: apiToken }
});

// 2. Data Processing
const codingStatsData = {
    userId: user.id,
    timestamp: new Date(timestamp),
    fileName,
    filePath,
    language,
    folder,
    duration: parseInt(duration),
    linesChanged: parseInt(linesChanged),
    charactersTyped: parseInt(charactersTyped)
};

// 3. Database Storage
const postgresStats = await prisma.codingStats.create({
    data: codingStatsData
});

const mongoStats = await hybridDB.saveToMongoDB('codingStats', codingStatsData);
```

## 📊 **Data Flow Examples**

### **Example 1: User Types Code**
```
1. User types in file.js
2. Extension detects change
3. Increments character count
4. Updates session duration
5. When file is saved:
   - Sends data to backend
   - Backend validates token
   - Saves to database
   - Returns success
   - Extension shows notification
```

### **Example 2: User Switches Files**
```
1. User opens new file
2. Extension ends previous session
3. Sends previous session data
4. Starts new session
5. Backend processes data
6. Dashboard updates automatically
```

### **Example 3: User Saves Multiple Files**
```
1. User saves file1.js
2. Extension sends session data
3. User saves file2.py
4. Extension sends session data
5. Backend processes both
6. Dashboard shows both sessions
```

## 🎯 **User Experience Timeline**

```
Time    User Action              Extension Response        Backend Response
─────────────────────────────────────────────────────────────────────────────
0:00    Install Extension       ✅ Extension ready         N/A
0:01    Set API Token           ✅ Token configured        N/A
0:02    Open code file          ✅ Tracking started        N/A
0:05    Type some code          ✅ Data collected          N/A
0:10    Save file               ✅ Session ended           ✅ Data received
0:11    See success message     ✅ Notification shown      ✅ Data saved
0:12    Open dashboard          N/A                        N/A
0:13    View analytics          N/A                        ✅ Data served
```

## 🔒 **Security & Privacy**

### **Data Protection**
- ✅ API token stored locally in VS Code
- ✅ HTTPS communication (in production)
- ✅ Token-based authentication
- ✅ No personal data sent without consent
- ✅ User controls all data transmission

### **Privacy Features**
- ✅ Local session tracking only
- ✅ User controls when data is sent
- ✅ No data collection without token
- ✅ Secure token storage
- ✅ User can disable tracking anytime

## 🚀 **Performance Optimizations**

### **Extension Optimizations**
- ✅ Efficient event listeners
- ✅ Minimal memory footprint
- ✅ Background processing
- ✅ Smart session management
- ✅ Error handling and retries

### **Backend Optimizations**
- ✅ Fast token validation
- ✅ Efficient database queries
- ✅ Connection pooling
- ✅ Response caching
- ✅ Rate limiting protection 