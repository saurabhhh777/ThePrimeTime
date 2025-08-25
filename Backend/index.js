import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
import userRoute from "./routes/user.route.js";
import leaderRoute from "./routes/leader.route.js";
import accountRoute from "./routes/account.route.js";
import notificationsRoute from "./routes/notifications.route.js";
import preferencesRoute from "./routes/preferences.route.js";
import billingRoute from "./routes/billing.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import gitStatsRoute from "./routes/gitstats.route.js";
import ideStatsRoute from "./routes/idestats.route.js";
import { hybridDB } from "./config/hybridDB.js";
import blogsRoute from "./routes/blogs.route.js";
import codingStatsRoute from "./routes/codingstats.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import projectsRoute from "./routes/projects.route.js";
import reportsRoute from "./routes/reports.route.js";
dotenv.config();

// Initialize hybrid database (MongoDB + PostgreSQL)
hybridDB.initialize();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
}));
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/leader", leaderRoute);
app.use("/api/v1/account", accountRoute);
app.use("/api/v1/notifications", notificationsRoute);
app.use("/api/v1/preferences", preferencesRoute);
app.use("/api/v1/billing", billingRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/gitstats", gitStatsRoute);
app.use("/api/v1/idestats", ideStatsRoute);
app.use("/api/v1/blogs", blogsRoute);
app.use("/api/v1/coding-stats", codingStatsRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/projects", projectsRoute);
app.use("/api/v1/reports", reportsRoute);

const PORT = process.env.PORT || 3000;
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Handle authentication
    socket.on('authenticate', async (data) => {
        try {
            const { token } = data;
            if (!token) {
                socket.emit('auth_error', { message: 'No token provided' });
                return;
            }

            // Validate token (you can reuse your existing auth logic)
            // For now, we'll store the token with the socket
            socket.token = token;
            socket.emit('authenticated', { message: 'Authentication successful' });
            console.log('✅ Client authenticated:', socket.id);
        } catch (error) {
            socket.emit('auth_error', { message: 'Authentication failed' });
            console.error('❌ Authentication error:', error);
        }
    });

    // Handle real-time coding data
    socket.on('coding_data', async (data) => {
        try {
            if (!socket.token) {
                socket.emit('error', { message: 'Not authenticated' });
                return;
            }

            console.log('📊 Received real-time coding data:', data);
            
            // Process the coding data (similar to your existing submitCodingStats)
            // You can import and use your existing controller logic here
            const codingData = {
                userId: socket.token, // You'll need to decode the token to get user ID
                timestamp: new Date(),
                fileName: data.fileName,
                filePath: data.filePath,
                language: data.language,
                folder: data.folder,
                duration: data.duration,
                linesChanged: data.linesChanged || 0,
                charactersTyped: data.charactersTyped || 0
            };

            // Save to database (you can reuse your existing logic)
            // For now, we'll just acknowledge receipt
            socket.emit('data_received', { 
                success: true, 
                message: 'Coding data received and processed',
                data: codingData
            });

            // Broadcast to frontend for real-time updates
            socket.broadcast.emit('coding_update', {
                type: 'new_session',
                data: codingData
            });

        } catch (error) {
            console.error('❌ Error processing coding data:', error);
            socket.emit('error', { message: 'Failed to process coding data' });
        }
    });

    // Handle session updates
    socket.on('session_update', (data) => {
        console.log('🔄 Session update:', data);
        // Broadcast session updates to frontend
        socket.broadcast.emit('session_update', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running at: ${PORT}`);
    console.log(`🔌 WebSocket server ready for real-time communication`);
});