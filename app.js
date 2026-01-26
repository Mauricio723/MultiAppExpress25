import express from "express";

//import multer from "multer"; 

//import { frasesRouter } from "./app_frases_01/rutas_frases.js";
//import { blogRouter } from "./app_blog_01/rutas_blog_01.js";

import { blogRouter02 } from "./app_blog_01/rutas_blog.js";

import { usuariosRouter } from "./usuarios_app/rutas_usuarios.js"; 

const app = express(); 

//const upload_post = multer();

app.disable("x-powered-by");

// definimos el sistema de plantillas 

app.set("view engine", "ejs"); 

app.use(express.static("public"));

app.use(express.json()); 

//app.use(upload_post.array());   // con esto obtenemos los datos desde un FormData 

// Mostramos la página de inicio del sitio (index.ejs)
app.get ("/", (req, res) => {
    res.render("index");
});

/*
app.post("/agregar_nueva_frace", (req, res) => {
    //const frace = req.body.nueva_frace;
    //const autor = req.body.nuevo_autor;
    console.log("todo: ", JSON.stringify(req.body));
    console.log("frace: ", req.body.nueva_frace);
    console.log("autor: ", req.body.nuevo_autor);            
    res.json({ mensaje: "Se agregarorn datos nuevos a la tabla fraces" });
});
*/

/*
const inMemoryStorage = multer.memoryStorage(); 
const upload = multer({ storage: inMemoryStorage }).single("image");

// Ruta para mostrar el formulario de subida
app.get('/mostrar_formulario_imagen', (req, res) => {
  res.render('templates_blog/formulario_img_post', { imageUrl: null });
});

app.post("/upload", upload, async (req, res) => {

    console.log("datos imagen: ", req.file);
    
});
*/

app.use("/usuarios", usuariosRouter); 

//app.use("/frases", frasesRouter); 

app.use("/blog_02", blogRouter02);

const PORT = process.env.PORT ?? 3005;

app.listen(PORT, () => {
    console.log("Servidor corriendo en: http://localhost:", PORT);
}); 
