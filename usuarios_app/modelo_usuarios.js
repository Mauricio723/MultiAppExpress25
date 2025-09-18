import dbconnection from "../db_conexiones/db_conection.js";

export class UsuariosModell {

    static async obtenerUsuarios() {
        //const datos_usuarios = await dbconnection.query("SELECT BIN_TO_UUID(id), username, password FROM usuarios;");

        const string_query = "SELECT BIN_TO_UUID(usuarios.id) AS id_usuario, usuarios.username, usuarios.password , " 
                            + "roles_de_usuarios.* FROM usuarios "
                            + "INNER JOIN usuarios_roles ON usuarios.id = usuarios_roles.usuario_id "
                            + "INNER JOIN roles_de_usuarios ON roles_de_usuarios.id_rol = usuarios_roles.rol_id;"; 

        const [datos_usuarios] = await dbconnection.query(string_query); 

        return datos_usuarios;

    }
   
    static async obtenerUsuarioPorUsername(username) {
         const string_query = "SELECT BIN_TO_UUID(usuarios.id) AS id_usuario, usuarios.username, usuarios.password , " 
                            + "roles_de_usuarios.* FROM usuarios "
                            + "INNER JOIN usuarios_roles ON usuarios.id = usuarios_roles.usuario_id "
                            + "INNER JOIN roles_de_usuarios ON roles_de_usuarios.id_rol = usuarios_roles.rol_id " 
                            + "WHERE username = ?;"; 

        const [datos_usuario] = await dbconnection.query(string_query, [username]);

        return datos_usuario;
    }

    static async obtenerIdRolPorNombre(nombre_rol) {
        const string_query = "SELECT id_rol FROM roles_de_usuarios WHERE nombre_rol = ?;";
        const [id_rol_ingresado] = await dbconnection.query(string_query, [nombre_rol]);

        console.log("id rol obtenido: ", id_rol_ingresado);

        return id_rol_ingresado[0].id_rol;
    }
   
    static async registrarUsuario(datos_usuario) {
        const string_query = "INSERT INTO usuarios (id, username, password) VALUES (UUID_TO_BIN(UUID()), ?, ?);";
        const retorno_registro = await dbconnection.query(string_query,
            [datos_usuario.username, datos_usuario.password]);
        return retorno_registro;
    }

    static async obtenerIdUsuario(nombreUsuario) {
        const string_query = "SELECT BIN_TO_UUID(id) AS id_usuario FROM usuarios WHERE username = ?;"; 
        const [id_usuario] = await dbconnection.query(string_query, [nombreUsuario]);
        return id_usuario[0].id_usuario;
    }


    static async guardarUsuarioRol(id_usuario, id_rol) {
        const string_query = "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (UUID_TO_BIN(?), ?);";
        const datosRegistroUsuarioRol = await dbconnection.query(string_query, [id_usuario, id_rol]);

        return datosRegistroUsuarioRol;
    }

}
