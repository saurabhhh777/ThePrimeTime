const axios = require('axios');

// Test configuration
const API_URL = 'http://localhost:7000';
const TEST_TOKEN = 'your-api-token-here'; // Replace with actual token

async function testConnection() {
    console.log('Testing Prime Time API connection...');
    console.log('API URL:', API_URL);
    console.log('Token:', TEST_TOKEN.substring(0, 10) + '...');
    
    try {
        // Test 1: Check if server is running
        console.log('\n1. Testing server connectivity...');
        const healthResponse = await axios.get(`${API_URL}/api/v1/user/profile`, {
            headers: { Authorization: `Bearer ${TEST_TOKEN}` }
        });
        console.log('✅ Server is running');
        
        // Test 2: Submit coding stats
        console.log('\n2. Testing coding stats submission...');
        const testData = {
            fileName: 'test.js',
            filePath: '/test/test.js',
            language: 'javascript',
            folder: 'test',
            duration: 300000, // 5 minutes
            linesChanged: 10,
            charactersTyped: 150
        };
        
        const statsResponse = await axios.post(`${API_URL}/api/v1/coding-stats/submit`, testData, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Coding stats submitted successfully');
        console.log('Response:', statsResponse.data);
        
        // Test 3: Get coding stats
        console.log('\n3. Testing coding stats retrieval...');
        const getStatsResponse = await axios.get(`${API_URL}/api/v1/coding-stats/stats?period=30days`, {
            headers: { Authorization: `Bearer ${TEST_TOKEN}` }
        });
        
        console.log('✅ Coding stats retrieved successfully');
        console.log('Stats count:', getStatsResponse.data.data?.length || 0);
        
        console.log('\n🎉 All tests passed! Extension should work correctly.');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure the backend server is running on port 7000');
        console.log('2. Verify your API token is correct');
        console.log('3. Check that the API endpoints are accessible');
    }
}

// Run the test
testConnection(); 