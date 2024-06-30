import connectDatabase from './config/cloud/database.mjs';
import bodyParser from 'body-parser';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import configRoute from './router/index.mjs';
import handleException from './middleware/handleException.mjs';
import handleStandardizedQuery from './middleware/handleStandardizedQuery.mjs';
import passport from './middleware/passport.mjs';
import session from 'express-session';
import {createServer} from 'http';
import configSocketIo from './socketio/index.mjs';
import handleCron from './cron/index.mjs';

dotenv.config();

// Connect to mongodb
connectDatabase().then();

const app = express();
app.use(express.static('dist'));
const server = createServer(app);
const port = process.env.PORT || 3000;

// Cors for accept request from a frontend url
// const corsOptions = {
//   exposedHeaders: 'Authorization',
//   origin: [process.env.FRONTEND_URL, 'http://127.0.0.1:5173', 'http://localhost:5173'],
//   default: process.env.FRONTEND_URL,
//   methods: 'GET, POST, PUT, DELETE, OPTIONS',
//   credentials: true,
// };
app.use(
  session({
    secret: 'keysecretexample',
    resave: false,
    saveUninitialized: true,
  }),
);
// app.use(cors(corsOptions));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session({}));

// Looger request from user
app.use(morgan('dev'));

// Accept and build file upload
app.use(fileUpload({useTempFiles: true}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Middleware convert string query “true” | “false” to boolean
handleStandardizedQuery(app);

// Use router
configRoute(app);

// Middleware Handle exceptions
handleException(app);

// Use socket io for chat
configSocketIo(server);

// Middleware for cron
handleCron();

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
