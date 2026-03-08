const { v4: uuidv4 } = require("uuid");
const { ChatHistoryModel } = require("../../../models/chatHistorySchema");
const {
  checkForEmergency,
  getAIChatResponse,
  generateConversationSummary,
} = require("../../../utils/aiService");

// Start a new chat conversation
const startConversationController = async (req, res) => {
  try {
    console.log("-----🟢 inside startConversationController-------");

    const { userId } = req.currentPatient;

    const conversationId = uuidv4();

    const chatHistory = await ChatHistoryModel.create({
      conversationId,
      patientId: userId,
      messages: [],
      status: "active",
    });

    res.status(201).json({
      isSuccess: true,
      message: "Conversation started",
      data: {
        conversationId: chatHistory.conversationId,
        greeting:
          "Hello! I'm your medical assistant. Please describe what symptoms or health concerns you're experiencing, and I'll help you prepare for your doctor appointment.",
      },
    });
  } catch (err) {
    console.error("-----🔴 Error in startConversationController--------");
    console.error(err);

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// Send a message and get AI response
const sendMessageController = async (req, res) => {
  try {
    console.log("-----🟢 inside sendMessageController-------");

    const { userId } = req.currentPatient;
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        isSuccess: false,
        message: "conversationId and message are required",
      });
    }

    const chatHistory = await ChatHistoryModel.findOne({
      conversationId,
      patientId: userId,
    });

    if (!chatHistory) {
      return res.status(404).json({
        isSuccess: false,
        message: "Conversation not found",
      });
    }

    if (chatHistory.status === "completed") {
      return res.status(400).json({
        isSuccess: false,
        message:
          "This conversation is already completed. Please start a new conversation.",
      });
    }

    // Check for emergency keywords
    const isEmergency = checkForEmergency(message);

    // Add user message
    await chatHistory.addMessage("user", message, isEmergency);

    if (isEmergency && chatHistory.status !== "emergency") {
      chatHistory.markAsEmergency();
      await chatHistory.save();
    }

    // Build messages array for AI
    const messagesForAI = chatHistory.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await getAIChatResponse(messagesForAI, isEmergency);

    // Add AI response to chat history
    await chatHistory.addMessage("assistant", aiResponse, isEmergency);

    res.status(200).json({
      isSuccess: true,
      message: "Message sent",
      data: {
        conversationId,
        userMessage: message,
        aiResponse,
        isEmergency,
        status: chatHistory.status,
        messageCount: chatHistory.messages.length,
      },
    });
  } catch (err) {
    console.error("-----🔴 Error in sendMessageController--------");
    console.error(err);

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// End conversation and generate summary
const endConversationController = async (req, res) => {
  try {
    console.log("-----🟢 inside endConversationController-------");

    const { userId } = req.currentPatient;
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        isSuccess: false,
        message: "conversationId is required",
      });
    }

    const chatHistory = await ChatHistoryModel.findOne({
      conversationId,
      patientId: userId,
    });

    if (!chatHistory) {
      return res.status(404).json({
        isSuccess: false,
        message: "Conversation not found",
      });
    }

    if (chatHistory.status === "completed") {
      return res.status(400).json({
        isSuccess: false,
        message: "Conversation already completed",
        data: { summary: chatHistory.summary },
      });
    }

    if (chatHistory.messages.length < 2) {
      return res.status(400).json({
        isSuccess: false,
        message:
          "Please have at least one exchange with the assistant before ending the conversation.",
      });
    }

    // Generate summary using Gemini
    const messagesForSummary = chatHistory.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const summary = await generateConversationSummary(messagesForSummary);

    // If emergency was detected during chat, override urgency level
    if (chatHistory.status === "emergency") {
      summary.urgencyLevel = "emergency";
    }

    // Complete the conversation with summary
    await chatHistory.completeSummary(summary);

    res.status(200).json({
      isSuccess: true,
      message: "Conversation completed and summary generated",
      data: {
        conversationId,
        summary,
        status: "completed",
      },
    });
  } catch (err) {
    console.error("-----🔴 Error in endConversationController--------");
    console.error(err);

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// Get conversation history
const getConversationController = async (req, res) => {
  try {
    console.log("-----🟢 inside getConversationController-------");

    const { userId } = req.currentPatient;
    const { conversationId } = req.params;

    const chatHistory = await ChatHistoryModel.findOne({
      conversationId,
      patientId: userId,
    });

    if (!chatHistory) {
      return res.status(404).json({
        isSuccess: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Conversation retrieved",
      data: {
        conversationId: chatHistory.conversationId,
        status: chatHistory.status,
        messages: chatHistory.messages,
        summary: chatHistory.summary,
        createdAt: chatHistory.createdAt,
      },
    });
  } catch (err) {
    console.error("-----🔴 Error in getConversationController--------");
    console.error(err);

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// Get all conversations for a patient
const getPatientConversationsController = async (req, res) => {
  try {
    console.log("-----🟢 inside getPatientConversationsController-------");

    const { userId } = req.currentPatient;

    const conversations = await ChatHistoryModel.find({
      patientId: userId,
    })
      .select(
        "conversationId status summary.symptoms summary.urgencyLevel createdAt appointmentId",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      isSuccess: true,
      message: "Conversations retrieved",
      data: {
        count: conversations.length,
        conversations,
      },
    });
  } catch (err) {
    console.error("-----🔴 Error in getPatientConversationsController--------");
    console.error(err);

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  startConversationController,
  sendMessageController,
  endConversationController,
  getConversationController,
  getPatientConversationsController,
};
