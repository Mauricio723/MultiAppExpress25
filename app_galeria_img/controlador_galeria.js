
import { GaleriaImgModel } from "./modelo_galeria.js";


import {
    uploadImage, eliminarImagen,
    verImagenesDisponibles, mostrarDatosImagen
} from "../control_imagenes/img_control_cloud.js";



export class GaleriaImgController {

    /*
    static async crearTablaGaleriaImg(req, res) {
        const datosCreandoTabla = await GaleriaImgModel.crearTablaGaleria();
        return datosCreandoTabla;
    }
        */

    static async agregarDatosNuevaImagen(req, res) {

        //const titulo_imagen = req.body.titulo_img;

        const datos_req_img = req.body; 

        const file_imagen = req.file; 

        const carpeta_galeria = "galeria26"; 

        const url_imagen_galeria = await uploadImage(file_imagen, carpeta_galeria); 

       
        const datos_imagen = {
            "titulo_img": datos_req_img.titulo_img, 
            "url_imagen": url_imagen_galeria, 
            "orden_img": datos_req_img.orden_img
        } ;

        const retorno_agregando_datos = await GaleriaImgModel.agregarDatosImagen(datos_imagen); 

               
        res.json(retorno_agregando_datos);
        
    }
    
    static async obtener_imagenes(req, res) {

        const datos_imagenes = await GaleriaImgModel.obtenerImagenes(); 

        //console.log("en GaleriaImgController, datos_imagenes: ", datos_imagenes); 

        res.json(datos_imagenes);
    }


}
