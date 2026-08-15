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
  console.log('Login:', login.status);

  // Get food
  const foods = await request('GET', '/api/foods');
  const foodId = foods.data.data.foods[0].id;
  console.log('FoodId:', foodId);

  // Try POST /api/cart/items
  const add3 = await request('POST', '/api/cart/items', { foodId, quantity: 1 }, token);
  console.log('POST /api/cart/items:', add3.status);

  // Try PATCH
  const patch1 = await request('PATCH', `/api/cart/items/${foodId}`, { quantity: 2 }, token);
  console.log('PATCH /api/cart/items/:id:', patch1.status);

  // Try DELETE cart
  const delCart = await request('DELETE', `/api/cart`, null, token);
  console.log('DELETE /api/cart:', delCart.status);
}

testCart();
