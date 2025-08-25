const axios = require('axios');

console.log('🔑 Quick API Token Test');
console.log('=======================\n');

// Replace this with your actual API token
const API_TOKEN = 'your-api-token-here';

async function testToken() {
    if (API_TOKEN === 'your-api-token-here') {
        console.log('⚠️  Please replace "your-api-token-here" with your actual token!');
        console.log('   1. Get your token from: http://localhost:5173/@yourusername');
        console.log('   2. Edit this file and replace the token');
        console.log('   3. Run: node test-token.js');
        return;
    }

    try {
        console.log('1. Testing token validation...');
        const response = await axios.get('http://localhost:7000/api/v1/user/profile', {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
        
        console.log('✅ Token is valid!');
        console.log('   User:', response.data.data?.username || 'N/A');
        
        console.log('\n2. Testing data submission...');
        const testData = {
            fileName: 'test.js',
            language: 'javascript',
            duration: 60000, // 1 minute
            linesChanged: 5,
            charactersTyped: 100
        };
        
        const submitResponse = await axios.post('http://localhost:7000/api/v1/coding-stats/submit', testData, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Data submitted successfully!');
        console.log('   Message:', submitResponse.data.message);
        
        console.log('\n🎉 Your token works! Now set it in VS Code:');
        console.log('   1. Press Ctrl+Shift+P in VS Code');
        console.log('   2. Type "Set Prime Time Token"');
        console.log('   3. Paste your token');
        console.log('   4. Start coding and save files');
        
    } catch (error) {
        console.log('❌ Token test failed:', error.response?.data?.error || error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure backend is running on port 7000');
        console.log('   2. Verify your token is correct');
        console.log('   3. Check if you copied the full token');
    }
}

testToken(); 