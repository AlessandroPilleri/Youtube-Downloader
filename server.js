const express = require('express');
const app = express();

app.use(express.static('public'));
app.listen(8080);

app.get('/background', function (req, res) {
  
})
