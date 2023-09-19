const Ticket = require("../models/ticket");
const Chat=require("../models/chat");
const loadAllTickets = async (req, res) => {
    const allTickets = await Ticket.find({ issueType: req.session.user.dept }).sort({createdAt:-1});
    res.render("./resolver/resolverHome", {
        allTickets,
        user: req.session.user,
    });
    return;
}
const resolveTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate({ _id: req.params._id, resolverId: req.session.user._id }, { status: "opened", resolverId: req.session.user._id });
        res.status(200).json(ticket);
        return;
    } catch (error) {
        console.log('%cuserController.js line:60 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
const openedTickets = async (req, res) => {
    const allOpenedTickets = await Ticket.find({ issueType: req.session.user.dept, resolverId:req.session.user._id , status: "opened" });
    // console.log('%cadminController.js line:47 allTickets', 'color: #007acc;', allTickets);
    res.render("./resolver/openedTickets", {
        allOpenedTickets,
        user: req.session.user,
    });
    return;
}
const closeTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate({ _id: req.params._id, resolverId: req.session.user._id }, { status: "closed" });
        await Chat.deleteMany({ticket_id:ticket._id});
        res.status(200).json(ticket);
        return;
    } catch (error) {
        console.log('%cuserController.js line:60 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
const closedTickets = async (req, res) => {
    const allClosedTickets = await Ticket.find({ issueType: req.session.user.dept, resolverId:req.session.user._id, status: "closed" });
    // console.log('%cadminController.js line:47 allTickets', 'color: #007acc;', allTickets);
    res.render("./resolver/closedTickets", {
        allClosedTickets,
        user: req.session.user,
    });
    return;
}


module.exports = {
    loadAllTickets,
    resolveTicket,
    openedTickets,
    closeTicket,
    closedTickets,
    
}