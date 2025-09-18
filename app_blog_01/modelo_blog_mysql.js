import dbconnection from "../db_conexiones/db_conection.js";

export class BlogModel {

    static async obtenerTitulosPosteos() {
        const string_query = "SELECT id_post, titulo, fecha_publicacion FROM blog_posteos;";
        const [datosPost] = await dbconnection.query(string_query);

        return datosPost;
    }

    /*
     const string_query = "SELECT p.id_post, p.titulo, p.contenido_01, p.imagen_url, p.fecha_publicacion, " 
        + "BIN_TO_UUID(p.usuario_id) AS id_autor, u.username FROM blog_posteos p, usuarios u "
        + "WHERE p.id_post = ? AND p.usuario_id = u.id;"; 
    */
    static async obtenerTitulosPosteosPorUsuario(id_usuario) {
        const string_query = "SELECT p.id_post, titulo, BIN_TO_UUID(p.usuario_id) AS id_user, p.fecha_publicacion "
            + "FROM blog_posteos p WHERE BIN_TO_UUID(usuario_id) = ?;";

        const [datosPosteos] = await dbconnection.query(string_query, [id_usuario]);

        return datosPosteos;
    }

    // id usuario para probar: 
    // e10014ca-5e0e-11f0-882e-94de80377a49
    // 8db53cee-5e0f-11f0-882e-94de80377a49

    static async obtenerNombresPosteosPorIdCategoria(id_categoria) {

        const string_query = "SELECT p.id_post, p.titulo, p.fecha_publicacion, "
            + "c.nombre_categoria AS categoria "
            + "FROM blog_posteos p "
            + "INNER JOIN blog_posteos_categorias pc ON p.id_post = pc.post_id "
            + "INNER JOIN blog_categorias c ON pc.categoria_id = c.id_categoria "
            + "WHERE id_categoria = ?;";

        const [datosPost] = await dbconnection.query(string_query, [id_categoria]);

        return datosPost;
    }
    

    static async obtenerPostPorId_post(id_post) {

        const string_query = "SELECT p.id_post, p.titulo, p.contenido_01, p.imagen_url, p.fecha_publicacion, "
            + "BIN_TO_UUID(p.usuario_id) AS id_autor, u.username FROM blog_posteos p, usuarios u "
            + "WHERE p.id_post = ? AND p.usuario_id = u.id;";
                 
        const [datosPost] = await dbconnection.query(string_query, [id_post]);

        return datosPost;
    }

    /*
    SELECT Campos FROM TABLA1
INNER JOIN TABLA2 ON TABLA1.CampoPK = TABLA2.CampoFK
    */
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

    static async agregarCategoriaBlog(categoria_nueva) {
        const string_query = "INSERT INTO blog_categorias (nombre_categoria) VALUES (?);";
        const [datos_nueva_categoria] = await dbconnection.query(string_query, [categoria_nueva]);

        return datos_nueva_categoria;
    }

    static async agregar_ids_post_categoria(id_post, lista_id_categoria) {

        let string_values = "";

        lista_id_categoria.forEach((id_categoria, indice) => {
            if (indice === 0) {
                string_values += "(" + id_post + ", " + id_categoria + ")";
            } else {
                string_values += ", (" + id_post + ", " + id_categoria + ")";
            }

        });

        // insert into blog_posteos_categorias (post_id, categoria_id) values (1, 3), (1, 7);

        const string_query = "INSERT INTO blog_posteos_categorias (post_id, categoria_id) VALUES " + string_values + ";";

        console.log("string_query: ", string_query);

        const [datos_ingreso_post_categoria] = await dbconnection.query(string_query);

        return datos_ingreso_post_categoria;

    }
    /* tabla intermedia blog_posteos_categorias;
    +--------------+------+------+-----+---------+-------+
| Field        | Type | Null | Key | Default | Extra |
+--------------+------+------+-----+---------+-------+
| post_id      | int  | NO   | PRI | NULL    |       |
| categoria_id | int  | NO   | PRI | NULL    |       |
+--------------+------+------+-----+---------+-------+
    */
    /* describe de tabla blog_posteos
    +-------------------+--------------+------+-----+-------------------+----------------+
| Field             | Type         | Null | Key | Default           | Extra          |
+-------------------+--------------+------+-----+-------------------+----------------+
| id_post           | int          | NO   | PRI | NULL              | auto_increment |
| titulo            | varchar(100) | NO   |     | NULL              |                |
| contenido_01      | varchar(500) | NO   |     | NULL              |                |
| imagen_url        | varchar(200) | YES  |     | sin_imagen        |                |
| usuario_id        | binary(16)   | NO   | MUL | NULL              |                |
| fecha_publicacion | varchar(120) | YES  |     | fecha_sin_definir |                |
+-------------------+--------------+------+-----+-------------------+----------------+
6 rows in set (0.02 sec)
    */

    static async agregarPostConImagen(datos_post, url_imagen) {

        const fechaActual = new Date();
        const stringFechaFormateada = fechaActual.toLocaleString("es-AR");

        const datos_post_agregado = await dbconnection.query(
            "INSERT INTO blog_posteos (titulo, contenido, imagen_url, autor, fecha_publicacion, categoria) VALUES (?, ?, ?, ?, ?, ?);",
            [datos_post.titulo, datos_post.contenido, url_imagen,
            datos_post.autor, stringFechaFormateada, datos_post.categoria]);

        return datos_post_agregado;

        // obtenemos autores para comprobar si existe.
        // si no existe el autor, guardamos el autor y obtenemos el id.
        // con el id del autor obtenidos, guardamos la frase y hacemos referencia al id del autor.

    }

    static async agregarPostNuevo(datos_post_nuevo) {

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

    static async registrarUsuarioBlog(datosUsuario) {
        //console.log("Datos Usuario: ", datosUsuario); 

        console.log("Nombre usuario: ", datosUsuario.username);
        console.log("Contraseña: ", datosUsuario.password_user);

        const stringQueryRegistro = "INSERT INTO usuarios_blog (username, password) VALUES (?, ?);";

        const retorno_insert_usuario = await dbconnection.query(
            stringQueryRegistro,
            [datosUsuario.username, datosUsuario.password_user]
        );

        return retorno_insert_usuario;
    }

    static async obtenerUsuariosBlog() {
        const datos_usuarios_blog = await dbconnection.query("SELECT * FROM usuarios_blog;");

        return datos_usuarios_blog;
    }

    static async obtenerUsuarioByUsername(username) {
        const datosUsuarioByName = await dbconnection.query("SELECT * FROM usuarios_blog WHERE username= ?;",
            [username]);

        return datosUsuarioByName;
    }



}
