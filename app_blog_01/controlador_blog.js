import { BlogModel } from "./modelo_blog_mysql.js";

//import multer from "multer"; 

import {
    uploadImage, eliminarImagen,
    verImagenesDisponibles, mostrarDatosImagen
} from "../control_imagenes/img_control_cloud.js";

export class BlogController {


    static async obtenerTitulosPosteos(req, res) {
        const datos_posteos = await BlogModel.obtenerTitulosPosteos(); 
        res.json(datos_posteos); 
    }

    static async obtenerTitulosPosteosPorUsuario(req, res) {
        const id_usuario = req.params.id_usuario;

        const datos_posteos = await BlogModel.obtenerTitulosPosteosPorUsuario(id_usuario); 
        res.json(datos_posteos); 
    }

    static async obtenerNombresPosteosPorIdCategoria(req, res) {

        const id_categoria = req.params.id_categoria;

        const datosPosteos = await BlogModel.obtenerNombresPosteosPorIdCategoria(id_categoria);

        //console.log("datos posteos: ", datosPosteos[0]); 
        //res.json(datosPosteos[0]);

        res.json(datosPosteos); 
        
        //res.render("templates_blog/blogSurCode25.ejs", { datos: datosPosteos[0] });
    }

    static async obtenerPostPorId_post(req, res) {
        const id_post = req.params.id_post;
        const datosPost = await BlogModel.obtenerPostPorId_post(id_post); 
        //console.log("controlador, datos post: ", datosPost);        
        const categorias_post_seleccionado = await BlogModel.obtenerCategoriaPostSeleccionado(id_post);
        //console.log("categorias de este post: ", categorias_post_seleccionado); 
        datosPost[0].categorias = categorias_post_seleccionado;
        //console.log("datos despues de modificar categorias: ", datosPost[0]);        
        res.render("templates_blog/blog_base_01.ejs", { seccion_blog: "post_seleccionado", datos_post: datosPost[0] });
    }
    
    static async mostrarFormularioPost(req, res) {
        // obtenemos las categorías para mostrarlas como opciones directas en el formulario
        const categorias_blog = await BlogModel.obtenerCategoriasBlog();
        res.render("templates_blog/formularios_blog/formulario_nuevo_post.ejs", { categorias: categorias_blog });
    }

    static async obtenerCategoriasBlog(req, res) {
        const categorias_blog = await BlogModel.obtenerCategoriasBlog();
        res.json(categorias_blog);
    }

    static async obtenerCategoriasDePosteos(req, res) {
        const categoriasPosteos = await BlogModel.obtenerCategoriasDePosteos(); 
        res.json(categoriasPosteos);
    }

    static async agregarPostNuevoPrueba(req, res) {

        const datos_nuevo_post = req.body;

        //console.log("datos del nuevo post: ", datos_nuevo_post);
        //const titulo = datos_nuevo_post.titulo;
        //console.log("titulo: ", titulo);
        //const contenido = datos_nuevo_post.contenido;
        //console.log("contenido: ", contenido);
        //const url_imagen = datos_nuevo_post.imagen_url;
        //console.log("url_imagen: ", url_imagen);
        //const autor = datos_nuevo_post.autor;
        //console.log("autor: ", autor); 
        //const id_autor = datos_nuevo_post.id_autor; 
        //console.log("id autor: ", id_autor);       

        res.json({ mensaje: "Se agtregó correctamente el post: " + datos_post_para_enviar.titulo });

    }


    static async agregarPostNuevo(req, res) {

        const datos_nuevo_post = req.body;

        let url_imagen_post = "";

        let lista_ids_categorias = [];
        
        console.log("imagen_url: ", datos_nuevo_post.imagen_url);

        if (datos_nuevo_post.id_categorias) {
            const id_categorias = datos_nuevo_post.id_categorias;
            for (let indiceCategorias = 0; indiceCategorias < id_categorias.length; indiceCategorias++) {
                lista_ids_categorias.push(parseInt(id_categorias[indiceCategorias]));
            }
        }

        const categoria_nueva = datos_nuevo_post.categoria_nueva;
        let id_categoria_nueva = 0;

        if (categoria_nueva) {
            console.log("categoría nueva: ", categoria_nueva);

            const datos_ingreso_categoria = await BlogModel.agregarCategoriaBlog(categoria_nueva);

            console.log("datos_ingreso_categoria: ", datos_ingreso_categoria);

            id_categoria_nueva = datos_ingreso_categoria.insertId;

            console.log("id retornado de categoría nueva: ", id_categoria_nueva);

            lista_ids_categorias.push(id_categoria_nueva);


        } else {
            console.log("No hay categoría nueva");
        }



        if (datos_nuevo_post.imagen_url !== "sin_imagen") {

            const file = req.file;

            //const fechaActual = new Date();         
            //console.log("fecha actual: ", fechaActual.toLocaleString("es-AR")); 

            console.log("dentro de con imagen");


            const nombre_carpeta_blog = "img_blog_vilma25";

            //const url_imagen_nueva = await uploadImage(file, nombre_carpeta_blog);

            //const retorno_ingreso_post = await BlogModel.agregarPostConImagen(datos_blog, url_imagen);

            //url_imagen_post = url_imagen_nueva;
            
            url_imagen_post = "sin_imagen"; 
            
            //res.json(retorno_ingreso_post);

            //res.json({ mensaje: "Se agregaron los datos correctamente" });

        } else {

            console.log("dentro de sin imagen");

            //console.log("valor de imagen_url: ", datos_blog.imagen_url);


            //const retorno_ingreso_post = await BlogModel.agregarPostSinImagen(datos_blog);

            //res.json(retorno_ingreso_post);

            url_imagen_post = datos_nuevo_post.imagen_url;

            

        }


        // nombre_usuario_autor = datos_nuevo_post.autor

        const datos_post_para_enviar = {
            "titulo": datos_nuevo_post.titulo,
            "contenido": datos_nuevo_post.contenido,
            "url_imagen": url_imagen_post,
            "id_usuario": datos_nuevo_post.id_autor
        }

        const retorno_ingreso_post = await BlogModel.agregarPostNuevo(datos_post_para_enviar);


        const id_post_ingresado = retorno_ingreso_post.insertId;

        const datos_categorias_ingresados = await BlogModel.agregar_ids_post_categoria(id_post_ingresado, lista_ids_categorias); 

        res.json({ mensaje: "Se agregaron los datos correctamente" });


    }

    /*
        "INSERT INTO blog_posteos (titulo, contenido, imagen_url, usuario_id," 
        + " fecha_publicacion) VALUES (?, ?, ?, ?, ?);"
    */

    static async actualizarPost(req, res) {

        const datos_update_post = req.body;

        console.log("actualizando post");

        console.log("valor de imagen_url: ", datos_update_post.imagen_url);

        //console.log("datos recibidos de actualizar port: ", datos_update_post);


        if (datos_update_post.imagen_url !== "sin_imagen") {


            const file = req.file;

            //const fechaActual = new Date();         
            //console.log("fecha actual: ", fechaActual.toLocaleString("es-AR")); 

            console.log("datos de la imagen: ", file);

            console.log("dentro de con imagen");


            //const nombre_carpeta_blog = "img_blog_vilma25";

            //const url_imagen = await uploadImage(file, nombre_carpeta_blog);

            //const retorno_ingreso_post = await BlogModel.agregarPostConImagen(datos_blog, url_imagen);

            //res.json(retorno_ingreso_post);
            res.json({ mensaje: "actualizando post con imagen" });

        } else {

            console.log("datos recibidos, en sin imagen: ", datos_update_post);

            res.json({ mensaje: "actualizando post sin imagen" });

        }

    }

    static async subirImagenPrueba(req, res) {
        console.log("dentro de subirImagenPrueba");
        console.log("datos imagen: ", req.file);
    }

    static async subirImagenPost(req, res) {

        const nombre_carpeta_blog = "img_blog_vilma25";
        const { file } = req;
        //const id_producto = req.params.id_producto;
        const url_imagen = await uploadImage(file, nombre_carpeta_blog);

        if (!url_imagen) {
            return res.status(500).json({ error: "Error al subir archivo" });
        }
        //const datos_model_tienda = await TiendaModel.modificar_imagen_producto(url_imagen, id_producto);

        //return res.json(datos_model_tienda);

        console.log("url de imagen subida: ", url_imagen);

        return url_imagen;


    }

    static async modificarImagenProducto(req, res) {
        const { file } = req;
        const id_producto = req.params.id_producto;
        const url_imagen = await uploadImage(file);

        if (!url_imagen) {
            return res.status(500).json({ error: "Error al subir archivo" });
        }
        const datos_model_tienda = await TiendaModel.modificar_imagen_producto(url_imagen, id_producto);

        return res.json(datos_model_tienda);

    }

    static async ver_imagenes_por_carpeta(req, res) {
        const nombreCarpeta = req.params.nombre_carpeta;
        const imagenes_disponibles = await verImagenesDisponibles(nombreCarpeta);
        return res.json(imagenes_disponibles);
    }

    static async registrar_usuario_blog(req, res) {

        //const { username, password_user } = req.body;


        const datos_formulario_registro = req.body;

        //console.log("datos formulario registro: ", datos_formulario_registro);

        const datos_retorno_registro = await BlogModel.registrarUsuarioBlog(datos_formulario_registro);

        //console.log("Nombre usuario: ", req.body.username);
        //console.log("password: ", req.body.password_user);

        console.log("datos retorno registro: ", datos_retorno_registro);

        return res.json(datos_retorno_registro);
    }

    static async obtenerUsuarios(req, res) {
        const datos_usuarios_blog = await BlogModel.obtenerUsuariosBlog();

        return res.json(datos_usuarios_blog);
    }


    static async login_usuario_blog(req, res) {

        //console.log("datos ingresados: ", req.body); 

        const username = req.body.username;
        const password_ingresado = req.body.password_user;

        //console.log("contraseña ingresada: ", password_ingresado);


        const [datos_usuario_por_nombre] = await BlogModel.obtenerUsuarioByUsername(username);

        //console.log("Datos Login: ", datos_usuario_por_nombre);

        if (datos_usuario_por_nombre.length > 0) {
            //console.log("El nombre de usuario existe en la base de datos"); 
            if (datos_usuario_por_nombre[0].password === password_ingresado) {
                //console.log("la contraseña es correcta"); 
                let respuesta_datos_ok = {
                    info_password: "password_ok",
                    info_usuario: datos_usuario_por_nombre[0].username
                };
                return res.json(respuesta_datos_ok);
            } else {
                //console.log("La contraseña es incorrecta");
                let respuesta_password_null = {
                    info_password: "La contraseña ingresada es incorrecta",
                    info_usuario: datos_usuario_por_nombre[0].username
                };
                return res.json(respuesta_password_null);
            }
        } else {
            console.log("El nombre de usuario ingresado no existe en la base de datos");
            let respuesta_usuario_null = {
                info_password: "password_null",
                info_usuario: "El nombre de usuario no existe en la base de datos"
            };
            return res.json(respuesta_usuario_null);
        }

        return res.json(datos_usuario_por_nombre);
    }



}