const https = require('https');

const BASE_URL = 'https://food-delivery-system-m9nm.onrender.com';

const request = (method, path, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = { method, headers: {} };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    
    if (method === 'POST') options.headers['Content-Type'] = 'application/json';

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} });
        } catch (e) { resolve({ status: res.statusCode, data }); }
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
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); } 
        catch (e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
};

async function testFav() {
  const login = await postRequest('/api/auth/login', {
    email: 'customer@fooddelivery.local',
    password: 'Customer@123!'
  });
  const token = login.data.data.token;
  
  // Get foods to find an ID
  const foods = await request('GET', '/api/foods', token);
  const foodId = foods.data.data.foods[0].id;

  // Add fav
  await postRequest(`/api/favorites/${foodId}`, {}, token);

  const favs = await request('GET', '/api/favorites', token);
  console.log('Favorites response:', JSON.stringify(favs.data, null, 2));
}

testFav();
