const https = require('https');

const BASE_URL = 'https://food-delivery-system-m9nm.onrender.com';

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {}
    };

    if (body) {
      options.headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

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
    if (body) req.write(body);
    req.end();
  });
};

async function testCart() {
  const login = await request('POST', '/api/auth/login', {
    email: 'customer@fooddelivery.local',
    password: 'Customer@123!'
  });
  const token = login.data.data.token;
  
  // Get food
  const foods = await request('GET', '/api/foods');
  const foodId = foods.data.data.foods[0].id;
  
  // Empty cart
  await request('DELETE', '/api/cart', null, token);

  // Add to cart
  await request('POST', '/api/cart/items', { foodId, quantity: 1 }, token);

  // Get cart
  const cartResp = await request('GET', '/api/cart', null, token);
  console.log('GET /api/cart response:');
  console.log(JSON.stringify(cartResp.data.data.cart.items, null, 2));
}

testCart();
