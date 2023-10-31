import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import path from "path";
import morgan from "morgan";
import exphbs from "express-handlebars";
import session from "express-session";
import validator from "express-validator";
import passport from "passport";
import flash from "connect-flash";
import MySQLStore from "express-mysql-session";
import bodyParser from "body-parser";
import { database } from "./keys";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

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

app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/producto', require('./routes/producto'));

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
server.listen(PORT, () => {
  console.log('Server is on port', PORT);
});

