const express = require('express')

require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8080;
const cookieParser = require("cookie-parser");

const { Server } = require('socket.io');
const { createServer } = require('node:http');


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
  }
});


const AuthRoutes = require('./routes/AuthRoutes')
const AdminRoutes = require('./routes/AdminRoutes')
const ScrapperRoutes = require('./routes/ScrapperRoutes')(io)
const PackageRoutes = require('./routes/PackageRoutes')
const OrderRoutes = require('./routes/OrderRoutes')
const log = require('./utils/logger/index')





mongoose.connect('mongodb://127.0.0.1:27017/default');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  log.print('connected', 20);
})

app.use(cors({
  origin: ["http://localhost:5500" , "http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH"],
  credentials: true,
}))
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/scrapper/search/', ScrapperRoutes)
app.use('/api/user', AuthRoutes)
app.use('/api/admin', AdminRoutes)
app.use('/api/package', PackageRoutes)
app.use('/api/order', OrderRoutes)



io.on('connection', (socket) => {
  console.log('a user connected' , socket.id);
});



server.listen(PORT, () => { log.print(`Listening on PORT http://localhost:${PORT}`, 24) })

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});


module.exports = { io }

// const AdminModel = require('./model/Admin');


// AdminModel.create({
//     firstName : 'Admin',
//     email : 'admin@gmail.com',
//     password : 'admin@123'
// })
// .then(res => console.log(res))
// .catch(err => console.log(err))