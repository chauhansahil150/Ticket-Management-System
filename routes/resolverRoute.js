const express = require('express');
const resolverRoute = express();
const auth = require('../services/auth');
const {
    loadAllTickets,
    openedTickets,
    closedTickets,
    resolveTicket,
    closeTicket,
    loadChatPage
} = require("../controllers/resolverControllers")

resolverRoute.get("/tickets",  loadAllTickets);
resolverRoute.get('/tickets/opened',  openedTickets)
resolverRoute.get('/tickets/closed',  closedTickets)
resolverRoute.put('/ticket/resolve/:_id',  resolveTicket);
resolverRoute.put('/ticket/close/:_id',  closeTicket);



module.exports = resolverRoute;