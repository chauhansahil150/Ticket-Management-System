const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket'
    },
    message: {
        type: String,
        required: true
    },
    seen:{
        type:Boolean,
        default:0,
    }

},
    {
        timestamps: true
    });
const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;