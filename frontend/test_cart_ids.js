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
  const addResp = await request('POST', '/api/cart/items', { foodId, quantity: 1 }, token);
  const cartItemId = addResp.data.data.cart.items[0].id;
  console.log('FoodId:', foodId);
  console.log('CartItemId:', cartItemId);

  // Try PATCH with foodId
  const patchFood = await request('PATCH', `/api/cart/items/${foodId}`, { quantity: 2 }, token);
  console.log('PATCH with foodId:', patchFood.status, JSON.stringify(patchFood.data));

  // Try PATCH with cartItemId
  const patchCartItem = await request('PATCH', `/api/cart/items/${cartItemId}`, { quantity: 3 }, token);
  console.log('PATCH with cartItemId:', patchCartItem.status, JSON.stringify(patchCartItem.data));
  
  // Try DELETE with foodId
  const delFood = await request('DELETE', `/api/cart/items/${foodId}`, null, token);
  console.log('DELETE with foodId:', delFood.status, JSON.stringify(delFood.data));
  
  // Try DELETE with cartItemId
  const delCartItem = await request('DELETE', `/api/cart/items/${cartItemId}`, null, token);
  console.log('DELETE with cartItemId:', delCartItem.status, JSON.stringify(delCartItem.data));
}

testCart();
