import { getFinalResponse } from "../services/getFinalResponse.js";
import prisma from "../config/dataBase.js";
import { v4 as uuidv4 } from "uuid";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

// #8 — Maximum messages to send as chat history (sliding window)
const MAX_CHAT_HISTORY = 10;

// handle user chat
export const userChat = async (req, res) => {
  const { question, threadId } = req.body;
  const userId = req.user.id;

  if (!question || question.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "question is required" });
  }

  try {
    let thread;
    let chatHistory = [];

    // check if thread exists and belongs to authenticated user/org
    if (threadId) {
      thread = await prisma.thread.findFirst({
        where: {
          id: threadId,
          userId,
          organizationId: req.user.organizationId || undefined,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!thread) {
        return res
          .status(404)
          .json({ success: false, message: "thread not found" });
      }

      // #8 — Only use the last N messages as chat history
      const recentMessages = thread.messages.slice(-MAX_CHAT_HISTORY);
      chatHistory = recentMessages
        .map((msg) => {
          if (msg.role === "USER") {
            return new HumanMessage(msg.content);
          }
          if (msg.role === "ASSISTANT") {
            return new AIMessage(msg.content);
          }
          return null;
        })
        .filter(Boolean);
    }

    if (!thread) {
      // create new thread
      thread = await prisma.thread.create({
        data: {
          id: uuidv4(),
          title: question.slice(0, 50),
          userId,
          organizationId: req.user.organizationId || undefined,
        },
      });
    }

    const userMessage = await prisma.message.create({
      data: {
        threadId: thread.id,
        content: question,
        role: "USER",
      },
    });

    // get response from groq => similarity search + websearch + final response
    const assistantResponse = await getFinalResponse(
      question,
      chatHistory,
      req.user.organizationId
    );

    const assistantMessage = await prisma.message.create({
      data: {
        threadId: thread.id,
        content: assistantResponse.content,
        role: "ASSISTANT",
      },
    });

    res.status(200).json({
      success: true,
      message: "Chat API is working",
      result: [userMessage, assistantMessage],
    });
  } catch (error) {
    console.error("chat error:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

// get all threads of a user
export const getUserThreads = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "user id is required" });
    }

    const threads = await prisma.thread.findMany({
      where: {
        userId,
        organizationId: req.user.organizationId || undefined,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({ success: true, threads });
  } catch (error) {
    console.error("chat error:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

// get messages of a thread
export const getThreadMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const { threadId } = req.params;

    if (!threadId) {
      return res
        .status(400)
        .json({ success: false, message: "thread id is required" });
    }

    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        userId,
        organizationId: req.user.organizationId || undefined,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!thread) {
      return res
        .status(404)
        .json({ success: false, message: "thread not found" });
    }

    res.status(200).json({ success: true, messages: thread.messages });
  } catch (error) {
    console.error("chat error:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

// delete a thread
export const deleteThread = async (req, res) => {
  try {
    const userId = req.user.id;
    const { threadId } = req.params;

    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        userId,
        organizationId: req.user.organizationId || undefined,
      },
    });

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    await prisma.thread.delete({
      where: { id: threadId },
    });

    res.json({ success: true, message: "Thread deleted successfully" });
  } catch (error) {
    console.error("delete thread error:", error);
    res.status(500).json({ success: false, message: "Failed to delete thread" });
  }
};
