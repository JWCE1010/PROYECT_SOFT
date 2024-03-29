const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'mysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/producto', require('./routes/producto'));
app.use('/proveedor', require('./routes/proveedor'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
const server = app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

//WebSockets
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4000/chat",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('new connection', socket.id);

  socket.on('chat:message', (data) => {
    io.sockets.emit('chat:message', data)
  });
  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data)
  })
});
