const Chat = require('../models/chat');
const Ticket= require('../models/ticket');
const saveChat = async (req, res) => {
    try {
        const chat = new Chat({
            message: req.body.message,
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            ticket_id: req.body.ticket_id,
        });
        const newChat = await chat.save();
        const length = (await Chat.find({ ticket_id: req.body.ticket_id, sender_id: req.body.sender_id, seen: 0 })).length;
        console.log(length);
        if (length > 0) {
            await Ticket.findByIdAndUpdate({ _id: req.body.ticket_id }, { chat: { has_unread_messages: 1, unread_messages_length: length, sender_id:req.body.sender_id } });
        }
        res.status(200).send({
            success: true,
            msg: "chat saved",
            data: newChat,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        });
    }
};

const loadChatPage = async (req, res) => {
    try {
        const data = req.params._id;
        dataArr=data.split('-');
        console.log(dataArr);
        const [receiverId, ticketId,openedBy]=dataArr
        const senderId = req.session.user._id;
       
        // const receiverId=ticketData.createdBy;
        const ticketData=await Ticket.findOne({_id:ticketId});
        // console.log('%cresolverControllers.js line:47 senderId,"---", receiverId', 'color: #007acc;', senderId,"---", receiverId);
        if(openedBy!=ticketData.chat.sender_id){
            await Ticket.findByIdAndUpdate({_id:ticketId}, {chat:{has_unread_messages:0,unread_messages_length:0 }});
            await Chat.updateMany({ticket_id:ticketId, $or:[{sender_id:ticketData.resolverId}, {sender_id:ticketData.createdBy}]}, {seen:1})

        }
        res.render("./ticketChatPage", {
            senderId,
            receiverId,
            ticketData
        });
        
        // return;
    } catch (error) {
        console.log('%cresolverControllers.js line:47 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
   
}
// const updateSeenStatus= async (req, res)=>{
//     Chat.updateMany({tic})
// }




module.exports = {
    saveChat,
    loadChatPage
  
}