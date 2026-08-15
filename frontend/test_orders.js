const https = require('https');

const BASE_URL = 'https://food-delivery-system-m9nm.onrender.com';

const request = (method, path, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {}
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add json content type for POST (used for login)
    if (method === 'POST') {
        options.headers['Content-Type'] = 'application/json';
    }

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

const postRequest = (path, body, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const bodyStr = JSON.stringify(body);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
};

async function testOrders() {
  const login = await postRequest('/api/auth/login', {
    email: 'customer@fooddelivery.local',
    password: 'Customer@123!'
  });
  const token = login.data.data.token;
  console.log('Login:', login.status);

  // Get food
  const foods = await request('GET', '/api/foods');
  const foodId = foods.data.data.foods[0].id;
  
  // Add to cart
  await postRequest('/api/cart/items', { foodId, quantity: 1 }, token);
  
  // Create order
  const newOrder = await postRequest('/api/orders', {
    customerName: 'Test',
    customerPhone: '1234567890',
    deliveryAddress: '123 Test St',
    totalAmount: 100
  }, token);
  console.log('Order created:', newOrder.status);

  // Get orders
  const orders = await request('GET', '/api/orders', token);
  console.log('Orders response:', JSON.stringify(orders.data, null, 2));
}

testOrders();
