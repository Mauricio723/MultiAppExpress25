import "dotenv/config";

import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const carpetaTienda01 = "TiendaVilma01";

//const carpetaVarios = "filesVilma25";

const createUrl = ({ name, version, format } = {}) => {
    const baseUrl = "https://res.cloudinary.com/dirq37l58/image/upload/";

    const versionFormat = version ? `v${version}/` : "";
    const fileName = `${name}.${format}`;
    return `${baseUrl}${versionFormat}${fileName}`;
};

const uploadStream = (buffer, nombre_carpeta) => {
    return new Promise((resolve, reject) => {
        const config = { folder: nombre_carpeta };
        const cloudinaryDone = (err, result) => {
            return err ? reject(err) : resolve(result);
        };
        cloudinary.v2.uploader.upload_stream(config, cloudinaryDone).end(buffer);
    });
};

const uploadImage = async (file, nombre_carpeta_cloud) => {
    try {
        const {
            public_id: name,
            version,
            format
        } = await uploadStream(file.buffer, nombre_carpeta_cloud);

        return createUrl({ name, version, format });

    } catch (error) {
        console.error({ error });
        return [null, error];
    }
};

 const obtenerPublicIdImg = (url_imagen) => {
     // Con lo siguiente, obtengo el valor de public_id de la imagen, el cual está 
     // contenido dentro de la url de la imagen obtenida en Cloudinary 
    let posicion_ultimo_punto  = url_imagen.lastIndexOf(".");
    let posicion_ultima_barra = url_imagen.lastIndexOf("/");
    let posicion_anteultima_barra = url_imagen.lastIndexOf("/", posicion_ultima_barra - 1);
    let public_id_img = url_imagen.substring(posicion_anteultima_barra + 1, posicion_ultimo_punto);

    return public_id_img;
  }

// Eliminación de una imagen por su: public_id
 
const eliminarImagen = async (url_imagen) => {
    try {
        const public_id = obtenerPublicIdImg(url_imagen);
        const result = await cloudinary.v2.uploader.destroy(public_id);
        return result;
        
    } catch (error) {
        console.error("Error en el proceso de borrado: ", error);
    }
};

const mostrarCarpetasCloudinary = async () => {
    const carpetas_cloudinary = cloudinary.v2.api.root_folders().then(result => {
        return result;
    });

    return carpetas_cloudinary;
};

const verImagenesDisponibles = async (nombre_carpeta) => {

    const datos_cloudinary = await cloudinary.v2.api.resources_by_asset_folder(nombre_carpeta, function (error, result) {
        if (error) {
            console.error("Error al obtener recursos: ", error);
            return { error: error };
        }

        //return result;
        return { mensaje: "Las operaciones fueron realizadas satisfactoriamente" };

    });

    return datos_cloudinary;

};

const mostrarDatosImagen = async (id_imagen) => {

    const datos_imagen_cloud = await cloudinary.v2.api.resource(id_imagen)
        .then(result => {
           
            return result;
        });

    return datos_imagen_cloud;
   
};

export { uploadImage, eliminarImagen, mostrarCarpetasCloudinary, verImagenesDisponibles, mostrarDatosImagen };

