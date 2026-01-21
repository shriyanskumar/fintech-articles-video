const axios = require('axios');

async function testApi() {
    try {
        console.log("Testing API at http://localhost:5000/api/workflows?type=apply");
        const res = await axios.get('http://localhost:5000/api/workflows?type=apply');
        console.log(`Status: ${res.status}`);
        console.log(`Count: ${res.data.length}`);
        console.log("Titles found:");
        res.data.forEach(w => console.log(` - ${w.title}`));
    } catch (e) {
        console.error("API Test Failed:", e.message);
    }
}

testApi();
