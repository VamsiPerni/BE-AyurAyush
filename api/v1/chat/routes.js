const express = require("express");
const {
  validateLoggedInUserMiddleware,
  validatePatientRole,
} = require("../middlewares");
const {
  startConversationController,
  sendMessageController,
  endConversationController,
  getConversationController,
  getPatientConversationsController,
} = require("./controllers");

const chatRouter = express.Router();

// Start a new conversation
chatRouter.post(
  "/start",
  validateLoggedInUserMiddleware,
  validatePatientRole,
  startConversationController,
);

// Send message and get AI response
chatRouter.post(
  "/message",
  validateLoggedInUserMiddleware,
  validatePatientRole,
  sendMessageController,
);

// End conversation and generate summary
chatRouter.post(
  "/end",
  validateLoggedInUserMiddleware,
  validatePatientRole,
  endConversationController,
);

// Get all patient conversations
chatRouter.get(
  "/",
  validateLoggedInUserMiddleware,
  validatePatientRole,
  getPatientConversationsController,
);

// Get specific conversation history
chatRouter.get(
  "/:conversationId",
  validateLoggedInUserMiddleware,
  validatePatientRole,
  getConversationController,
);

module.exports = { chatRouter };
