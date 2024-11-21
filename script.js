// Initialize data from localStorage or defaults
let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
];

// Save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('sales', JSON.stringify(sales));
  localStorage.setItem('users', JSON.stringify(users));
}

// Authentication: Login
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    document.getElementById('login-section').classList.add('hidden');
    if (user.role === 'admin') {
      document.getElementById('admin-section').classList.remove('hidden');
      displayInventory();
      displaySales();
    } else {
      document.getElementById('user-section').classList.remove('hidden');
      displayProducts();
    }
  } else {
    document.getElementById('login-error').textContent = 'Invalid username or password';
  }
});

// Registration: Add New User
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const role = 'user'; // Default role for new users

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    document.getElementById('register-error').textContent = 'Username already exists';
  } else {
    users.push({ username, password, role });
    saveToLocalStorage();
    alert('Registration successful! You can now log in.');
    e.target.reset();
    document.getElementById('register-error').textContent = '';
  }
});

// Logout Button
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('logout-btn-user').addEventListener('click', logout);

function logout() {
  document.getElementById('admin-section').classList.add('hidden');
  document.getElementById('user-section').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
}


// Admin: Add Product
document.getElementById('add-product-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value, 10);
  const image = document.getElementById('product-image').value;

  products.push({ name, price, stock, image });
  saveToLocalStorage(); // Save updated products to localStorage
  displayInventory();
  alert('Product added successfully!');
  e.target.reset();
});

function displayInventory() {
  const inventoryDiv = document.getElementById('inventory');
  inventoryDiv.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'inventory-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p>${product.name}</p>
      <p>Price: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
    `;
    inventoryDiv.appendChild(card);
  });
}

function displaySales() {
  const salesInventoryDiv = document.getElementById('sales-inventory');
  salesInventoryDiv.innerHTML = '';
  if (sales.length === 0) {
    salesInventoryDiv.textContent = 'No sales yet.';
    return;
  }
  sales.forEach(sale => {
    const card = document.createElement('div');
    card.className = 'inventory-card';
    card.innerHTML = `
      <p>${sale.name}</p>
      <p>Price: $${sale.price}</p>
    `;
    salesInventoryDiv.appendChild(card);
  });
}

// User: Display Products
function displayProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p>${product.name}</p>
      <p>Price: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <button ${product.stock === 0 ? 'disabled' : ''} onclick="addToCart(${index})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

// User: Add to Cart
function addToCart(index) {
  const product = products[index];
  if (product.stock > 0) {
    cart.push({ name: product.name, price: product.price });
    product.stock--;
    saveToLocalStorage(); // Save updated products and cart to localStorage
    displayProducts();
    updateCart();
  }
}

// User: Update Cart
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  saveToLocalStorage(); // Save updated cart to localStorage
}

// User: Remove from Cart
function removeFromCart(index) {
  const item = cart.splice(index, 1)[0];
  const product = products.find(p => p.name === item.name);
  if (product) product.stock++;
  saveToLocalStorage(); // Save updated cart and products to localStorage
  updateCart();
  displayProducts();
  
  // Initialize sales from localStorage or empty array
let sales = JSON.parse(localStorage.getItem('sales')) || [];

// Save sales to localStorage
function saveSalesToLocalStorage() {
  localStorage.setItem('sales', JSON.stringify(sales));
}
}

// User: Checkout
document.getElementById('checkout-btn').addEventListener('click', function () {
  if (cart.length > 0) {
    const timestamp = new Date().toLocaleString(); // Add timestamp here
// Add the timestamp to each item in the cart before pushing it to the sales array
cart.forEach(item => {
    sales.push({ 
      name: item.name, 
      price: item.price, 
      timestamp: timestamp 
    });
  });
    sales = [...sales, ...cart];
    cart = [];
    saveToLocalStorage(); // Save updated sales and clear cart in localStorage
    alert('Checkout successful!');
    updateCart();
    displaySales();
  } else {
    alert('Your cart is empty!');
  }
  
});
// Admin: Display Sales Inventory
function displaySales() {
    const salesInventoryDiv = document.getElementById('sales-inventory');
    salesInventoryDiv.innerHTML = '';
    if (sales.length === 0) {
      salesInventoryDiv.textContent = 'No sales yet.';
      return;
    }
  
    sales.forEach(sale => {
      const card = document.createElement('div');
      card.className = 'inventory-card';
      card.innerHTML = `
        <p><strong>Product:</strong> ${sale.name}</p>
        <p><strong>Price:</strong> $${sale.price}</p>
        <p><strong>Sold At:</strong> ${sale.timestamp}</p>
      `;
      salesInventoryDiv.appendChild(card);

    });
    function displayInventory() {
  const inventoryDiv = document.getElementById('inventory');
  inventoryDiv.innerHTML = '';
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'inventory-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p>${product.name}</p>
      <p>Price: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <button onclick="deleteProduct(${index})">Delete</button>
    `;
    inventoryDiv.appendChild(card);
  });
}

// Function to delete a product
function deleteProduct(index) {
  if (confirm('Are you sure you want to delete this product?')) {
    products.splice(index, 1); // Remove the product from the array
    saveToLocalStorage(); // Update local storage
    displayInventory(); // Refresh the inventory display
    alert('Product deleted successfully!');
  }
}

}

 // Call displaySales initially to load saved sales
  displaySales();
