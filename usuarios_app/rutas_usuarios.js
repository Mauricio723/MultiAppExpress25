import { Router } from "express"; 
import { UsuariosController } from "./controlador_usuarios.js"; 

import multer from "multer";

import { verificar_token } from "./jwt_verificacion.js"; 

export const usuariosRouter = Router(); 

const upload = multer(); 

usuariosRouter.get("/mostrar_formulario_registro/:rol_usuario", (req, res) => {
    const rolUsuario = req.params.rol_usuario;
   
    res.render("templates_usuarios/formulario_registro.ejs", { 
        rol_usuario: rolUsuario
    });

}); 

usuariosRouter.get("/mostrar_formulario_login/:seccion_app", (req, res) => {
    const seccion_app = req.params.seccion_app;
    res.render("templates_usuarios/formulario_login.ejs", { seccion: seccion_app }); 
}); 

usuariosRouter.get("/obtener_usuarios", UsuariosController.obtenerUsuarios);

usuariosRouter.get("/obtener_usuario_por_nombre/:nombre_usuario", UsuariosController.obtenerUsuarioPorNombre); 

usuariosRouter.post("/registrar_usuario", upload.array(), UsuariosController.registrarUsuario); 

usuariosRouter.post("/login_usuario", upload.array(), UsuariosController.loginUsuario); 

