// LOGIN
const seccionLogin = document.getElementById("seccion-login");
const formularioLogin = document.getElementById("formulario-login");
const seccionInventario = document.getElementById("seccion-inventario");
const usuarioMostrado = document.getElementById("usuarioMostrado");
const usuarioBienvenido = document.getElementById("usuarioBienvenido");
const inicialUsuario = document.getElementById("inicialUsuario");

// Revisar si hay usuario en localStorage al cargar la página
window.addEventListener("load", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    seccionLogin.classList.add("hidden");
    seccionInventario.classList.add("active");
    usuarioMostrado.textContent = usuarioGuardado;
    usuarioBienvenido.textContent = usuarioGuardado;
    inicialUsuario.textContent = usuarioGuardado.charAt(0).toUpperCase();
  }
});

// Login
formularioLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  seccionLogin.classList.add("hidden");
  seccionInventario.classList.add("active");
  usuarioMostrado.textContent = usuario;
  usuarioBienvenido.textContent = usuario;
  inicialUsuario.textContent = usuario.charAt(0).toUpperCase();
  localStorage.setItem("usuarioActual", usuario); // Guardar sesión
});

// CERRAR SESIÓN
function cerrarSesion() {
  seccionLogin.classList.remove("hidden");
  seccionInventario.classList.remove("active");
  formularioLogin.reset();
  localStorage.removeItem("usuarioActual"); // Borrar sesión
}

// MODAL
const modal = document.getElementById("modal-solicitud");
function mostrarModal(mensaje) {
  modal.classList.add("active");
  document.getElementById("mensaje-modal").textContent = mensaje;
}
function cerrarModal() {
  modal.classList.remove("active");
}

// PRODUCTOS
const gridProductos = document.getElementById("gridProductos");
let productos = [];

// CARGAR PRODUCTOS DESDE JSON
fetch("productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    actualizarInventario();
  })
  .catch((error) => console.error("Error al cargar productos:", error));

// FUNCIONES DE INVENTARIO
function actualizarInventario() {
  gridProductos.innerHTML = "";
  productos.forEach((prod, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-producto";
    tarjeta.innerHTML = `
      <div class="icono-producto">📦</div>
      <div class="nombre-producto">${prod.nombre}</div>
      <div class="descripcion-producto">${prod.descripcion}</div>
      <div class="cantidad-producto">
        <span class="etiqueta-cantidad">Cantidad: </span>
        <span class="valor-cantidad">${prod.cantidad}</span>
        <span class="unidad-cantidad">${prod.unidad}</span>
      </div>
      <button class="boton-solicitar" onclick="solicitarProducto(${index})">Solicitar</button>
      <button class="boton-actualizar" onclick="actualizarProducto(${index})">Actualizar</button>
      <button class="boton-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    gridProductos.appendChild(tarjeta);
  });
  document.getElementById("contadorProductos").textContent = productos.length;
}

// AGREGAR PRODUCTO NUEVO
function agregarProducto() {
  const nombre = prompt("Ingrese el nombre del producto:");
  const descripcion = prompt("Ingrese la descripción del producto:");
  const cantidad = parseInt(prompt("Ingrese la cantidad inicial:"));
  const unidad = prompt("Ingrese la unidad (unidades, piezas, metros, etc.):");

  if (nombre && descripcion && !isNaN(cantidad) && unidad) {
    productos.push({ nombre, descripcion, cantidad, unidad });
    actualizarInventario();
    mostrarModal(`Producto "${nombre}" agregado exitosamente.`);
  } else {
    mostrarModal("Datos inválidos. Producto no agregado.");
  }
}

// SOLICITAR PRODUCTO
function solicitarProducto(index) {
  const prod = productos[index];
  if (prod.cantidad > 0) {
    prod.cantidad--;
    actualizarInventario();
    mostrarModal(`Has solicitado 1 ${prod.unidad} de ${prod.nombre}`);
  } else {
    mostrarModal(`No hay stock disponible de ${prod.nombre}`);
  }
}

// ACTUALIZAR PRODUCTO
function actualizarProducto(index) {
  const nuevaCantidad = prompt(
    `Ingrese la nueva cantidad de ${productos[index].nombre}:`,
    productos[index].cantidad
  );
  if (nuevaCantidad !== null && !isNaN(nuevaCantidad)) {
    productos[index].cantidad = parseInt(nuevaCantidad);
    actualizarInventario();
    mostrarModal(
      `Cantidad de ${productos[index].nombre} actualizada a ${productos[index].cantidad}`
    );
  } else {
    mostrarModal("Cantidad inválida, intente de nuevo.");
  }
}

// ELIMINAR PRODUCTO
function eliminarProducto(index) {
  const confirmado = confirm(
    `¿Está seguro que desea eliminar ${productos[index].nombre}?`
  );
  if (confirmado) {
    const nombre = productos[index].nombre;
    productos.splice(index, 1);
    actualizarInventario();
    mostrarModal(`${nombre} ha sido eliminado del inventario.`);
  }
}
