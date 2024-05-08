var express = require('express')
const mongoose = require('mongoose');

var app = express()

app.get('/', function (req, res) {
  // Conexão com o MongoDB
  mongoose.connect('mongodb://payment-ms-mongo:27017/totem-mongo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    res.end('Conectado ao MongoDB');
  }).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  })
  
     
})
app.listen(3000, function () {
  console.log('app listening on port 3000!')
})