const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎬 The Prime Time Extension - Complete Demo');
console.log('==========================================\n');

// Demo configuration
const BACKEND_URL = 'http://localhost:7000';
const FRONTEND_URL = 'http://localhost:5173';

async function demoExtensionFlow() {
    console.log('📋 Step 1: User Installation Process');
    console.log('------------------------------------');
    console.log('1. User opens VS Code');
    console.log('2. Goes to Extensions (Ctrl+Shift+X)');
    console.log('3. Searches for "The Prime Time"');
    console.log('4. Clicks Install');
    console.log('✅ Extension installed successfully!\n');

    console.log('📋 Step 2: User Account Setup');
    console.log('-----------------------------');
    console.log('1. User opens browser and goes to:', FRONTEND_URL);
    console.log('2. Signs up or signs in to account');
    console.log('3. Goes to profile page to get API token');
    console.log('4. Clicks eye icon to reveal API token');
    console.log('5. Copies the API token\n');

    console.log('📋 Step 3: Extension Configuration');
    console.log('---------------------------------');
    console.log('1. User opens VS Code Command Palette (Ctrl+Shift+P)');
    console.log('2. Types "Set Prime Time Token"');
    console.log('3. Pastes API token when prompted');
    console.log('4. Extension shows: "Prime Time token saved successfully!"\n');

    console.log('📋 Step 4: Extension Activation');
    console.log('-------------------------------');
    console.log('1. Extension automatically starts tracking');
    console.log('2. Status bar shows: "Prime Time tracking started!"');
    console.log('3. Extension monitors file changes, saves, and editor switches\n');

    console.log('📋 Step 5: Real-time Data Collection');
    console.log('-----------------------------------');
    console.log('Extension collects data when user:');
    console.log('- Opens a file');
    console.log('- Makes changes to code');
    console.log('- Saves files');
    console.log('- Switches between files');
    console.log('- Types characters');
    console.log('- Changes lines of code\n');

    console.log('📋 Step 6: Data Transmission to Backend');
    console.log('---------------------------------------');
    console.log('When coding session ends, extension sends:');
    console.log('- File information (name, path, language)');
    console.log('- Session duration');
    console.log('- Lines changed');
    console.log('- Characters typed');
    console.log('- Project folder context\n');

    console.log('📋 Step 7: Backend Processing');
    console.log('-----------------------------');
    console.log('Backend receives data and:');
    console.log('- Validates API token');
    console.log('- Finds user by token');
    console.log('- Saves to PostgreSQL database');
    console.log('- Saves to MongoDB database');
    console.log('- Returns success response\n');

    console.log('📋 Step 8: Dashboard Updates');
    console.log('---------------------------');
    console.log('User can view data in dashboard:');
    console.log('- Real-time coding statistics');
    console.log('- Language breakdown');
    console.log('- Activity calendar');
    console.log('- Project analytics');
    console.log('- Productivity metrics\n');

    // Interactive demo
    console.log('🎯 Interactive Demo: Testing Real Data Flow');
    console.log('==========================================\n');

    // Get API token from user
    const token = await new Promise((resolve) => {
        rl.question('Enter your API token (or press Enter to skip): ', (answer) => {
            resolve(answer.trim());
        });
    });

    if (token) {
        console.log('\n🧪 Testing with your API token...\n');
        
        try {
            // Test 1: Validate token
            console.log('1. Validating API token...');
            const profileResponse = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Token is valid!');
            console.log('   User ID:', profileResponse.data.data?._id || 'N/A');
            console.log('   Username:', profileResponse.data.data?.username || 'N/A');

            // Test 2: Submit coding stats
            console.log('\n2. Simulating coding session...');
            const codingData = {
                fileName: 'demo.js',
                filePath: '/demo/demo.js',
                language: 'javascript',
                folder: 'demo-project',
                duration: 180000, // 3 minutes
                linesChanged: 15,
                charactersTyped: 250
            };

            console.log('   Sending data:', codingData);
            const statsResponse = await axios.post(`${BACKEND_URL}/api/v1/coding-stats/submit`, codingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Coding session saved successfully!');
            console.log('   Response:', statsResponse.data.message);

            // Test 3: Get coding stats
            console.log('\n3. Retrieving coding statistics...');
            const getStatsResponse = await axios.get(`${BACKEND_URL}/api/v1/coding-stats/stats?period=30days`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Statistics retrieved!');
            console.log('   Total sessions:', getStatsResponse.data.data?.length || 0);

            console.log('\n🎉 Demo completed successfully!');
            console.log('\n📊 What happens in VS Code:');
            console.log('- User sees: "Coding session saved!" notification');
            console.log('- Status bar shows current tracking status');
            console.log('- Data appears in dashboard immediately');

        } catch (error) {
            console.log('\n❌ Demo failed:', error.message);
            if (error.response) {
                console.log('   Status:', error.response.status);
                console.log('   Error:', error.response.data);
            }
        }
    } else {
        console.log('\n⏭️ Skipping API test. You can test manually by:');
        console.log('1. Getting your API token from the frontend');
        console.log('2. Running: node test-connection.js');
        console.log('3. Opening Extension folder in VS Code and pressing F5');
    }

    console.log('\n📋 Step 9: User Experience Summary');
    console.log('================================');
    console.log('✅ Extension installs seamlessly');
    console.log('✅ Simple token configuration');
    console.log('✅ Automatic background tracking');
    console.log('✅ Real-time data synchronization');
    console.log('✅ Instant dashboard updates');
    console.log('✅ No user intervention required');
    console.log('✅ Privacy-focused (local token storage)');

    rl.close();
}

demoExtensionFlow().catch(console.error); 