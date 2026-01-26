import express from "express"; 
import dbconnection from "../db_conexiones/db_conection.js";

// esta app es solo para crear las tablas necesarias para cada sección
// Luego de la creación de las tablas, esta app no la utilizo.
// para iniciar esta app : npm run dev-tablas-db

const app = express();

app.use(express.json()); 

app.get('/mostrar_tablas', async (req, res) => {
  const tablas_db = await dbconnection.query("SHOW TABLES;");
  res.json(tablas_db[0]);
});

app.get("/describe_tabla/:nombre_tabla", async (req, res) => {
  const nombreTabla = req.params.nombre_tabla;
  let string_query = "DESCRIBE " + nombreTabla + ";";
  const datos_describe = await dbconnection.query(string_query); 
  res.json(datos_describe[0]);
});

// creamos tabla para usuarios del sitio
app.get("/crear_tabla_usuarios", async (req, res) => {
  const string_query = "CREATE TABLE usuarios (id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), "
                      + "username VARCHAR(200) NOT NULL, password VARCHAR(255) NOT NULL);"; 
  const retorno_creando_tabla = await dbconnection.query(string_query); 
  res.json(retorno_creando_tabla); 
}); 
// crear tabla para roles de usuarios (relación muchos a muchos)
app.get ("/crear_tabla_roles_de_usuarios", async (req, res) => {
  const string_query = "CREATE TABLE roles_de_usuarios (id_rol INT AUTO_INCREMENT PRIMARY KEY, " 
                    + "nombre_rol VARCHAR(200) NOT NULL UNIQUE);"; 
  const retorno_creando_tabla = await dbconnection.query(string_query); 
  res.json(retorno_creando_tabla); 
}); 
// creamos tabla intermedia par usuarios y roles
app.get("/crear_tabla_usuarios_roles", async (req, res) => {
  const string_query = "CREATE TABLE usuarios_roles (usuario_id BINARY(16), rol_id INT, " 
                      + "PRIMARY KEY (usuario_id, rol_id), " 
                      + "FOREIGN KEY (usuario_id) REFERENCES usuarios(id), " 
                      + "FOREIGN KEY (rol_id) REFERENCES roles_de_usuarios(id_rol));"; 
  const retorno_creando_tabla = await dbconnection.query(string_query); 
  res.json(retorno_creando_tabla); 
}); 

app.get("/crear_tabla_usuarios_blog", async (req, res) => {
  const string_query = "CREATE TABLE usuarios_blog (id_user INT AUTO_INCREMENT PRIMARY KEY, " 
                      + "username VARCHAR(200) NOT NULL, password VARCHAR(255) NOT NULL);"; 
  const retorno_creando_tabla = await dbconnection.query(string_query); 
  res.json(retorno_creando_tabla);
}); 

app.get("/crear_tabla_blog_posteos", async (req, res) => {
  // esta tabla se relaciona con usuarios_blog (uno a muchos)
  const string_query = "CREATE TABLE blog_posteos (id_post INT AUTO_INCREMENT PRIMARY KEY, " 
                      + "titulo VARCHAR(100) NOT NULL, contenido_01 TEXT NOT NULL, " 
                      + "imagen_url VARCHAR(200) DEFAULT 'sin_imagen', " 
                      + "fecha_publicacion VARCHAR(100) DEFAULT 'fecha_sin_definir', "
                      + "usuario_id binary(16) NOT NULL, FOREIGN KEY (usuario_id) REFERENCES usuarios(id));";
  const retorno_creando_tabla = await dbconnection.query(string_query);
  res.json(retorno_creando_tabla);
}); 

app.get("/crear_tabla_blog_categorias", async (req, res) => {
  // esta tabla se relaciona con posts_blog (muchos a muchos)
  const string_query = "CREATE TABLE blog_categorias (id_categoria INT AUTO_INCREMENT PRIMARY KEY, " 
                      + "nombre_categoria VARCHAR(100) NOT NULL UNIQUE);"; 
  const retorno_creando_tabla = await dbconnection.query(string_query);
  res.json(retorno_creando_tabla);  
});

app.get("/crear_tabla_intermedia_blog_posteos_categorias", async (req, res) => {
  // esta es la tabla intermedia para posts_blog y categorias_blog
  const string_query = "CREATE TABLE blog_posteos_categorias (post_id INT, categoria_id INT, " 
                      + "PRIMARY KEY (post_id, categoria_id), "
                      + "FOREIGN KEY (post_id) REFERENCES blog_posteos(id_post), " 
                      + "FOREIGN KEY (categoria_id) REFERENCES blog_categorias(id_categoria));";   
  const retorno_creando_tabla = await dbconnection.query(string_query); 
  res.json(retorno_creando_tabla);
});

// Iniciar el servidor
const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
