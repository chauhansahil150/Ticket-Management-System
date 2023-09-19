require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./services/auth');
const Ticket = require('./models/ticket');
// const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);
const PORT = process.env.PORT || 3000
// const User = require('./models/user');
const Chat = require('./models/chat');
//routes
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const resolverRoute = require('./routes/resolverRoute');
const chatRoute = require('./routes/chatRoute');

const userController = require('./controllers/userController');

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("mongo connected"));

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}))

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
app.set("view engine", "ejs");
app.set("views", "./views");

// app.get("/a/l/n",async (req,res)=>{
//     console.log(req.path,req.method);
//     console.log("notification requested");
//     const allTickets= await Ticket.find({resolverId:req.session.user._id,status:"opened"});
//     console.log(allTickets);
//     allTickets.forEach(ticket=>console.log(ticket))
//     res.end("hello")
// })

app.route("/register")
    .get(userController.loadRegister)
    .post(userController.register);
app.route("/login")
    .get(userController.loadLogin)
    .post(userController.login);

//routes
app.use('/resolver',auth.isLogin,resolverRoute);
app.use('/admin',auth.isLogin,  adminRoute);
app.use('/chat', auth.isLogin, chatRoute);
app.use('/', auth.isLogin,userRoute);
app.get("*", (req, res) => {
    res.redirect("/");
});

// io.on('connection', (socket) => {
//     console.log("connected to user")
// })
// chatSocket.setUpChatSocket(server);
const unsp = io.of('/user-namespace');
unsp.on('connection', async  function (socket) {
    console.log('user connected');
    const senderId = socket.handshake.auth.sender_id;
    const receiverId=socket.handshake.auth.receiver_id;
    ticketId=socket.handshake.auth.ticket_id;


    
    // io.to(socket.id).emit('ticketUpdated', { has_unread_messages: 1, unread_messages_length: length, ticket_id:ticketId });
    socket.on('disconnect',  function () {
        console.log('user disconnected');
       
        const userId = socket.handshake.auth.userId;
       

    });
    // chatting implementation
    socket.on('newChat', async function (data) {
        socket.broadcast.emit('loadNewChat', data);
    })

    //load old chats
    socket.on('exitsChat', async function (data) {
        const chats = await Chat.find({
            $and:[
                { $or: [
                    { sender_id: data.sender_id, receiver_id: data.receiver_id },
                    { sender_id: data.receiver_id, receiver_id: data.sender_id },
                ],},
                { ticket_id:data.ticket_id,}
            ]  
        })
        console.log('inside exitschat');
        // console.log(chats);
        socket.emit("loadChats", { chats: chats });
    });

   

});

server.listen(PORT, () => console.log("Server Started at port:" + PORT));