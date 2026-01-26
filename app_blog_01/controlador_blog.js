
import { BlogModel02 } from "./modelo_blog_02.js";

//import multer from "multer"; 


import {
    uploadImage, eliminarImagen,
    verImagenesDisponibles, mostrarDatosImagen
} from "../control_imagenes/img_control_cloud.js";


export class BlogController02 {



    static async mostrarPublicacionesBlog(req, res) {
        const publicacionesBlog = await BlogModel02.obtenerPublicacionesBlog();
        res.render("templates_blog/blog_publicaciones.ejs", { publicaciones: publicacionesBlog });
    }

    static async mostrarPostSeleccionado(req, res) {
        const id_post = req.params.id_post;
        const datosPost = await BlogModel02.obtenerPostPorId_post(id_post);
        const categorias_post_seleccionado = await BlogModel02.obtenerCategoriaPostSeleccionado(id_post);
        datosPost[0].categorias = categorias_post_seleccionado;
        res.render("templates_blog/vista_posteo_blog.ejs", { datos_post: datosPost[0] });
    }

    static async obtenerCategoriasBlog(req, res) {
        const categorias_blog = await BlogModel02.obtenerCategoriasBlog();
        res.json(categorias_blog);
    }

    static async obtenerCategoriasDePosteos(req, res) {
        const categoriasPosteos = await BlogModel02.obtenerCategoriasDePosteos();
        res.json(categoriasPosteos);
    }

    static async obtenerPostPorId_post(req, res) {
        const id_post = req.params.id_post;
        const datosPostSeleccionado = await BlogModel02.obtenerPostPorId_post(id_post);
        res.json(datosPostSeleccionado[0]);
    }

    static async obtenerPosteosPorIdCategoria(req, res) {

        const id_categoria = req.params.id_categoria;

        const datosPosteos = await BlogModel02.obtenerPosteosPorIdCategoria(id_categoria);

        res.json(datosPosteos);
    }

    static async obtenerPosteosPorUsuario(req, res) {
        const id_usuario = req.params.id_usuario;

        const datos_posteos = await BlogModel02.obtenerPosteosPorUsuario(id_usuario);
        
        res.render("templates_blog/blog_publicaciones.ejs", { publicaciones: datos_posteos });
    }



    static async agregarNuevoPost(req, res) {

        const datos_nuevo_post = req.body;

        let url_imagen_post = "";

        if (req.file !== undefined) {

            const file_img = req.file;

            const nombre_carpeta_blog = "img_blog_vilma25";

            url_imagen_post = await uploadImage(file_img, nombre_carpeta_blog);

        } else {
            url_imagen_post = "sin_imagen";
        }

        let lista_ids_categorias = [];

        if (datos_nuevo_post.id_categorias) {
            const id_categorias = datos_nuevo_post.id_categorias;
            for (let indiceCategorias = 0; indiceCategorias < id_categorias.length; indiceCategorias++) {
                lista_ids_categorias.push(parseInt(id_categorias[indiceCategorias]));
            }
        }

        if (datos_nuevo_post.categoria_nueva) {

            const categoria_nueva = datos_nuevo_post.categoria_nueva;

            const datos_ingreso_categoria = await BlogModel02.agregarCategoriaBlog(categoria_nueva);

            let id_categoria_nueva = datos_ingreso_categoria.insertId;

            lista_ids_categorias.push(id_categoria_nueva);

        } else {
            console.log("No hay categoría nueva");
        }

        const datos_post_para_enviar = {
            "titulo": datos_nuevo_post.titulo,
            "contenido": datos_nuevo_post.contenido,
            "url_imagen": url_imagen_post,
            "id_usuario": datos_nuevo_post.id_autor
        }

        const retorno_ingreso_post = await BlogModel02.agregarNuevoPost(datos_post_para_enviar);

        const id_post_ingresado = retorno_ingreso_post.insertId;

        const datos_categorias_ingresados = await BlogModel02.agregarIdsPostCategoria(id_post_ingresado, lista_ids_categorias);

        res.json({ mensaje_post_nuevo: "los datos fueron recibidos con alegría" });

    }




    static async actualizarPost(req, res) {

        const id_post = req.params.id_post;

        let datos_actualizados = req.body;


        if (req.file) {             

            const file_img = req.file;
            const carpeta_cloudinary = "img_blog_vilma25";

            // obtenemos el valor de url_imagen desde la tabla blog_posteos   
            const url_imagen_anterior = await BlogModel02.obtenerUrlImagenPost(id_post);

            if (url_imagen_anterior === "sin_imagen" || url_imagen_anterior.length < 10) {

                const url_imagen_nueva = await uploadImage(file_img, carpeta_cloudinary);
                datos_actualizados.imagen_url = url_imagen_nueva;

            } else {
                const url_imagen_nueva = await uploadImage(file_img, carpeta_cloudinary);
                datos_actualizados.imagen_url = url_imagen_nueva;
                // eliminamos la imagen anterior
                const return_eliminar_img = await eliminarImagen(url_imagen_anterior);

                console.log("respuesta al eliminar imagen: ", return_eliminar_img);
            }

        }

        const resUpdatePost = await BlogModel02.actualizarPost(id_post, datos_actualizados);

        res.json({ mensaje_update: resUpdatePost });

    }


    static async subirImagenPost(req, res) {

        const nombre_carpeta_blog = "img_blog_vilma25";
        const { file } = req.file;
        //const id_producto = req.params.id_producto;
        const id_post = req.params.id_post;

        const url_imagen = await uploadImage(file, nombre_carpeta_blog);

        if (!url_imagen) {
            return res.status(500).json({ error: "Error al subir archivo" });
        }

        const datos_para_actualizar = { nombre_campo: "imagen_url", valor_campo: url_imagen };

        const respuestaUpdatePost = await BlogModel02.actualizarPost(id_post, datos_para_actualizar);

        console.log("url de imagen subida: ", url_imagen);

        return res.json(respuestaUpdatePost);

    }

    static async modificarImagenPost(req, res) {
        const nombre_carpeta_blog = "img_blog_vilma25";
        const { file } = req.file;
        const id_post = req.params.id_post;
        const url_imagen = await uploadImage(file, nombre_carpeta_blog);

        if (!url_imagen) {
            return res.status(500).json({ error: "Error al subir archivo" });
        }

        // obtener url de imagen anterior con id_post

        const url_img_para_borrar = await BlogModel02.obtenerUrlImagenPost(id_post);

        // eliminar imagen anterior de Cludinary, pasando url de la imagen anterior

        const result_delete_img = await eliminarImagen(url_img_para_borrar);

        console.log("datos result al eliminar imagen: ", result_delete_img);

        const datos_para_actualizar = { nombre_campo: "imagen_url", valor_campo: url_imagen };

        const respuestaUpdatePost = await BlogModel02.actualizarPost(id_post, datos_para_actualizar);

        return res.json(respuestaUpdatePost);

    }


    static async registrar_usuario_blog(req, res) {

        //const { username, password_user } = req.body;

        const datos_formulario_registro = req.body;

        const datos_retorno_registro = await BlogModel02.registrarUsuarioBlog(datos_formulario_registro);
        
        return res.json(datos_retorno_registro);
    }

    static async obtenerUsuarios(req, res) {
        const datos_usuarios_blog = await BlogModel02.obtenerUsuariosBlog();

        return res.json(datos_usuarios_blog);
    }


    static async login_usuario_blog(req, res) {

        const username = req.body.username;
        const password_ingresado = req.body.password_user;

        const [datos_usuario_por_nombre] = await BlogModel02.obtenerUsuarioByUsername(username);

        if (datos_usuario_por_nombre.length > 0) {
           
            if (datos_usuario_por_nombre[0].password === password_ingresado) {
                
                let respuesta_datos_ok = {
                    info_password: "password_ok",
                    info_usuario: datos_usuario_por_nombre[0].username
                };
                return res.json(respuesta_datos_ok);
            } else {
                
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
