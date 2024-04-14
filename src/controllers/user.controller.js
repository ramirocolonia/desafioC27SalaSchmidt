import jwt from "jsonwebtoken";

import UserMongo from "../dao/user.mongo.js";
import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js";

class UserController{

  constructor(){
    this.userService = new UserMongo();
  }

  registerUser = async (req, res)=>{
    try{
      const { first_name, last_name, email, age, password } = req.body;
      if(! await this.userService.existEmail(email)){
        let newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password)
        }
        if(Object.values(newUser).every((value) => String(value).trim() !== "" && value !== undefined)){
          const result = await this.userService.createUser(newUser);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            res.send({ status: "error", message: "Error al registrar usuario" });
          }
        }else{
          res.send({ status: "error", message: "Faltan campos obligatorios" });
        }
      }else{
        res.send({ status: "error", message: "El correo electrónico ingresado ya se encuentra registrado" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  }

  login = async (req, res)=>{
    const { email, password } = req.body;
    let user;
    if(email === config.admin && password === config.passAdmin){
      user = {
        first_name: "",
        last_name: "Administrador",
        email: email,
        age: 0,
        rol: "admin"
      };
      res.send({status:"success", payload: user});
    }else{
      user = await this.userService.findOneUser(email);
      if(user){
        if(isValidPassword(user, password)){
          const token = jwt.sign({
            first_name: user.first_name, 
            last_name: user.last_name, 
            age: user.age, 
            email: user.email, 
            rol: user.rol}, 
            config.tokenPass, 
            {expiresIn: "24h"});
          res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
          res.send({status:"success", payload: user, token: token});
        }else{
          res.send({ status: "error", message: "Contraseña incorrecta" });  
        }
      }else{
        res.send({ status: "error", message: "Usuario no registrado" });
      }
    }
  }
}
export default UserController;