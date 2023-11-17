const express = require('express');
const axios = require('axios');
const constants = require('../constants');

const router = express.Router();

router.get('/health', async (req, res) => {

  const servers = constants.servers;
  const results = [];

  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];

    try {
      const response = await axios.get(`http://${server.host}:${server.port}/app/healthcheck`);
      if (response.status === 200) {
        results.push({
          port: server.port,
          status: 'passing'
        });  
      } else {
        results.push({
            port: server.port,
            status: 'failing' 
          });
        }
        
      } catch (error) {
        results.push({
          port: server.port,
          status: 'failing'
        });
      }
    }
  res.json(results); 
});

module.exports = router;  