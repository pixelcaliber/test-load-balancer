const express = require('express'); 
const { createProxyMiddleware } = require('http-proxy-middleware');
const constants = require('../constants');

const router = express.Router();
const servers = constants.servers;

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