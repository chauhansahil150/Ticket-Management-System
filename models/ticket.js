const { Schema, model} = require('mongoose');
const ticketSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    issueType: {
        type: String,
        required:true,
    },
    priority: {
        type: String,
    },
    description: {
        type: String,
        required:true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref:"user",
    },
    resolverId: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type:String,
    },
    status: {
        type: String,
        default:"pending"
    },
    chat:{
    has_unread_messages:{
        type:Boolean,
        default:0,
    },
    unread_messages_length:{
        type:Number,
        default:0
    },
    sender_id:{
        type: Schema.Types.ObjectId,
        ref:"user",
        default:null,
    },
    opened_by:{
        type: Schema.Types.ObjectId,
        ref:"user",
        default:null,
    }
}
}, { timestamps: true })

const Ticket = model("ticket", ticketSchema);

module.exports = Ticket;
