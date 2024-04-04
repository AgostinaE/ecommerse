const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

// Función para agregar productos al carrito
async function agregarAlCarrito(event) {
    const productId = event.target.id;
    let cantidadProductosCarrito = parseInt(numerito.innerText) || 0;
    cantidadProductosCarrito++;
    numerito.innerText = cantidadProductosCarrito;
    
    try {
        const product = await getProductById(productId);
        productosEnCarrito.push(product);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
    }
    
}

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(async (products) => {
        // Mostrar los productos en la página
        await displayProducts(products);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });

async function displayProducts(products) {
    contenedorProductos.innerHTML = "";
    let totalCarrito = 0;

    for (const product of products) {
        const productDiv = createProductDiv(product);
        contenedorProductos.appendChild(productDiv);
        totalCarrito += product.price;
    }

    // Selección de los botones de agregar productos al carrito
    const botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

    // Mostrar el total del carrito
    const contenedorTotal = document.querySelector("#total");
    contenedorTotal.innerText = `$${totalCarrito}`;
}

function createProductDiv(product) {
    const div = document.createElement("div");
    div.classList.add("producto");

    // Si el producto está en oferta, resaltar visualmente
    if (product.isOnSale) {
        div.classList.add("producto-en-oferta");
    }

    div.innerHTML = `
        <div class="producto-imagen">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="producto-detalles">
            <h3 class="producto-titulo">${product.title}</h3>
            <p class="producto-precio">$${product.price}</p>
            <p class="producto-descripcion">${product.description.substring(0, 30)}</p>
            <button class="producto-agregar" id="${product.id}">Agregar</button>
        </div>
    `;

    return div;
}
displayProducts();
