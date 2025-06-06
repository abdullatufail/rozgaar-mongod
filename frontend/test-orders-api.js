// Simple test script to check orders API response structure
const fetch = require('node-fetch');

async function testOrdersAPI() {
  try {
    console.log('Testing orders API...');
    
    // First, let's test without authentication to see the error structure
    const response = await fetch('http://localhost:3001/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const text = await response.text();
    console.log('Response body:', text);
    
    if (response.status === 401) {
      console.log('API requires authentication as expected');
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testOrdersAPI();
