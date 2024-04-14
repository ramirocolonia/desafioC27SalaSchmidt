import { messageModel } from "./models/message.model.js";

class ChatMongo{
  
  async createMsg(msg){
    const result = await messageModel.create(msg);
    return result;
  }

}
export default ChatMongo;