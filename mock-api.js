const http = require('http');
const url = require('url');

const PORT = 8080;

// Seed data
const users = [
  { id: '1', name: 'Admin User', phone: '9999999999', role: 'SUPER_ADMIN' },
  { id: '2', name: 'John Customer', phone: '8888888888', role: 'USER' },
];

const categories = [
  { id: '1', name: 'Real Estate', children: [
    { id: '1a', name: 'Apartments', children: [] },
    { id: '1b', name: 'Houses', children: [] }
  ]},
  { id: '2', name: 'Vehicles', children: [
    { id: '2a', name: 'Cars', children: [] },
    { id: '2b', name: 'Bikes', children: [] }
  ]},
  { id: '3', name: 'Electronics', children: [] },
  { id: '4', name: 'Jobs', children: [] },
  { id: '5', name: 'Services', children: [] }
];

const lineAds = [
  { id: '1', content: '2BHK Apartment in Mumbai', state: 'Maharashtra', city: 'Mumbai', postedBy: 'John', status: 'PUBLISHED', mainCategory: { name: 'Real Estate' }, backgroundColor: '#f0f0f0', textColor: '#000' },
  { id: '2', content: 'Honda City 2020, Well maintained', state: 'Delhi', city: 'New Delhi', postedBy: 'Ahmed', status: 'PUBLISHED', mainCategory: { name: 'Vehicles' }, backgroundColor: '#e8e8e8', textColor: '#333' },
  { id: '3', content: 'iPhone 15 Pro Max, sealed box', state: 'Karnataka', city: 'Bangalore', postedBy: 'Sarah', status: 'PUBLISHED', mainCategory: { name: 'Electronics' }, backgroundColor: '#f5f5f5', textColor: '#000' },
  { id: '4', content: 'Experienced Software Developer needed', state: 'Haryana', city: 'Gurgaon', postedBy: 'HR Team', status: 'PUBLISHED', mainCategory: { name: 'Jobs' }, backgroundColor: '#fff', textColor: '#222' },
  { id: '5', content: 'Professional Plumbing & Electrical Services', state: 'Tamil Nadu', city: 'Chennai', postedBy: 'Services Co', status: 'PUBLISHED', mainCategory: { name: 'Services' }, backgroundColor: '#f9f9f9', textColor: '#111' }
];

const posterAds = [
  { id: '1', content: 'Premium Office Space', state: 'Maharashtra', city: 'Mumbai', postedBy: 'Property Dev', status: 'PUBLISHED', mainCategory: { name: 'Real Estate' } },
  { id: '2', content: 'Luxury Car Dealership', state: 'Delhi', city: 'New Delhi', postedBy: 'Cars Inc', status: 'PUBLISHED', mainCategory: { name: 'Vehicles' } },
  { id: '3', content: 'Gadget Store Sale', state: 'Karnataka', city: 'Bangalore', postedBy: 'Tech Store', status: 'PUBLISHED', mainCategory: { name: 'Electronics' } }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Routes
  if (pathname === '/api/line-ad/today') {
    res.writeHead(200);
    res.end(JSON.stringify(lineAds));
  } else if (pathname === '/api/poster-ad/today') {
    res.writeHead(200);
    res.end(JSON.stringify(posterAds));
  } else if (pathname === '/api/video-ad/today') {
    res.writeHead(200);
    res.end(JSON.stringify([]));
  } else if (pathname === '/api/categories/tree') {
    res.writeHead(200);
    res.end(JSON.stringify(categories));
  } else if (pathname === '/api/configurations/search-slogan') {
    res.writeHead(200);
    res.end(JSON.stringify({ primarySlogan: 'Find What You Need', secondarySlogan: 'Search through thousands of ads' }));
  } else if (pathname === '/api/configurations/about-us') {
    res.writeHead(200);
    res.end(JSON.stringify({ content: '<p>PaisaAds is India\'s leading classified ads platform with thousands of listings across multiple categories.</p>' }));
  } else if (pathname === '/api/configurations/faq') {
    res.writeHead(200);
    res.end(JSON.stringify({ questions: [
      { question: 'How to post an ad?', answer: 'Register an account and use the Post Ad section in your dashboard.' },
      { question: 'Is posting free?', answer: 'Yes, basic posting is completely free!' }
    ]}));
  } else if (pathname === '/api/auth/login') {
    res.writeHead(200);
    res.end(JSON.stringify({ token: 'mock-jwt-token', user: { id: '2', name: 'John', phone: '8888888888', role: 'USER' } }));
  } else if (pathname === '/api/auth/profile') {
    res.writeHead(200);
    res.end(JSON.stringify({ id: '2', name: 'John', phone: '8888888888', role: 'USER' }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
