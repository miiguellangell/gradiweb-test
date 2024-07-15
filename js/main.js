document.addEventListener('DOMContentLoaded', () => {
	const endpoint = 'https://gradistore-spi.herokuapp.com/products/all';

	fetch(endpoint)
		.then(response => response.json())
		.then(data => {
			const products = data.products.nodes;
			const container = document.getElementById('product-container');

			products.forEach(product => {
				// Filtrar los tags numéricos
				const numericTags = product.tags
					.map(tag => parseFloat(tag))
					.filter(tag => !isNaN(tag));

				// Calcular el promedio si hay más de un valor numérico
				let averageTag = null;
				if (numericTags.length > 0) {
					const sum = numericTags.reduce((acc, tag) => acc + tag, 0);
					averageTag = Math.round(sum / numericTags.length); // Redondear al entero más cercano
				}

				// Calcular las estrellas
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

				// Aquí pasamos la info del producto a HTML 
				const slide = document.createElement('div');
				slide.className = 'swiper-slide'; // Asegúrate de que cada slide tenga esta clase

				slide.innerHTML = `
                <div class=" container product">
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

				// Añadir evento de clic para el botón "ADD TO CART"
				slide.querySelector('.addtocart').addEventListener('click', () => {
					showModal(product.title, product.prices.min.amount, product.featuredImage.url);
				});
			});

			// Initialize Swiper
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

	// Función para mostrar el modal con los detalles del producto
	function showModal(productName, productPrice, productImage) {
		const modal = document.getElementById('productModal');
		const button = document.getElementsByClassName('close')[0];

		// Llenar el contenido del modal con los detalles del producto
		document.getElementById('modalProductName').innerText = `${productName}`;
		document.getElementById('modalProductPrice').innerText = `Precio: €${productPrice}`;
		document.getElementById('modalProductImage').src = productImage;

		// Mostrar el modal
		modal.style.display = 'block';

		// Cuando el usuario hace clic en <span> (x), cerrar el modal
		button.onclick = function() {
			modal.style.display = 'none';
		}

		// Cuando el usuario hace clic en cualquier lugar fuera del modal, cerrar el modal
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = 'none';
			}
		}
	}
});