document.addEventListener('DOMContentLoaded', function() {
    // Inicialmente ocultar los divs de previsualización de color
    const colorPreviews = document.querySelectorAll('.color-preview');
    colorPreviews.forEach(preview => {
        preview.style.display = 'none';
    });
    
    // Manejo de las preguntas frecuentes
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar todos los items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar el estado activo del ítem actual
            item.classList.toggle('active');
        });
    });
    
    // Inicializar las preguntas frecuentes (abrir la primera por defecto)
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
    
    // Navegación móvil
    const menuItems = document.querySelectorAll('.menu > li');
    
    if (window.innerWidth <= 768) {
        menuItems.forEach(item => {
            if (item.querySelector('.submenu')) {
                const link = item.querySelector('a');
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('submenu-open');
                    
                    const submenu = item.querySelector('.submenu');
                    if (submenu.style.display === 'block') {
                        submenu.style.display = 'none';
                    } else {
                        submenu.style.display = 'block';
                    }
                });
            }
        });
    }
    
    // Slider de testimonios automático
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        if (window.innerWidth <= 768) {
            // En móvil mostrar solo un testimonio a la vez
            testimonials[index].style.display = 'block';
        } else {
            // En desktop mostrar todos los testimonios
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'block';
            });
        }
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    // Inicializar el slider de testimonios en móvil
    if (window.innerWidth <= 768 && testimonials.length > 0) {
        showTestimonial(currentIndex);
        setInterval(nextTestimonial, 5000);
    }
    
    // Funcionalidad del carrito de compras
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const cartInfoText = document.querySelector('.cart-info p');
    
    // Modal de checkout
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModal = document.getElementById('close-modal');
    const openCheckout = document.getElementById('open-checkout');
    const checkoutCartItems = document.getElementById('checkout-cart-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Abrir modal de checkout
    openCheckout.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Verificar si hay productos en el carrito
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Por favor añade productos antes de continuar.');
            return;
        }
        
        // Abrir el modal
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll en el body
        
        // Llenar los items del checkout
        updateCheckoutItems();
    });
    
    // Cerrar modal de checkout
    closeModal.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    });
    
    // Cerrar modal si se hace clic fuera del contenido
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Actualizar la visualización de items en el checkout
    function updateCheckoutItems() {
        checkoutCartItems.innerHTML = '';
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-cart-item';
            
            itemElement.innerHTML = `
                <div class="checkout-item-details">
                    <div class="checkout-item-title">${item.product}</div>
                    <div class="checkout-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="checkout-item-options">${item.options}</div>
                    <div class="checkout-item-quantity">
                        <button class="quantity-button decrease-quantity" data-index="${index}">-</button>
                        <input type="text" class="quantity-value" value="${item.quantity}" readonly>
                        <button class="quantity-button increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="checkout-item-total">$${itemTotal.toFixed(2)}</div>
            `;
            
            checkoutCartItems.appendChild(itemElement);
        });
        
        // Actualizar el total
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
        
        // Añadir event listeners a los botones de cantidad
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCartDisplay();
                    updateCheckoutItems();
                }
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCartDisplay();
                updateCheckoutItems();
            });
        });
    }
    
    // Enviar formulario de checkout
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!checkoutForm.checkValidity()) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }
        
        // Simular procesamiento del pedido
        alert('¡Gracias por tu compra! Tu pedido ha sido procesado correctamente.');
        
        // Vaciar carrito
        cart = [];
        updateCartDisplay();
        
        // Cerrar modal
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Actualizar la visualización del carrito
    function updateCartDisplay() {
        // Actualizar el contenedor de items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartInfoText.style.display = 'block';
            cartInfoText.textContent = 'Tu carrito está vacío';
            cartTotal.textContent = '$0.00';
            cartCount.textContent = '0';
            return;
        }
        
        // Ocultar el mensaje de carrito vacío
        cartInfoText.style.display = 'none';
        
        // Calcular el total
        let total = 0;
        
        // Generar HTML para cada item
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.product}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="cart-item-options">${item.options}</div>
                </div>
                <div class="cart-item-remove" data-index="${index}">×</div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Actualizar el total y el contador
        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    // Añadir item al carrito
    function addToCart(product, price, options = '', quantity = 1) {
        // Buscar si el producto ya existe en el carrito con las mismas opciones
        const existingItemIndex = cart.findIndex(item => 
            item.product === product && item.options === options
        );
        
        if (existingItemIndex !== -1) {
            // Si existe, incrementar la cantidad
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Si no existe, añadir nuevo item
            cart.push({
                product,
                price,
                options,
                quantity
            });
        }
        
        // Actualizar la visualización del carrito
        updateCartDisplay();
        
        // Mostrar mensaje de confirmación
        alert(`¡${product} añadido al carrito!`);
    }
    
    // Eliminar item del carrito
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
    
    // Abrir y cerrar el carrito al hacer clic en el icono
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartDropdown.classList.toggle('active');
    });
    
    // Cerrar el carrito al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });
    
    // Event listener para botones "Añadir al carrito" de los productos destacados
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(product, price);
        });
    });
    
    // Funcionalidad del personalizador de uniforme
    const colorOptions = document.querySelectorAll('.color-option');
    const pocketOptions = document.querySelectorAll('.pocket-option input[type="checkbox"]');
    const shirtPreview = document.getElementById('shirt-preview');
    const pantsPreview = document.getElementById('pants-preview');
    const pantsNoPoket = document.getElementById('pants-no-pocket');
    const shirtColorPreview = document.getElementById('shirt-color-preview');
    const pantsColorPreview = document.getElementById('pants-color-preview');
    
    // Función para actualizar la visualización del color seleccionado
    function updateProductColor(color) {
        // Obtener el color de fondo del botón seleccionado
        const selectedButton = document.querySelector(`.color-option[data-color="${color}"]`);
        const backgroundColor = selectedButton.style.backgroundColor;
        
        // Actualizar los divs de previsualización de color
        if (shirtColorPreview) {
            shirtColorPreview.style.backgroundColor = backgroundColor;
            shirtColorPreview.style.display = 'block';
        }
        
        if (pantsColorPreview) {
            pantsColorPreview.style.backgroundColor = backgroundColor;
            pantsColorPreview.style.display = 'block';
        }
        
        // Actualizar estado activo en los botones de color
        colorOptions.forEach(option => {
            if (option.getAttribute('data-color') === color) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Notificar al usuario
        console.log(`Color seleccionado: ${color}`);
    }
    
    // Manejo de selección de color
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.getAttribute('data-color');
            updateProductColor(color);
        });
    });
    
    // Función para actualizar la imagen de la playera según las opciones de bolsillos
    function updateShirtImage() {
        // Verificar qué opciones están seleccionadas
        const chestPocket = document.getElementById('chest-pocket').checked;
        const sidePockets = document.getElementById('side-pockets').checked;
        
        // Seleccionar la imagen adecuada según las opciones
        if (chestPocket && sidePockets) {
            shirtPreview.src = "1Bolsa_Pecho y laterales.png";
        } else if (chestPocket) {
            shirtPreview.src = "1Bolsa_Pecho.png";
        } else if (sidePockets) {
            shirtPreview.src = "1Bolsa_Laterales.png";
        } else {
            // Si no hay bolsillos seleccionados, volver a la imagen original
            shirtPreview.src = "1.png";
        }
    }
    
    // Función para actualizar la imagen del pantalón según las opciones de bolsillos
    function updatePantsImage() {
        // Verificar si el bolsillo del pantalón está seleccionado
        const pantsPocket = document.getElementById('pants-pocket').checked;
        
        if (pantsPocket) {
            pantsPreview.style.display = 'block';
            pantsNoPoket.style.display = 'none';
        } else {
            pantsPreview.style.display = 'none';
            pantsNoPoket.style.display = 'block';
        }
    }
    
    // Simular cambios en los bolsillos
    pocketOptions.forEach(option => {
        option.addEventListener('change', () => {
            const pocketType = option.id;
            const isChecked = option.checked;
            
            // Actualizar las imágenes según lo que se marcó
            if (pocketType === 'pants-pocket') {
                updatePantsImage();
            } else {
                updateShirtImage();
            }
            
            // Notificar al usuario con un mensaje visual
            const optionGroup = option.closest('.option-group');
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `${isChecked ? 'Añadido' : 'Eliminado'}: ${option.parentElement.textContent.trim()}`;
            notification.style.color = isChecked ? 'green' : 'red';
            notification.style.fontSize = '0.9rem';
            notification.style.marginTop = '5px';
            
            // Eliminar notificaciones anteriores
            const prevNotification = optionGroup.querySelector('.notification');
            if (prevNotification) {
                optionGroup.removeChild(prevNotification);
            }
            
            optionGroup.appendChild(notification);
            
            // Auto-eliminar la notificación después de 3 segundos
            setTimeout(() => {
                if (optionGroup.contains(notification)) {
                    optionGroup.removeChild(notification);
                }
            }, 3000);
        });
    });
    
    // Inicializar el estado inicial de los pantalones (con bolsillo está marcado por defecto)
    updatePantsImage();
    
    // Botón de añadir al carrito personalizado
    const addToCartBtn = document.getElementById('add-to-cart-custom');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Verificar si se ha seleccionado un color
            const selectedColorElement = document.querySelector('.color-option.active');
            
            if (!selectedColorElement) {
                alert('Por favor, selecciona un color antes de añadir al carrito.');
                return;
            }
            
            // Obtener selecciones actuales
            const selectedColor = selectedColorElement.getAttribute('data-color');
            const selectedPockets = Array.from(document.querySelectorAll('.pocket-option input:checked')).map(input => input.id);
            
            // Crear opciones de texto
            let options = `Color: ${selectedColor}`;
            if (selectedPockets.length > 0) {
                options += `, Bolsillos: ${selectedPockets.join(', ')}`;
            }
            
            // Añadir al carrito (playera y pantalón como productos separados)
            addToCart('Playera Personalizada', 450, options);
            addToCart('Pantalón Personalizado', 450, options);
        });
    }
    
    // Carrusel de imágenes para los productos destacados
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentSlide = 0;
        
        // Mostrar solo el slide actual
        function showSlide(index) {
            items.forEach((item, i) => {
                item.classList.remove('active');
                if (i === index) {
                    item.classList.add('active');
                }
            });
        }
        
        // Navegar al slide anterior
        function prevSlide() {
            currentSlide = (currentSlide - 1 + items.length) % items.length;
            showSlide(currentSlide);
        }
        
        // Navegar al siguiente slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % items.length;
            showSlide(currentSlide);
        }
        
        // Añadir event listeners a los botones
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Inicializar el carrusel
        showSlide(0);
    });
    
    // Inicializar el carrito
    updateCartDisplay();
    
    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // No aplicar a enlaces de submenu en móvil
            if (window.innerWidth <= 768 && this.closest('.menu > li') && this.closest('.menu > li').querySelector('.submenu')) {
                return;
            }
            
            const href = this.getAttribute('href');
            
            // Si es un enlace interno que apunta a un ID
            if (href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Funcionalidad de autenticación
    const loginButton = document.getElementById('login-button');
    const userWelcome = document.getElementById('user-welcome');
    const userName = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTabs = document.querySelectorAll('.login-tab');
    
    // Comprobar si hay un usuario en sesión
    function checkUserSession() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            showUserWelcome(user.name);
        }
    }
    
    // Mostrar mensaje de bienvenida
    function showUserWelcome(name) {
        loginButton.style.display = 'none';
        userWelcome.style.display = 'flex';
        userName.textContent = name;
    }
    
    // Abrir modal de login
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal de login
    closeLoginModal.addEventListener('click', function() {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Cerrar modal si se hace clic fuera
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Cambiar entre formularios de login y registro
    loginTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // Actualizar tabs activas
            loginTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar formulario correspondiente
            if (tabType === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                document.getElementById('login-modal-title').textContent = 'Iniciar Sesión';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                document.getElementById('login-modal-title').textContent = 'Registrarse';
            }
        });
    });
    
    // Procesar inicio de sesión
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('remember-me').checked;
        
        // Obtener usuarios registrados
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Buscar usuario
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Guardar sesión
            if (remember) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            // Mostrar mensaje de bienvenida
            showUserWelcome(user.name);
            
            // Cerrar modal
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Mensaje de éxito
            alert('¡Inicio de sesión exitoso!');
            
            // Limpiar formulario
            loginForm.reset();
        } else {
            alert('Correo electrónico o contraseña incorrectos');
        }
    });
    
    // Procesar registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Obtener usuarios registrados
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar si el correo ya está registrado
        if (users.some(u => u.email === email)) {
            alert('Este correo electrónico ya está registrado');
            return;
        }
        
        // Crear nuevo usuario
        const newUser = {
            name,
            email,
            password
        };
        
        // Guardar usuario
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Guardar sesión
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Mostrar mensaje de bienvenida
        showUserWelcome(name);
        
        // Cerrar modal
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Mensaje de éxito
        alert('¡Registro exitoso! Has iniciado sesión automáticamente.');
        
        // Limpiar formulario
        registerForm.reset();
    });
    
    // Cerrar sesión
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Eliminar sesión
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Mostrar botón de login
        loginButton.style.display = 'block';
        userWelcome.style.display = 'none';
        
        alert('Has cerrado sesión correctamente');
    });
    
    // Verificar si hay un usuario en sesión al cargar la página
    checkUserSession();
}); 