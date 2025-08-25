const axios = require('axios');

console.log('🔍 Quick Extension Test');
console.log('=======================\n');

async function quickTest() {
    console.log('1. Checking if backend server is running...');
    try {
        await axios.get('http://localhost:7000/api/v1/user/profile');
        console.log('✅ Backend server is running on port 7000');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend server is not running');
            console.log('   Start it with: cd Backend && npm run dev');
            return;
        }
        console.log('✅ Backend server is running (got response)');
    }

    console.log('\n2. Checking if frontend server is running...');
    try {
        await axios.get('http://localhost:5173');
        console.log('✅ Frontend server is running on port 5173');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Frontend server is not running');
            console.log('   Start it with: cd Frontend && npm run dev');
            return;
        }
        console.log('✅ Frontend server is running (got response)');
    }

    console.log('\n3. Extension compilation status...');
    try {
        const fs = require('fs');
        if (fs.existsSync('./out/extension.js')) {
            console.log('✅ Extension is compiled and ready');
        } else {
            console.log('❌ Extension needs to be compiled');
            console.log('   Run: npm run compile');
            return;
        }
    } catch (error) {
        console.log('❌ Error checking extension compilation');
    }

    console.log('\n🎉 All systems are ready for testing!');
    console.log('\n📋 Next Steps:');
    console.log('1. Get your API token from: http://localhost:5173/@yourusername');
    console.log('2. Edit test-connection.js and add your token');
    console.log('3. Run: node test-connection.js');
    console.log('4. Open Extension folder in VS Code and press F5');
    console.log('5. Use "Set Prime Time Token" command in the new VS Code window');
}

quickTest().catch(console.error); 