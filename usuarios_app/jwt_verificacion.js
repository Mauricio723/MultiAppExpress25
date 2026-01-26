import jwt from "jsonwebtoken";
import "dotenv/config";

//import { datosConfig01 } from "../datos_config/datosConfig.js";

export const verificar_token = (req, res, next) => {

    const authHeader = req.header("Authorization") || "";

    const token = authHeader.split(" ")[1];

    if (token === null) {
        return res.status(403).json({ message: "Acceso denegado, token requerido" });
    }

    jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decoded) => {  

              if (err) {
                  return res.status(401).send("Token invalido");
              }
              req.username = decoded.username;  
              next();
          });  

          /*

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
        req.username = payload.username;

        console.log("Dentro de verificación del token en try, username: ", req.username);

        next(); 

    } catch (error) {
        return res.status(403).json({ message: "Token no válido" });
    }  */


    /*
          jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decoded) => {  
              if (err) {
                  return res.status(401).send("Token invalido");
              }
              req.userId = decoded.id;  
              next();
          });               
      */

};

/*
function verifyToken(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, secretKey);
    req.username = payload.username;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}
*/
