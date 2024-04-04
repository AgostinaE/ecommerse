let productosEnCarritoIds = localStorage.getItem("productos-en-carrito");
productosEnCarritoIds = JSON.parse(productosEnCarritoIds) || [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar;

async function cargarProductosCarrito() {
    if (productosEnCarritoIds.length > 0) {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const productosAPI = await response.json();

            const productosEnCarritoAPI = productosAPI.filter(producto => productosEnCarritoIds.includes(producto.id));

            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.remove("disabled");
            contenedorCarritoAcciones.classList.remove("disabled");
            contenedorCarritoComprado.classList.add("disabled");

            contenedorCarritoProductos.innerHTML = "";
            for (const productId of productosEnCarritoIds) {
                const product = await getProductById(productId);
                const productDiv = createProductDiv(product);
                contenedorCarritoProductos.appendChild(productDiv);
            }

            productosEnCarritoAPI.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("carrito-producto");
                div.innerHTML = `
                    <img class="carrito-producto-imagen" src="${producto.image}" alt="${producto.title}">
                    <div class="carrito-producto-titulo">
                        <small>Título</small>
                        <h3>${producto.title}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p>1</p> <!-- Cantidad del producto en el carrito -->
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <p>$${producto.price}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p>$${producto.price}</p> <!-- Subtotal del producto (precio * cantidad) -->
                    </div>
                    <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                `;

                contenedorCarritoProductos.appendChild(div);
            });

            actualizarBotonesEliminar();
            actualizarTotal();
        } catch (error) {
            console.error('Error al cargar productos del carrito:', error);
        }
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarritoIds.findIndex(id => id === idBoton);
    if (index !== -1) {
        productosEnCarritoIds.splice(index, 1);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarritoIds));
        cargarProductosCarrito();
    }
}

const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarritoIds.length} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarritoIds = [];
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarritoIds));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarritoIds.reduce((total, id) => {
        const producto = getProductById(id);
        return total + producto.price;
    }, 0);
    const contenedorTotal = document.querySelector("#total");
    contenedorTotal.innerText = `$${totalCalculado.toFixed(2)}`;
}

async function getProductById(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const producto = await response.json();
        return producto;
    } catch (error) {
        console.error('Error al obtener el producto:', error);
    }
}

const botonComprar = document.querySelector("#carrito-acciones-comprar");
botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    Swal.fire({
        title: 'Compra realizada',
        text: 'Gracias por tu compra.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
    productosEnCarritoIds = [];
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarritoIds));
    cargarProductosCarrito();
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id.toString(); // Convertir a cadena
    const index = productosEnCarritoIds.findIndex(id => id === idBoton);
    if (index !== -1) {
        productosEnCarritoIds.splice(index, 1);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarritoIds));
        cargarProductosCarrito();
    }
}
