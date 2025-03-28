// Cart and Favorites functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
let favorites = new Set(JSON.parse(localStorage.getItem("favorites")) || []);

// Function to add item to cart
function addToCart(productName, price, imgSrc) {
  const item = {
    name: productName,
    price: price,
    image: imgSrc || "img/default.jpg",
    quantity: 1,
  };

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.name === productName
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity++;
    cart[existingItemIndex].price += price;
  } else {
    cart.push(item);
  }

  cartTotal += price;
  updateCartUI();
  showNotification(`${productName} added to cart!`);
}

// Function to remove item from cart
function removeFromCart(index) {
  if (cart[index]) {
    cartTotal -= cart[index].price;
    cart.splice(index, 1);
    updateCartUI();
    showNotification("Item removed from cart!");
    closeCart();
    openCart(); // Refresh cart display
  }
}

// Function to toggle favorite
function toggleFavorite(button) {
  const productCard = button.closest(".slide") || button.closest(".box");
  if (!productCard) return;

  const productName = productCard.querySelector("h3").textContent;
  const priceText = productCard.querySelector(".price").textContent;
  const price = parseFloat(priceText.split("Rs.")[1].split(" ")[0]);
  const imgSrc = productCard.querySelector("img").src;

  if (favorites.has(productName)) {
    favorites.delete(productName);
    button.classList.remove("fas");
    button.classList.add("far");
    showNotification("Removed from favorites!");
  } else {
    favorites.add(productName);
    button.classList.remove("far");
    button.classList.add("fas");
    showNotification("Added to favorites!");
  }

  // Store favorite item details
  localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
}

// Function to update cart UI
function updateCartUI() {
  const cartCounts = document.querySelectorAll(".cart-count");
  if (cartCounts) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounts.forEach((count) => (count.textContent = totalItems));
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", cartTotal);
}

// Function to show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to open cart modal
function openCart() {
  const cartModal = document.createElement("div");
  cartModal.className = "cart-modal";

  let cartContent = `
    <div class="cart-content">
      <h2>Shopping Cart</h2>
      <div class="cart-items">`;

  if (cart.length === 0) {
    cartContent += `<p class="empty-cart">Your cart is empty!</p>`;
  } else {
    cart.forEach((item, index) => {
      cartContent += `
        <div class="cart-item">
          <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">Quantity: ${item.quantity}</span>
            <span class="item-price">Rs.${item.price.toFixed(2)}</span>
          </div>
          <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
        </div>`;
    });
  }

  cartContent += `
      </div>
      <div class="cart-total">
        <h3>Total: Rs.${cartTotal.toFixed(2)}</h3>
        ${
          cart.length > 0
            ? '<button onclick="checkout()" class="checkout-btn">Checkout</button>'
            : ""
        }
      </div>
      <button onclick="closeCart()" class="close-cart">Close</button>
    </div>`;

  cartModal.innerHTML = cartContent;
  document.body.appendChild(cartModal);
}

// Function to close cart modal
function closeCart() {
  const cartModal = document.querySelector(".cart-modal");
  if (cartModal) {
    cartModal.remove();
  }
}

// Function to handle checkout
function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!");
    return;
  }
  showNotification("Order placed successfully!");
  cart = [];
  cartTotal = 0;
  updateCartUI();
  closeCart();
}

// Function to open favorites modal
function openFavorites() {
  const favoriteItems = Array.from(favorites);
  const favoritesModal = document.createElement("div");
  favoritesModal.className = "favorites-modal";

  let modalContent = `
      <div class="favorites-content">
          <h2>Your Favorites</h2>
          <div class="favorites-items">`;

  if (favoriteItems.length === 0) {
    modalContent += `<p class="empty-message">No favorite items yet!</p>`;
  } else {
    favoriteItems.forEach((item) => {
      modalContent += `
          <div class="favorite-item">
              <span>${item}</span>
              <button onclick="removeFavorite('${item}')" class="remove-btn">Remove</button>
          </div>`;
    });
  }

  modalContent += `
      </div>
      <button onclick="closeFavorites()" class="close-favorites">Close</button>
  </div>`;

  favoritesModal.innerHTML = modalContent;
  document.body.appendChild(favoritesModal);
}

// Function to remove item from favorites
function removeFavorite(productName) {
  favorites.delete(productName);
  localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  showNotification("Removed from favorites!");
  // Refresh the favorites modal
  const modal = document.querySelector(".favorites-modal");
  if (modal) {
    modal.remove();
    openFavorites();
  }
  // Update heart icon in product card if visible
  document.querySelectorAll(".slide, .box").forEach((card) => {
    const name = card.querySelector("h3").textContent;
    const heartIcon = card.querySelector(".fa-heart");
    if (name === productName && heartIcon) {
      heartIcon.classList.remove("fas");
      heartIcon.classList.add("far");
    }
  });
}

// Function to close favorites modal
function closeFavorites() {
  const favoritesModal = document.querySelector(".favorites-modal");
  if (favoritesModal) {
    favoritesModal.remove();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load saved cart and favorites
  updateCartUI();

  // Add click event for cart icon
  const cartIcons = document.querySelectorAll(".fa-shopping-cart");
  cartIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  });

  // Add click events to all "add to cart" buttons
  document.querySelectorAll(".btn").forEach((button) => {
    if (button.textContent.trim().toLowerCase() === "add to cart") {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productCard = button.closest(".slide") || button.closest(".box");

        if (productCard) {
          const productName = productCard.querySelector("h3").textContent;
          const priceText = productCard.querySelector(".price").textContent;
          const priceMatch = priceText.match(/Rs\.([\d.]+)/);
          const imgElement = productCard.querySelector("img");
          const imgSrc = imgElement ? imgElement.src : null;

          if (priceMatch) {
            const price = parseFloat(priceMatch[1]);
            addToCart(productName, price, imgSrc);
          } else {
            showNotification(
              "Error: Could not add item to cart. Invalid price format."
            );
          }
        } else {
          showNotification(
            "Error: Could not add item to cart. Product information not found."
          );
        }
      });
    }
  });

  // Add click events to all favorite buttons
  document.querySelectorAll(".fa-heart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFavorite(button);
    });
  });

  // Add click event for favorites icon in header
  const favoritesIcon = document.querySelector(".icons .fa-heart");
  if (favoritesIcon) {
    favoritesIcon.addEventListener("click", (e) => {
      e.preventDefault();
      openFavorites();
    });
  }

  // Update heart icons for saved favorites
  document.querySelectorAll(".slide, .box").forEach((card) => {
    const name = card.querySelector("h3").textContent;
    const heartIcon = card.querySelector(".fa-heart");
    if (favorites.has(name) && heartIcon) {
      heartIcon.classList.remove("far");
      heartIcon.classList.add("fas");
    }
  });

  // Initialize product slider
  const productSwiper = new Swiper(".product-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });

  // Initialize review slider
  const reviewSwiper = new Swiper(".review-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
    },
  });

  // Night mode functionality
  const themeToggler = document.querySelector("#theme-toggler");
  const body = document.querySelector("body");

  // Check for saved theme preference
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    themeToggler.classList.remove("fa-moon");
    themeToggler.classList.add("fa-sun");
  }

  themeToggler.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
      localStorage.setItem("theme", "dark");
      themeToggler.classList.remove("fa-moon");
      themeToggler.classList.add("fa-sun");
    } else {
      localStorage.setItem("theme", "light");
      themeToggler.classList.remove("fa-sun");
      themeToggler.classList.add("fa-moon");
    }
  });

  // Navbar toggle functionality
  const menuBar = document.querySelector("#menu-bar");
  const navbar = document.querySelector(".navbar");
  const closeBtn = document.querySelector("#close");
  const overlay = document.querySelector(".navbar-overlay");

  menuBar.addEventListener("click", () => {
    navbar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when navbar is open
  });

  closeBtn.addEventListener("click", () => {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling when navbar is closed
  });

  overlay.addEventListener("click", () => {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close navbar when clicking on a link
  document.querySelectorAll(".navbar .links a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
      navbar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Countdown timer functionality
  function updateCountdown() {
    // Set target date to 7 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 999); // End of the day

    function update() {
      const now = new Date();
      const diff = targetDate - now;

      // Check if countdown has ended
      if (diff <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
      }

      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Update the display with padded numbers
      document.getElementById("days").textContent = String(days).padStart(
        2,
        "0"
      );
      document.getElementById("hours").textContent = String(hours).padStart(
        2,
        "0"
      );
      document.getElementById("minutes").textContent = String(minutes).padStart(
        2,
        "0"
      );
      document.getElementById("seconds").textContent = String(seconds).padStart(
        2,
        "0"
      );
    }

    // Update immediately and then every second
    update();
    setInterval(update, 1000);
  }

  // Initialize countdown when DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    updateCountdown();
    // ... rest of your DOMContentLoaded code ...
  });

  // Scroll to top button
  const scrollBtn = document.querySelector(".scroll-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("active");
    } else {
      scrollBtn.classList.remove("active");
    }
  });

  // Add click event for scroll to top button
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
