const express = require('express');
const adminRoute = express();
const { 
    loadAddResolver,
    register,
    loadAllTickets,
    resolveTicket,
    openedTickets,
    closeTicket,
    closedTickets,
    // loadTicketsDeptWise,
    filterby,
    // sortby,
    getNotifications
} = require('../controllers/adminController');

adminRoute.get('/register',  loadAddResolver)
    .post('/register',  register);
adminRoute.get('/tickets',  loadAllTickets);
adminRoute.get('/tickets/opened',  openedTickets)
adminRoute.get('/tickets/closed',  closedTickets)
// adminRoute.get('/tickets/:value', loadTicketsDeptWise)
adminRoute.get("/tickets/filterby/:filter",filterby)
// adminRoute.get("/tickets/sortby/:sorting",sortby)
adminRoute.put('/ticket/resolve/:_id',  resolveTicket);
adminRoute.put('/ticket/close/:_id', closeTicket);
adminRoute.get("/loadnotifications", getNotifications)




module.exports = adminRoute;