console.clear();

const Http = require('http');
const Path = require('path');
const Express = require('express');
const BodyParser = require('body-parser');
const Morgan = require('morgan');
const Mongoose = require('mongoose');
const CORS = require('cors');
const routers = require('./routers');
const { customizeIo } = require('./services/socket');
const { MONGO_URI } = require('../configs.server');
const PORT = process.env.PORT || 9000;

Mongoose.connect(MONGO_URI, (err) => {
  if (err) {
    return console.error('Error connecting to Mongo:', err);
  };

  console.log('Mongo connected');
});

const app = Express();
const server = Http.createServer(app);
const io = require('socket.io')(server);

app.use(BodyParser.json({ type: '*/*' }));
app.use(Morgan('dev'));
app.use(CORS());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(Express.static(Path.join(__dirname, '../build')));


customizeIo(io);
routers(app, io);
app.get('*', (req, res) => {
  res.sendFile(Path.join(__dirname, '../build/index.html'));
});


server.listen(PORT, () => console.log(`Server serving on port ${PORT}`));
