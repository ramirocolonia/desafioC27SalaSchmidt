import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";

const chatsRouter = Router();
const {
  sendMsg
} = new ChatController();

chatsRouter.post("/api/chat", sendMsg);

export default chatsRouter;