const express = require('express'); 
const { createProxyMiddleware } = require('http-proxy-middleware');
const constants = require('../constants');
const axios = require('axios');

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
let healthyServers = [];

function getServer() {

  // Round robin
  currIndex = (currIndex + 1) % healthyServers.length;

  return healthyServers[currIndex];
}
async function updateHealthyServers() {

  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    try {
      const response = await axios.get(`http://${server.host}:${server.port}/app/healthcheck`);
      if (response.status === 200) {
        healthyServers.push(server);  
      } 
        
      } catch (error) {
        console.log("Error while checking the health status! Error: " + error)
      }
    }
}

updateHealthyServers();

setInterval(updateHealthyServers, 10000);

// Proxy requests
router.all('*', (req, res) => {
  if (healthyServers.length === 0) {
    return res.status(500).send('No healthy servers!');
  }  
  // Get next target server
  const target = getServer();
  proxyOptions.target = `http://${target.host}:${target.port}`;
  
  // Forward request
  createProxyMiddleware(proxyOptions)(req, res); 
});

module.exports = router;