import dbconnection from "../db_conexiones/db_conection.js";


export class GaleriaImgModel {

    /*
    static async crearTablaGaleria() {
        const string_query = "CREATE TABLE datos_img_galeria (id INT AUTO_INCREMENT PRIMARY KEY, " 
            + "titulo_img VARCHAR(100) NOT NULL, url_imagen VARCHAR(200));"; 
        const datosCreandoTabla = await dbconnection.query(string_query);
        return datosCreandoTabla;
    }
        */

   
    static async agregarDatosImagen(datos_imagen) {

        const string_query = "INSERT INTO datos_img_galeria (titulo_img, url_imagen, orden_img) VALUES (?, ?, ?);"; 

        const retornoAgregandoDatosImg = await dbconnection.query(string_query, 
            [datos_imagen.titulo_img, datos_imagen.url_imagen, datos_imagen.orden_img]); 

        return retornoAgregandoDatosImg;

    }

    static async obtenerImagenes() {
        const string_query = "SELECT * FROM datos_img_galeria;";

        const [datosImagenes] = await dbconnection.query(string_query); 

        return datosImagenes;
    }

}

