import ChatMongo from "../dao/chat.mongo.js";

class ChatController{
  constructor(){
    this.chatService = new ChatMongo();
  }

  sendMsg = async (req, res)=>{
    try{
      const { user, message } = req.body;
      const newMsg = {
        user,
        message
      }
      if (Object.values(newMsg).every((value) => String(value).trim() !== "" && value !== undefined)){
        if (await this.chatService.createMsg(newMsg)) {
          res.send({ status: "success", payload: newMsg });
        } else {
          res.send({ status: "error", message: "Error al enviar mensaje" });
        }
      } else {
        res.send({ status: "error", message: "Faltan campos obligatorios" });
      }
    } catch (error) {
      res.send({status: "error", message: "Error en ejecución, " + error});    
    }
  }
  
}
export default ChatController;