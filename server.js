import { SqlContenedor } from "./Handlers/Contenedor.js";
import { optionsSql, optionsSqlite } from "./dbCnf/Confi.js";
import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("./public"));

//PLANTILLAS
app.set("view engine", "ejs");

//DB
const productosContenedor = new SqlContenedor(optionsSql, "Productos");
const mensajesContenedor = new SqlContenedor(optionsSqlite, "Mensajes");

//GET
app.get("/productos", async (req, res) => {
  try {
    const productos = await productosContenedor.getAll();
    res.render("index", {
      pageTitle: "Desafio 07 - DB",
      productos: productos,
    });
  } catch (error) {
    console.log(error);
  }
});

io.on("connection", async (socket) => {
    console.log ("Nuevo usuario conectado");
    const productos = await productosContenedor.getAll();
    const mensajes = await mensajesContenedor.getAll();
    socket.emit('productos', productos);
    socket.emit('mensajes', mensajes);

    socket.on("nuevoProducto", async (data) => {
        await productosContenedor.save(data);       
        io.sockets.emit('productos', await productosContenedor.getAll());
    })

    socket.on('nuevoMensaje', async (data) => {
      await mensajesContenedor.save(data);
      io.sockets.emit("mensajes", await mensajesContenedor.getAll());
    })
})

const PORT = 8080;
httpServer.listen(PORT, () => console.log("Escuchando en puerto " + PORT));