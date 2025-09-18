import { Router } from "express"; 

import { BlogController } from "./controlador_blog.js";

import { verificar_token } from "../usuarios_app/jwt_verificacion.js"; 

//import { upload } from "../control_imagenes/upload_img_multer.js";

import multer from "multer";

export const blogRouter = Router(); 

const inMemoryStorage = multer.memoryStorage(); 
const upload = multer({ storage: inMemoryStorage }).single("imagen_post");
//const upload = multer({ storage: inMemoryStorage });

blogRouter.get("/inicio_blog", (req, res) => {
    res.render(
        "templates_blog/blog_base_01.ejs", { seccion_blog: "inicio" }
    ); 
}); 

blogRouter.get("/navegacion_blog", (req, res) => {
    res.render("templates_blog/blog_base_01.ejs", { seccion_blog: "navegacion_blog" });
});

blogRouter.get("/mostrar_formulario_post", BlogController.mostrarFormularioPost );

blogRouter.get("/prueba_envio_token", verificar_token, (req, res) => {
    res.json({ mensaje_prueba_token: "Si se recibe esto, el token fué enviado correctamente" }); 
}); 

blogRouter.get("/mostrar_formulario_imagen_post", (req, res) => {
    res.render("templates_blog/formulario_img_post.ejs");
});

blogRouter.get("/mostrar_formulario_update/:id_post", (req, res) => {
    const id_post_update = req.params.id_post;
    console.log("valor de id_post_update: ", id_post_update);

    res.render("templates_blog/formulario_actualizar_post.ejs", { id_post: id_post_update });    
}); 

blogRouter.get("/mostrar_formulario_registro", (req, res) => {
    res.render("templates_blog/formulario_usuarios_blog.ejs", { tipo_formulario: "formulario_registro" });
}); 

blogRouter.get("/mostrar_formulario_login", (req, res) => {
    res.render("templates_blog/formulario_usuarios_blog.ejs", { tipo_formulario: "formulario_login" });
}); 

blogRouter.get("/obtener_titulos_posteos", BlogController.obtenerTitulosPosteos);

blogRouter.get("/obtener_titulos_posteos_por_usuario/:id_usuario", BlogController.obtenerTitulosPosteosPorUsuario); 

blogRouter.get("/obtener_nombres_posteos_por_id_categoria/:id_categoria", BlogController.obtenerNombresPosteosPorIdCategoria);

blogRouter.get("/obtener_post_por_id_post/:id_post", BlogController.obtenerPostPorId_post); 

blogRouter.get("/obtener_categorias_blog", BlogController.obtenerCategoriasBlog); 

// esto es para obtener las categorías que tienen al menos un post
blogRouter.get("/obtener_categorias_de_posteos", BlogController.obtenerCategoriasDePosteos); 

//blogRouter.post("/agregar_post", upload, verificar_token, BlogController.agregarPost);

blogRouter.post("/agregar_post", upload, BlogController.agregarPostNuevo); 

//blogRouter.post("/subir_imagen_post", upload, BlogController.subirImagenPrueba);

blogRouter.patch("/actualizar_post", upload, verificar_token, BlogController.actualizarPost);

blogRouter.post("/registrar_usuario_blog", upload, BlogController.registrar_usuario_blog); 
blogRouter.post("/login_usuario_blog", upload, BlogController.login_usuario_blog);

blogRouter.get("/obtener_usuarios", BlogController.obtenerUsuarios);

blogRouter.post("/agregar_imagen_prueba", upload, (req, res) => {
    console.log("datos de la imagen: ", req.file);
    console.log("datos de texto del formulario: ", req.body);
    res.send("la imagen llegó al servidor");
});

