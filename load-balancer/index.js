const express = require('express'); 
const fs = require('fs');
const https = require('https');

const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

const proxyRouter = require('./routes/proxy.js');
const healthRouter = require('./routes/health.js');
const app = express();

app.use('/app', proxyRouter);
app.use('/', healthRouter);

https.createServer(options, app).listen(4000, () => {
  console.log('Load balancer is listening to port 4000');
});


