const express = require('express');

const app = express();

app.get('/app', (req, res) => {
  res.send(`Server is running fine! Host: ${process.env.HOSTNAME}`);
});
app.get('/app/healthCheck', (req, res) => {
    res.send("This is health check for Port 3001");
});
  
app.listen(3001, () => {
  console.log('Backend server is listening to port 3001');
});