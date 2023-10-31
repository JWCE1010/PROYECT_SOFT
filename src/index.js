const express = require('express');
const http = require('http');
const SocketServer = require('socket.io');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const { database } = require('./keys');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const server = http.createServer(app);
const io = SocketServer(server);

io.on("connection", socket => {
    console.log(socket.id);

    socket.on("message", (body) => {
        socket.broadcast.emit("message", {
            body,
            from: socket.id.slice(4)
        });
    });
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});

passport.use('local.signup', new LocalStrategy({
    // Configuración de la estrategia
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // Si necesitas acceder a la solicitud en la estrategia
}, (req, email, password, done) => {
    // Implementa la lógica de autenticación aquí
}));
app.post('/signin', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

app.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Rutas de Express
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/producto', require('./routes/producto'));

// Ruta pública
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server is on port', PORT);
});

