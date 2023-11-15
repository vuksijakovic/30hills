let array = [];
let ucitano = false;
let cart = [];
let totalPrice = 0;
let categories = [];
let asc = 0;
let desc = 0;

function fetchData() {
  return new Promise((resolve, reject) => {
    fetch('/fetch-products')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => fetch('/get-products'))
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(productsArray => {
        array = productsArray;
        ucitano = true;
        resolve(array);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function fetchDataAndGenerateCards() {
  fetchData()
    .then(() => {
      
    

      const container = document.getElementById('productContainer');

   
      container.innerHTML = '';
      if(asc==1) {
        array.sort((a, b) => a.price - b.price);
      }
      else if(desc==1) {
        array.sort((a, b) => b.price - a.price);
      }
  
      dropdown = document.getElementById('categoryDropdown');
      opcija = dropdown.options[dropdown.selectedIndex];
      vrijednost = opcija.value;
      search = document.getElementById('search');
      rez = search.value.toLowerCase();
      console.log(rez);
      if(vrijednost=="All categories") {
        array.forEach(product => {
          if((rez.trim().length==0 || rez == "") || (product.name.toLowerCase().includes(rez) || product.description.toLowerCase().includes(rez))) {
           
          const card = document.createElement('div');
          card.classList.add('card', 'm-2', 'p-3', 'col-md-12'); 
  
                
          if (product.images && product.images.length > 0) {
          
            const img = document.createElement('img');
            img.src = product.images[0];
            img.classList.add('card-img-top', 'img-fluid');  
            card.appendChild(img);
          }
  
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
  
          cardBody.innerHTML = `
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Category: ${product.category}</p>
            <p class="card-text">${product.description}</p>
            
            <p class="card-text">Price: $${product.price}</p>
            
            <button class="btn btn-primary" onclick="productPage('${product.id}')">Learn More</button>

            
            
            <button class="btn btn-success" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
          `;
  
       
          card.appendChild(cardBody);
  
        
          container.appendChild(card);
          }
        });
      }
      else {
        array.forEach(product => {
          if(product.category==vrijednost && ((rez.trim().length==0 || rez == "") || (product.name.toLowerCase().includes(rez) || product.description.toLowerCase().includes(rez)))){  
         
          const card = document.createElement('div');
          card.classList.add('card', 'm-2', 'p-3', 'col-md-12'); 
  
    
          if (product.images && product.images.length > 0) {
           
            const img = document.createElement('img');
            img.src = product.images[0];
            img.classList.add('card-img-top', 'img-fluid'); 
            card.appendChild(img);
          }
  
          
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
  
          cardBody.innerHTML = `
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Category: ${product.category}</p>
            <p class="card-text">${product.description}</p>
            
            <p class="card-text">Price: $${product.price}</p>
            
            <button class="btn btn-primary" onclick="productPage('${product.id}')">Learn More</button>
            
          
            <button class="btn btn-success" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
          `;
  
         
          card.appendChild(cardBody);
  
    
          container.appendChild(card);
      }});
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
}
function productPage(id) {

  window.location.href = "product-page.html?id="+id;
}
function dropDown() {
  fetchData().then(()=>{
    categories = [];
    array.forEach(product =>{
      if(!categories.includes(product.category)) {
        categories.push(product.category);
      }
    })
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.innerHTML='';
    const option = document.createElement('option');
    option.value = 'All categories';
    option.text = 'All categories';
    dropdown.add(option);
    categories.forEach(category=>{
      const option = document.createElement('option');
    option.value = category;
    option.text = category;
    dropdown.add(option);
    })
    console.log(categories); 
  })
}
function sortAsc() {
  asc = 1;
  desc = 0;
  fetchDataAndGenerateCards();
}
function sortDesc() {
  desc = 1;
  asc = 0;
  fetchDataAndGenerateCards();
}

function addToCart(productId, productName, productPrice) {
  loadCartFromStorage();
  const product = {
    id: productId,
    name: productName,
    price: productPrice,
  };
  cart.push(product);
  updateCart();
  saveCartToStorage();
}
function removeFromCart(productId) {

  const index = cart.findIndex(item => item.id === productId);

  if (index !== -1) {
  
    const removedItem = cart.splice(index, 1)[0];
    totalPrice -= removedItem.price;
 
    updateCart();
    saveCartToStorage();
  }
}
function updateCart() {
  const cartContainer = document.getElementById('cartContainer');
  const totalPriceContainer = document.getElementById('totalPrice');

 
  cartContainer.innerHTML   = '';

  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item', 'p-2');
    cartItem.innerHTML = `${item.name} - $${item.price.toFixed(2)} -     <button class="btn btn-danger btn-sm ms-2" onclick="removeFromCart('${item.id}')">Remove</button>`;
    cartContainer.appendChild(cartItem);
  });

 
  totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  totalPriceContainer.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
}

function loadCartFromStorage() {
  const storedCart = localStorage.getItem('cart');
  const storedTotalPrice = localStorage.getItem('totalPrice');

  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  if (storedTotalPrice) {
    totalPrice = JSON.parse(storedTotalPrice);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  dropDown();
  fetchDataAndGenerateCards();
  loadCartFromStorage();
  updateCart();
});
