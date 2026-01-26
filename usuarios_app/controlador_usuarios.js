import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuariosModell } from "./modelo_usuarios.js";
import "dotenv/config";
//import crypto from "node:crypto"; 

export class UsuariosController {

    static async obtenerUsuarios(req, res) {
        const usuarios_en_db = await UsuariosModell.obtenerUsuarios();
        res.json(usuarios_en_db);
    }

    static async obtenerUsuarioPorNombre (req, res) {
        const nombre_usuario = req.params.nombre_usuario;
        const datos_usuario = await UsuariosModell.obtenerUsuarioPorUsername(nombre_usuario); 
        res.json(datos_usuario); 
    }
    static async obtenerIdUsuarioPorNombre(req, res) {
        const nombre_usuario = req.params.nombre_usuario;
        const id_usuario = await UsuariosModell.obtenerIdUsuario(nombre_usuario);
        //console.log("desde controlador: ", id_usuario); 
        res.json({ id_user_by_nombre: id_usuario }); 
    }
    /* nombres de roles de tabla: roles_de_usuarios: 
      user_blog, admin_blog, user_frases, admin_frases. 
      tabla intermedia usuarios_roles: 
      usuario_id, rol_id */

   
    static async registrarUsuario(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const rolUsuario = req.body.rol_usuario;

        // obtenemos lod datos de usuarios de la base de datos 
        const datosDeUsuario = await UsuariosModell.obtenerUsuarioPorUsername(username);
        // verificamos si el username ingresado existe en la base de datos
       
        if (datosDeUsuario.length > 0) {
            res.json({ mensaje: "El nombre de ussuario ingresado ya existe en la base de datos" });
        } else {
            // Encriptar la contraseña 
            const salt = await bcrypt.genSalt(10)
            const password_hash = await bcrypt.hash(password, salt);
            // creamos un objeto con los datos para enviar al modelo:
            //const id_crypto = crypto.randomUUID(); 
            const datos_registro_con_hash = { username: username, password: password_hash };
            const [ datos_registro_usuario ] = await UsuariosModell.registrarUsuario(datos_registro_con_hash);

            console.log("id de registro: ", datos_registro_usuario); 

            const id_usuario_uuid = await UsuariosModell.obtenerIdUsuario(username);   

            // obtenemos el id del rol de usuario ingresado: 
            const id_rol = await UsuariosModell.obtenerIdRolPorNombre(rolUsuario); 

            //console.log("id rol obtenido: ", id_rol); 

            // guardamos los id de usuario y rol en tabla intermedia
            const datosRegistroUsuarioRol = await UsuariosModell.guardarUsuarioRol(id_usuario_uuid, id_rol); 

            res.status(201).json(datos_registro_usuario);
        }

    }

    static async loginUsuario(req, res) {
        const username = req.body.username;
        const password = req.body.password;        
         // obtenemos los datos de la base de datos para el nombre de usuario ingresado 
        const datosUsuario = await UsuariosModell.obtenerUsuarioPorUsername(username);

        //console.log("datos de usuario login: ", datosUsuario); 

        
        // verificamos si el nombre de usuario ingresado existe en la base de datos
        if (datosUsuario.length === 0) {
            const datos_respuesta = { 
                mensaje: "El nombre ingresado no existe en la base de datos", 
                accion: "verificar_username"
            };
            return res.json(datos_respuesta);
        }
        // verificamos si el nombre ingresado es correcto
        /*
        if (datosUsuario[0].username !== username) {
            const datos_respuesta = { 
                mensaje: "El nombre ingresado es incorrecto", 
                accion: "verificar_username"
            };
            return res.json(datos_respuesta); 
        } */

        // verificamos la contraseña
        const elPasswordEsValido = await bcrypt.compare(password, datosUsuario[0].password); 
        if (elPasswordEsValido === false) {
            const datos_respuesta = { 
                mensaje: "La contraseña ingresada es incorrecta", 
                accion: "verificar_password"
            };
            return res.json(datos_respuesta); 
        }
        // Generamos el token 
        const token = jwt.sign(
            { id: datosUsuario[0].id_user, username: datosUsuario[0].username }, 
            process.env.SECRET_KEY_JWT, 
            { expiresIn: "3h" }
        );
        // construimos un objeto con los datos para enviar en la respuesta
        const datos_token = { 
            id: datosUsuario[0].id_usuario, 
            username: datosUsuario[0].username,
            rol: datosUsuario[0].nombre_rol, 
            token: token
        };

        //console.log("datos token: ", datos_token); 

        res.json(datos_token); 

    }

}