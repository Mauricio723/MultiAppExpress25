import { Router } from "express"; 

import { BlogController02 } from "./controlador_blog.js";

import { verificar_token } from "../usuarios_app/jwt_verificacion.js"; 

//import { upload } from "../control_imagenes/upload_img_multer.js";

import multer from "multer";

export const blogRouter02 = Router(); 

const inMemoryStorage = multer.memoryStorage(); 
const upload = multer({ storage: inMemoryStorage }).single("imagen_post");
//const upload = multer({ storage: inMemoryStorage });

blogRouter02.get("/inicio_blog", (req, res) => {
    res.render("templates_blog/blog_inicio_01.ejs");
});

blogRouter02.get("/mostrar_formulario_nuevo_post", (req, res) => {
     res.render("templates_blog/formulario_nuevo_post.ejs");
} );


blogRouter02.get("/mostrar_pagina_update_post/:id_post", (req, res) => {
    const post_id = req.params.id_post;
    res.render("templates_blog/blog_update_post.ejs", { id_post_blog: post_id });
}); 

blogRouter02.get("/mostrar_formulario_registro/:rol_usuario", (req, res) => {
    // roles: user_blog, admin_blog
    const rolUsuario = req.params.rol_usuario;
    console.log("rol de usuario para registro: ", rolUsuario);
    
    res.render("templates_usuarios/formulario_registro.ejs", { rol_usuario: rolUsuario });
}); 

blogRouter02.get("/mostrar_formulario_login", (req, res) => {
    res.render("templates_usuarios/formulario_login.ejs");
}); 

blogRouter02.get("/mostrar_publicaciones_blog", BlogController02.mostrarPublicacionesBlog);

blogRouter02.get("/mostrar_post_seleccionado/:id_post", BlogController02.mostrarPostSeleccionado); 

blogRouter02.get("/obtener_categorias_blog", BlogController02.obtenerCategoriasBlog); 


// esto es para obtener las categorías que tienen al menos un post
blogRouter02.get("/obtener_categorias_de_posteos", BlogController02.obtenerCategoriasDePosteos); 


blogRouter02.get("/obtener_post_por_id_post/:id_post", BlogController02.obtenerPostPorId_post); 


blogRouter02.get("/obtener_posteos_por_id_categoria/:id_categoria", BlogController02.obtenerPosteosPorIdCategoria);


blogRouter02.get("/obtener_posteos_por_usuario/:id_usuario", BlogController02.obtenerPosteosPorUsuario); 


//blogRouter.post("/agregar_post", upload, verificar_token, BlogController.agregarPost);


blogRouter02.post("/agregar_nuevo_post", upload, verificar_token, BlogController02.agregarNuevoPost); 



blogRouter02.patch("/actualizar_post/:id_post", upload, BlogController02.actualizarPost); 


blogRouter02.post("/subir_imagen_post", upload, BlogController02.subirImagenPost);

blogRouter02.patch("/modificar_imagen_post", upload, BlogController02.modificarImagenPost); 


// Sección para registro y login de usuarios

blogRouter02.post("/registrar_usuario_blog", upload, BlogController02.registrar_usuario_blog); 
blogRouter02.post("/login_usuario_blog", upload, BlogController02.login_usuario_blog);
blogRouter02.get("/obtener_usuarios", BlogController02.obtenerUsuarios);

// ......................................

blogRouter02.post("/prueba_subir_imagen/:id_post", upload, (req, res) => {
    console.log("id_post: ", req.params.id_post);
    console.log("datos imagen: ", req.file); 

    res.json({ mensaje_img: "datos de imagen recibidos correctamente" }); 

});


