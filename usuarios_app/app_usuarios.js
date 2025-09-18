import express from "express"; 

import jwt from "jsonwebtoken"; 

import bcrypt from "bcrypt"; 

const app = express(); 


app.use(express.json()); 

// simulación de una base de datos de usuarios 
const users = [
  {
    id: 1,
    username: 'johndoe',
    password: '$2a$10$C1ZdYOXw.7D/j0RGXE2TpefXHEdzhpQEm/6Rk89ZOCTcONKc6JIXC', // contraseña encriptada "password123"
  },
];

// Clave secreta para firmar el JWT 
const JWT_SECRET = "clave_secreta_para_firmar_jwt"; 

app.post("/registrar_usuario", async (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe

    const userExists = users.find(user => user.username === username); 

    if (userExists) {
        return res.status(400).json({ mensaje: "El usuario ya existe" }); 
    }
        
    // Encriptar la contraseña 
    
    const salt = await bcrypt.genSalt(10) 
    const hashedPassword = await bcrypt.hash(password, salt); 
  
    // Crear el nuevo usuario 
    
    const newUser = { id: users.length + 1, username, password: hashedPassword }; 

    users.push(newUser);     

    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
}); 

// Ruta de login 

app.post("/login", async (req, res) => {
    const { username, password } = req.body; 

    // verificar si el usuario existe. 

    const user = users.find(user => user.username === username); 

    if (!user) {
        return res.status(400).json({ mensaje: "Credenciales invalidas" }); 
    }

    // Verificar la contraseña 

    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
        return res.status(400).json({ mensaje: "Credenciales invalidas" }); 
    }

    // Generar el token JWT 

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h"}); 

    res.json({ token }); 

}); 

// verificación del JWT 
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token requerido' });
  }

  try {
    const verified = jwt.verify(token.split(' ')[1], JWT_SECRET); // Extraer el token después de "Bearer"
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

// Ruta protegida
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Bienvenido, ${req.user.username}` });
});

const PORT = 3005; 

app.listen(PORT, () => {
    console.log("Servidor corriendo en: http://localhost:", PORT); 
}); 
