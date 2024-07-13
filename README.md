# Proyecto de E-commerce con Carrusel de Productos

Este proyecto es una prueba de un e-commerce que muestra productos en un carrusel utilizando Swiper.js y JavaScript Vanilla. Además, incluye un modal que muestra los detalles del producto al añadirlo al carrito.

## Características

- Carrusel de productos con Swiper.js.
- Calificación de productos con estrellas, incluyendo medias estrellas.
- Modal que muestra el nombre, precio e imagen del producto al hacer clic en "ADD TO CART".

## Tecnologías Utilizadas

- HTML
- CSS
- JavaScript Vanilla
- Swiper.js

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
Navega al directorio del proyecto:

bash
Copiar código
cd tu-repositorio
Abre el archivo index.html en tu navegador.

Uso
Abre index.html en tu navegador.
Navega por los productos en el carrusel.
Haz clic en "ADD TO CART" para ver los detalles del producto en un modal.
Código Principal
El código principal se encuentra en main.js. Aquí está el flujo principal del código:

Fetch de Productos: Obtiene los productos desde un endpoint y los muestra en el carrusel.
Cálculo de Estrellas: Calcula las estrellas basadas en los tags numéricos de los productos.
Mostrar Modal: Muestra un modal con el nombre, precio e imagen del producto al hacer clic en "ADD TO CART".
javascript
Copiar código
document.addEventListener('DOMContentLoaded', () => {
    const endpoint = 'https://gradistore-spi.herokuapp.com/products/all';

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const products = data.products.nodes;
            const container = document.getElementById('product-container');

            products.forEach(product => {
                const numericTags = product.tags
                    .map(tag => parseFloat(tag))
                    .filter(tag => !isNaN(tag));

                let averageTag = null;
                if (numericTags.length > 0) {
                    const sum = numericTags.reduce((acc, tag) => acc + tag, 0);
                    averageTag = Math.round(sum / numericTags.length);
                }

                let starsHtml = '';
                if (averageTag !== null) {
                    const fullStars = Math.floor(averageTag / 100);
                    const halfStar = averageTag % 100 >= 50 ? 1 : 0;

                    starsHtml += '<div class="stars">';
                    starsHtml += `${fullStars > 0 ? '<svg class="star star-full" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" fill="#FFC658"/></svg>'.repeat(fullStars) : ''}`;
                    starsHtml += `${halfStar ? '<svg class="star star-half" viewBox="0 0 24 24"><defs><linearGradient id="half-star" x1="0" x2="1" y1="0" y2="1"><stop offset="50%" stop-color="#FFC658"/><stop offset="50%" stop-color="#FFFFFF"/></linearGradient></defs><path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" fill="url(#half-star)" stroke="#FFC658" stroke-width="2"/></svg>' : ''}`;
                    starsHtml += `${5 - (fullStars + halfStar) > 0 ? '<svg class="star star-empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" fill="none" stroke="#FFC658" stroke-width="2"/></svg>'.repeat(5 - (fullStars + halfStar)) : ''}`;
                    starsHtml += `<span class="rating-number">${averageTag}</span>`;
                    starsHtml += '</div>';
                }

                const slide = document.createElement('div');
                slide.className = 'swiper-slide';

                slide.innerHTML = `
                <div class="container product">
                    <img class="swiper-lazy imagendeproducto" src="${product.featuredImage.url}" alt="${product.title}">
                    <div class="swiper-lazy-preloader"></div>
                    <button class="addtocart">ADD TO CART</button>
                    <div class="productinfo row row-cols-2">
                        <div class="col textoproducto">
                            <h3 class="product-title">${product.title}</h3>
                            ${starsHtml}
                        </div>
                        <div class="col precios">
                            <p class="sale">€${product.prices.min.amount}</p>
                            <p class="price">€${product.prices.min.amount}</p>
                        </div>
                    </div>
                </div>`;

                container.appendChild(slide);

                slide.querySelector('.addtocart').addEventListener('click', () => {
                    showModal(product.title, product.prices.min.amount, product.featuredImage.url);
                });
            });

            const swiper = new Swiper('.swiper-container', {
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.nextboton',
                    prevEl: '.prevboton',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                },
            });
        })
        .catch(error => console.error('Error fetching products:', error));

    function showModal(productName, productPrice, productImage) {
        const modal = document.getElementById('productModal');
        const span = document.getElementsByClassName('close')[0];

        document.getElementById('modalProductName').innerText = `Product: ${productName}`;
        document.getElementById('modalProductPrice').innerText = `Price: €${productPrice}`;
        document.getElementById('modalProductImage').src = productImage;

        modal.style.display = 'block';

        span.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
});
Estilo
Para el estilo de las estrellas y el modal, asegúrate de incluir las clases necesarias en tu CSS.

css
Copiar código
.star {
    width: 24px;
    height: 24px;
}

.star-full {
    fill: #FFC658;
}

.star-half {
    fill: url(#half-star);
}

.star-empty {
    fill: none;
    stroke: #FFC658;
    stroke-width: 2;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}
Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que desees hacer.

Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
