# API Usage Analysis - ThePrimeTime

## ✅ **APIs Currently Used by Frontend**

### **1. User Routes (`/api/v1/user`)**
- ✅ `POST /signup` - User registration (legacy)
- ✅ `POST /signin` - User login with username/email
- ✅ `POST /logout` - User logout
- ✅ `GET /profile` - Get own profile data
- ✅ `PUT /profile` - Update own profile
- ✅ `GET /profile/:username` - Get public profile by username
- ✅ `GET /settings` - Get user settings
- ✅ `PUT /settings` - Update user settings
- ✅ `PUT /password` - Update password
- ✅ `DELETE /account` - Delete account
- ✅ `POST /check-username` - Check username availability
- ✅ `POST /send-signup-otp` - Send OTP for signup
- ✅ `POST /verify-signup-otp` - Verify OTP and create account

### **2. Account Routes (`/api/v1/account`)**
- ✅ `GET /api-key` - Get user's API key
- ✅ `POST /api-key` - Update API key
- ✅ `GET /` - Get account details
- ✅ `PUT /update/primary-email` - Update primary email
- ✅ `PUT /update/backup-email` - Update backup email
- ✅ `PUT /update/github-user-id` - Update GitHub user ID
- ✅ `POST /delete` - Initiate account deletion
- ✅ `DELETE /delete` - Cancel account deletion

### **3. Dashboard Routes (`/api/v1/dashboard`)**
- ✅ `GET /` - Get dashboard data (added to Dashboard.tsx)

### **4. Coding Stats Routes (`/api/v1/coding-stats`)**
- ✅ `GET /stats` - Get coding statistics (used in Dashboard, Projects)

### **5. Projects Routes (`/api/v1/projects`)**
- ✅ `GET /` - Get user projects
- ✅ `DELETE /:id` - Delete project

### **6. Reports Routes (`/api/v1/reports`)**
- ✅ `GET /` - Get coding reports with period filter

### **7. Leaderboard Routes (`/api/v1/leader`)**
- ✅ `GET /global` - Get global leaderboard

### **8. Blogs Routes (`/api/v1/blogs`)**
- ✅ `GET /` - Get all blogs
- ✅ `POST /` - Create new blog
- ✅ `PUT /:id` - Update blog
- ✅ `DELETE /:id` - Delete blog

### **9. Subscription Routes (`/api/v1/subscription`)**
- ✅ `GET /user` - Get user subscription details

## ⚠️ **APIs Available but Not Currently Used**

### **1. Git Stats Routes (`/api/v1/gitstats`)**
- ⚠️ `GET /` - Get Git statistics
- ⚠️ `POST /` - Create Git stats
- ⚠️ `PUT /` - Update Git stats
- ⚠️ `DELETE /` - Delete Git stats

### **2. IDE Stats Routes (`/api/v1/idestats`)**
- ⚠️ `GET /` - Get IDE statistics
- ⚠️ `POST /` - Create IDE stats
- ⚠️ `PUT /` - Update IDE stats
- ⚠️ `DELETE /` - Delete IDE stats

### **3. Language Routes (`/api/v1/lang`)**
- ⚠️ `GET /` - Get language statistics
- ⚠️ `POST /` - Create language stats
- ⚠️ `PUT /` - Update language stats
- ⚠️ `DELETE /` - Delete language stats

### **4. Notifications Routes (`/api/v1/notifications`)**
- ⚠️ `GET /` - Get notifications
- ⚠️ `POST /create` - Create notification
- ⚠️ `PUT /:id/read` - Mark notification as read

### **5. Preferences Routes (`/api/v1/preferences`)**
- ⚠️ `POST /` - Add user preferences

### **6. Billing Routes (`/api/v1/billing`)**
- ⚠️ `GET /` - Get billing details
- ⚠️ `POST /` - Create billing record

## 🔧 **Recommendations for API Integration**

### **1. Add Notifications to Frontend**
```typescript
// Add to navbar or settings page
const fetchNotifications = async () => {
  const response = await instance.get('/api/v1/notifications');
  return response.data;
};
```

### **2. Add Git Stats Integration**
```typescript
// Add to dashboard or reports page
const fetchGitStats = async () => {
  const response = await instance.get('/api/v1/gitstats');
  return response.data;
};
```

### **3. Add IDE Stats Integration**
```typescript
// Add to dashboard or reports page
const fetchIdeStats = async () => {
  const response = await instance.get('/api/v1/idestats');
  return response.data;
};
```

### **4. Add Language Stats Integration**
```typescript
// Add to dashboard or reports page
const fetchLanguageStats = async () => {
  const response = await instance.get('/api/v1/lang');
  return response.data;
};
```

### **5. Add Billing Integration**
```typescript
// Add to subscription or billing page
const fetchBillingDetails = async () => {
  const response = await instance.get('/api/v1/billing');
  return response.data;
};
```

## 📊 **API Usage Summary**

- **Total Backend Routes**: 15 route files
- **Routes Used by Frontend**: 9 route files (60%)
- **Routes Not Used**: 6 route files (40%)
- **Total API Endpoints**: ~50 endpoints
- **Endpoints Used**: ~35 endpoints (70%)
- **Endpoints Not Used**: ~15 endpoints (30%)

## 🎯 **Next Steps**

1. **Integrate Notifications** - Add notification bell to navbar
2. **Enhance Dashboard** - Add Git, IDE, and Language stats
3. **Add Billing Page** - Create subscription management
4. **Improve Reports** - Use more detailed stats APIs
5. **Add Preferences** - User preference management

All APIs are properly set up in the backend and ready for frontend integration! 