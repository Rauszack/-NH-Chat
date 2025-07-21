import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js"; 
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
//Input - Output 
const io = new Server(server);
const PORT = 8080;

//configuracion de handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoints
app.use("/", viewsRouter);

app.use(express.static('public'));


//persistencia en memoria de los mensajes de chat
//esto se puede cambiar por una base de datos o cualquier otro sistema de almacenamiento
const messages = [];

//websocket desde el servidor
io.on("connection", (socket) => {
    //emitimos un evento al cliente que se conecta
    socket.emit("message history", messages);
    console.log("Nuevo cliente conectado");

    //escuchamos un evento
    socket.on("new message", (dataMessage) => {
        messages.push(dataMessage);
        //emitimos el evento a todos los clientes conectados
        io.emit("broadcast new message", dataMessage);
    });
}); 

server.listen(PORT, () => {
    console.log("Servidor http escuchando en el puerto 8080");
});