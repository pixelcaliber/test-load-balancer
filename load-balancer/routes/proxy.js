const express = require('express'); 
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();
const servers = [
  {
    host: 'localhost',
    port: 3003,
    weight: 1,
  },
  {
    host: 'localhost',
    port: 3001,
    weight: 1,
  },
  {
    host: 'localhost',
    port: 3002,
    weight: 2,
  },
];
const proxyOptions = {
  target: '',
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'sample');
  },
  logLevel: 'debug' 
};

let currIndex = 0;

function getServer() {

  // Round robin
  currIndex = (currIndex + 1) % servers.length;

  return servers[currIndex];
}

// Proxy requests
router.all('*', (req, res) => {
  
  // Get next target server
  const target = getServer();
  proxyOptions.target = `http://${target.host}:${target.port}`;
  
  // Forward request
  createProxyMiddleware(proxyOptions)(req, res); 
});

module.exports = router;