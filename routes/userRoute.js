const express = require("express");
const userRoute = express();
const {
    loadDashboard,
    logout,
    loadTicketForm,
    loadAllUserTickets,
    generateUserTicket,
    ChangeStatusToCancelTicket,
    loadCancelledTicket,
    deleteUserTicket

} = require('../controllers/userController');




userRoute.get('/', loadDashboard);
userRoute.get("/logout", logout)
userRoute.route("/user/ticket/create-new")
    .get( loadTicketForm)
    .post( generateUserTicket);

userRoute.get('/user/ticket/all-tickets',  loadAllUserTickets)
userRoute.put("/user/ticket/cancel/:_id",  ChangeStatusToCancelTicket)
userRoute.get("/user/ticket/cancelled",  loadCancelledTicket)
userRoute.delete("/user/ticket/delete/:_id",  deleteUserTicket);

    

module.exports = userRoute;