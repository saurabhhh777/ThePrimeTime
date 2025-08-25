const axios = require('axios');

console.log('🎯 Simulating VS Code Extension Behavior');
console.log('=======================================\n');

// Simulate extension configuration
const API_URL = 'http://localhost:7000';
const API_TOKEN = 'your-api-token-here'; // Replace with your token

// Simulate coding session data
const simulateCodingSession = async () => {
    console.log('📝 Simulating a coding session...\n');

    // Simulate user opening a file
    console.log('1. User opens file: app.js');
    console.log('   Extension: Session started');
    
    // Simulate typing
    console.log('2. User types code for 2 minutes');
    console.log('   Extension: Tracking characters and duration');
    
    // Simulate saving
    console.log('3. User saves file (Ctrl+S)');
    console.log('   Extension: Session ended, preparing to send data\n');

    // Prepare the data that extension would send
    const codingData = {
        fileName: 'app.js',
        filePath: '/project/app.js',
        language: 'javascript',
        folder: 'my-project',
        duration: 120000, // 2 minutes in milliseconds
        linesChanged: 8,
        charactersTyped: 150
    };

    console.log('📊 Data being sent to backend:');
    console.log(JSON.stringify(codingData, null, 2));
    console.log('');

    try {
        console.log('🌐 Sending data to backend...');
        console.log(`   URL: ${API_URL}/api/v1/coding-stats/submit`);
        console.log(`   Method: POST`);
        console.log(`   Headers: Authorization: Bearer ${API_TOKEN.substring(0, 10)}...`);
        console.log('');

        const response = await axios.post(`${API_URL}/api/v1/coding-stats/submit`, codingData, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Backend Response:');
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.data.message}`);
        console.log(`   Success: ${response.data.success}`);
        console.log('');

        console.log('🎉 Extension would show: "Coding session saved!"');
        console.log('📊 Dashboard would update with new data');

    } catch (error) {
        console.log('❌ Error occurred:');
        console.log(`   Status: ${error.response?.status || 'Unknown'}`);
        console.log(`   Error: ${error.response?.data?.error || error.message}`);
        console.log('');
        console.log('🔧 Extension would show: "Failed to save coding session"');
    }
};

// Simulate multiple sessions
const simulateMultipleSessions = async () => {
    console.log('🔄 Simulating multiple coding sessions...\n');

    const sessions = [
        {
            fileName: 'index.html',
            language: 'html',
            duration: 90000, // 1.5 minutes
            linesChanged: 5,
            charactersTyped: 80
        },
        {
            fileName: 'styles.css',
            language: 'css',
            duration: 180000, // 3 minutes
            linesChanged: 12,
            charactersTyped: 200
        },
        {
            fileName: 'script.js',
            language: 'javascript',
            duration: 300000, // 5 minutes
            linesChanged: 20,
            charactersTyped: 350
        }
    ];

    for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i];
        console.log(`📝 Session ${i + 1}: Working on ${session.fileName}`);
        
        try {
            const response = await axios.post(`${API_URL}/api/v1/coding-stats/submit`, {
                fileName: session.fileName,
                filePath: `/project/${session.fileName}`,
                language: session.language,
                folder: 'my-project',
                duration: session.duration,
                linesChanged: session.linesChanged,
                charactersTyped: session.charactersTyped
            }, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`   ✅ Saved: ${response.data.message}`);
        } catch (error) {
            console.log(`   ❌ Failed: ${error.response?.data?.error || error.message}`);
        }
    }
};

// Main simulation
const runSimulation = async () => {
    console.log('🚀 Starting Extension Simulation...\n');

    // Check if token is set
    if (API_TOKEN === 'your-api-token-here') {
        console.log('⚠️  Please set your API token in the script first!');
        console.log('   1. Get your token from: http://localhost:5173/@yourusername');
        console.log('   2. Replace "your-api-token-here" with your actual token');
        console.log('   3. Run this script again\n');
        return;
    }

    // Simulate single session
    await simulateCodingSession();
    
    console.log('⏸️  Pausing 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate multiple sessions
    await simulateMultipleSessions();
    
    console.log('🎯 Simulation Complete!');
    console.log('');
    console.log('📋 What you should see:');
    console.log('   - Backend logs showing data being saved');
    console.log('   - Dashboard updated with new coding sessions');
    console.log('   - Extension notifications (if running in VS Code)');
    console.log('');
    console.log('🔍 Check your dashboard at: http://localhost:5173/dashboard');
};

runSimulation().catch(console.error); 