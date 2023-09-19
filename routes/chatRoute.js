const express = require("express");
const chatRoute = express();
const {
    saveChat,
    loadChatPage,
    // updateSeenStatus
   
} = require('../controllers/chatControllers');

chatRoute.get('/ticket/chatPage/:_id', loadChatPage);
chatRoute.post("/save-chat", saveChat);
// chatRoute.put('seen-status', updateSeenStatus)
// chatRoute.post("/delete-chat", deleteChat);
// chatRoute.post("/edit-chat", updateChat);

module.exports = chatRoute;