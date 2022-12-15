const socket = io.connect();

const divProducts = document.getElementById("productosPrincipal");
const tableProducts = document.getElementById("productosCuerpo");

function actualizarProducto(table, arrayProductos) {
  document.getElementById("noproductos").style.display = "none";
  document.getElementById("tableProducts").style.display = "table";
  document.getElementById("productosCuerpo").innerHTML = "";
  arrayProductos.forEach((element) => {
    let row = table.insertRow();
    row.insertCell().innerHTML = element.nombre;
    row.insertCell().innerHTML = element.precio;
    row.insertCell().innerHTML = `<img src="${element.thumbnail}" alt="${element.nombre}" width="60px">`;
  });
}

function actualizarMensajes(arrayMensajes) {
  const html = arrayMensajes.map(mensaje => {
    return `<div>
      <span style="color: blue">${mensaje.email}</span><span style="color: brown"> [${mensaje.fecha}] </span><span style="color: green">${mensaje.mensaje}</span>
    </div>`
  }).join(" ")
  document.getElementById("mensajesPrincipal").innerHTML = html;
}

function addProducto() {
  const producto = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    thumbnail: document.getElementById("thumbnail").value,
  };

  socket.emit("nuevoProducto", producto);
  return false;
}

function enviarMensaje() {
  const mensaje = {
    email: document.getElementById("email").value,
    fecha: new Date(Date.now()).toLocaleString(),
    mensaje: document.getElementById("mensaje").value
  }

  socket.emit("nuevoMensaje", mensaje);
  return false
}

socket.on("productos", (data) => {
  data.length > 0
    ? actualizarProducto(arrayProductos, data)
    : (document.getElementById("productosPrincipal").innerHTML = "No products");
});

socket.on("mensajes", data => {
 actualizarMensajes(data);

})