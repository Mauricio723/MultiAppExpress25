import dbconnection from "../db_conexiones/db_conection.js";


export class BlogModel02 {

    static async obtenerPublicacionesBlog() {
        const [publicaciones_blog] = await dbconnection.query("SELECT * FROM blog_posteos;");
        return publicaciones_blog;
    }
    

    static async obtenerCategoriasBlog() {
        const [categorias_blog] = await dbconnection.query("SELECT * FROM blog_categorias;");
        //console.log("Desde modelo, categorias_blog: ", categorias_blog); 
        return categorias_blog;
    }


    static async obtenerCategoriasDePosteos() {

        const string_query = "SELECT c.id_categoria AS id_cat, "
            + "c.nombre_categoria AS categoria "
            + "FROM blog_posteos p "
            + "INNER JOIN blog_posteos_categorias pc ON p.id_post = pc.post_id "
            + "INNER JOIN blog_categorias c ON pc.categoria_id = c.id_categoria;";

        const string_query_02 = "SELECT DISTINCT id_categoria, nombre_categoria FROM blog_categorias "
            + "INNER JOIN blog_posteos_categorias ON blog_categorias.id_categoria = blog_posteos_categorias.categoria_id;";

        const [datosCategorias] = await dbconnection.query(string_query_02);

        return datosCategorias;
    }


    static async obtenerCategoriaPostSeleccionado(id_post) {
        const string_query = "SELECT c.id_categoria AS id_cat, "
            + "c.nombre_categoria AS categoria "
            + "FROM blog_posteos p "
            + "INNER JOIN blog_posteos_categorias pc ON p.id_post = pc.post_id "
            + "INNER JOIN blog_categorias c ON pc.categoria_id = c.id_categoria "
            + "WHERE p.id_post = ?;";

        const [categorias_post_seleccionado] = await dbconnection.query(string_query, [id_post]);

        return categorias_post_seleccionado;
    }


    static async obtenerPostPorId_post(id_post) {

        const string_query = "SELECT p.id_post, p.titulo, p.contenido_01, p.imagen_url, p.fecha_publicacion, "
            + "BIN_TO_UUID(p.usuario_id) AS id_autor, u.username FROM blog_posteos p, usuarios u "
            + "WHERE p.id_post = ? AND p.usuario_id = u.id;";

        const [datosPost] = await dbconnection.query(string_query, [id_post]);

        return datosPost;
    }


    static async obtenerPosteosPorIdCategoria(id_categoria) {

        const string_query = "SELECT p.id_post, p.titulo, p.fecha_publicacion, "
            + "c.nombre_categoria AS categoria "
            + "FROM blog_posteos p "
            + "INNER JOIN blog_posteos_categorias pc ON p.id_post = pc.post_id "
            + "INNER JOIN blog_categorias c ON pc.categoria_id = c.id_categoria "
            + "WHERE id_categoria = ?;";

        const [datosPost] = await dbconnection.query(string_query, [id_categoria]);

        return datosPost;
    }


    static async obtenerPosteosPorUsuario(id_usuario) {
        const string_query = "SELECT p.id_post, titulo, BIN_TO_UUID(p.usuario_id) AS id_user, p.fecha_publicacion "
            + "FROM blog_posteos p WHERE BIN_TO_UUID(usuario_id) = ?;";

        const [datosPosteos] = await dbconnection.query(string_query, [id_usuario]);

        return datosPosteos;
    }


    static async obtenerUrlImagenPost(id_post) {

        console.log("id_post en obtenerUrlImagenPost: ", id_post);

        let string_query = "SELECT imagen_url FROM blog_posteos WHERE id_post = ?;";
        const [imagen_url] = await dbconnection.query(string_query, [id_post]);

        return imagen_url;
    }


    static async agregarCategoriaBlog(categoria_nueva) {
        const string_query = "INSERT INTO blog_categorias (nombre_categoria) VALUES (?);";
        const [datos_nueva_categoria] = await dbconnection.query(string_query, [categoria_nueva]);

        return datos_nueva_categoria;
    }

    static async agregarIdsPostCategoria(id_post, lista_id_categoria) {

        let string_values = "";

        lista_id_categoria.forEach((id_categoria, indice) => {
            if (indice === 0) {
                string_values += "(" + id_post + ", " + id_categoria + ")";
            } else {
                string_values += ", (" + id_post + ", " + id_categoria + ")";
            }
        });

        const string_query = "INSERT INTO blog_posteos_categorias (post_id, categoria_id) VALUES " + string_values + ";";

        const [datos_ingreso_post_categoria] = await dbconnection.query(string_query);

        return datos_ingreso_post_categoria;

    }

    static async agregarNuevoPost(datos_post_nuevo) {

        const fechaActual = new Date();
        const stringFechaFormateada = fechaActual.toLocaleString("es-AR");

        //const id_usuario_bin = UUID_TO_BIN(datos_post_nuevo.id_usuario); 

        console.log("dentro de modelo, valor de imagen_url: ", datos_post_nuevo.url_imagen)
        const string_query = "INSERT INTO blog_posteos (titulo, contenido_01, imagen_url, usuario_id,"
            + " fecha_publicacion) VALUES (?, ?, ?, UUID_TO_BIN(?), ?);"

        const [datos_post_agregado] = await dbconnection.query(string_query,
            [datos_post_nuevo.titulo, datos_post_nuevo.contenido, datos_post_nuevo.url_imagen,
            datos_post_nuevo.id_usuario, stringFechaFormateada]);

        return datos_post_agregado;

    }


    static async actualizarPost(id_post, datos_actualizados) {

        const campo_update_post = Object.keys(datos_actualizados);

        const valor_campo_update = datos_actualizados[campo_update_post];

        const id_post_int = parseInt(id_post);
      
        let string_query = "UPDATE blog_posteos SET " + campo_update_post + " = ? WHERE id_post = ?;";

        const returnUpdatePost = await dbconnection.query(string_query, [valor_campo_update, id_post_int]);


        return "Se actualizó el campo: " + campo_update_post + " satisfactoriamente.";

    }


    // Sección para registro y login de usuarios

    static async registrarUsuarioBlog(datosUsuario) {
        //console.log("Datos Usuario: ", datosUsuario); 

        console.log("Nombre usuario: ", datosUsuario.username);
        console.log("Contraseña: ", datosUsuario.password_user);

        const stringQueryRegistro = "INSERT INTO usuarios (username, password) VALUES (?, ?);";

        const retorno_insert_usuario = await dbconnection.query(
            stringQueryRegistro,
            [datosUsuario.username, datosUsuario.password_user]
        );

        return retorno_insert_usuario;
    }

    static async obtenerUsuariosBlog() {
        const [datos_usuarios_blog] = await dbconnection.query("SELECT BIN_TO_UUID(id) AS id_usuario, username, password FROM usuarios;");

        return datos_usuarios_blog;
    }

    static async obtenerUsuarioByUsername(username) {
        const datosUsuarioByName = await dbconnection.query("SELECT * FROM usuarios WHERE username= ?;",
            [username]);

        return datosUsuarioByName;
    }

}

