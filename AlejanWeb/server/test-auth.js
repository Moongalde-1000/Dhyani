const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing authentication endpoint...');
    
    const response = await axios.post('http://server.keshavinfotechdemo2.com:4009/auth/login', {
      email: 'nanny1@gmail.com',
      password: '12345678'
    });
    
    console.log('Success! Response:', response.data);
  } catch (error) {
    console.error('Error testing auth:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testAuth();
