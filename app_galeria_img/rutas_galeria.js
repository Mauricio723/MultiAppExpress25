import { Router } from "express"; 

import { GaleriaImgController } from "./controlador_galeria.js";

import multer from "multer";


export const galeriaRouter = Router(); 

const inMemoryStorage = multer.memoryStorage(); 
const upload = multer({ storage: inMemoryStorage }).single("file_imagen");


galeriaRouter.get("/inicio_galeria", (req, res) => {
    res.render("templates_galeria_img/inicio_galeria.ejs");
}); 

galeriaRouter.get("/mostrar_galeria", (req, res) => {
    res.render("templates_galeria_img/galeria_img_01.ejs");
}); 

//galeriaRouter.get("/crear_tabla_galeria", GaleriaImgController.crearTablaGaleriaImg);


galeriaRouter.post("/agregar_imagen", upload, GaleriaImgController.agregarDatosNuevaImagen); 

galeriaRouter.get("/obtener_imagenes", GaleriaImgController.obtener_imagenes); 

