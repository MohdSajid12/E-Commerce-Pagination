const cart_items = document.querySelector('#cart .cart-items');
// paginations1

const btnsub = document.querySelector('.paginations1');
btnsub.addEventListener('click',(e)=>{

    if(e.target.id=="?page=0"||e.target.id=="?page=1"||e.target.id=="?page=2"){
        axios.get(`http://localhost:3000/products${e.target.id}`) .then((data) => {
            console.log(data.data);
                const products = data.data;
                let productHtml="";
                const parentSection = document.getElementById('products');
                products.forEach(product =>{
                     productHtml += `<div>
                    <h1> ${product.title}</h1>
                    <img src=${product.imageUrl}></img>
                    <button onclick ="addToCart(${product.id})">Add to Cart</button>
                    </div>`
                })
            
                parentSection.innerHTML =productHtml;

        })    
    

    }
})

const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click',(e)=>{
console.log(e.target.className );
     if (e.target.className=='shop-item-button'){
        const id = e.target.parentNode.parentNode.id
        if (document.querySelector(`#in-cart-${id}`)){
            alert('This item is already added to the cart');
            return
        }
        // console.log(e.target.parentNode.parentNode.id);
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        let total_cart_price = document.querySelector('#total-value').innerText;
    
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1;
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${id}`);
        total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
        total_cart_price = total_cart_price.toFixed(2);
        document.querySelector('#total-value').innerText = `${total_cart_price}`;

        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
            
    </span>
    <span class='cart-price cart-column'>${price}</span>
    <span class='cart-quantity cart-column'>
        <input type="text" value="1">
        <button>REMOVE</button>
    </span>`
        cart_items.appendChild(cart_item)
        const container = document.getElementById('container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        container.appendChild(notification);
        setTimeout(()=>{
            notification.remove();
        },2500)
    }



    if (
    e.target.className=="cart-btn-bottom" || 
    e.target.className=="cart-bottom" || 
    e.target.className=="cart-holder"){
        getCartDetailes();
        
    }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;" //not shows on browser
    }
    if (e.target.className=='purchase-btn'){
        if (parseInt(document.querySelector('.cart-number').innerText) === 0){
            alert('You have Nothing in Cart , Add some products to purchase !');
            return
        }
        alert('Thanks for the purchase')
        cart_items.innerHTML = ""
        document.querySelector('.cart-number').innerText = 0
        document.querySelector('#total-value').innerText = `0`;
    }

    if (e.target.innerText=='REMOVE'){
        let total_cart_price = document.querySelector('#total-value').innerText;
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1;
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
        e.target.parentNode.parentNode.remove()
    }
})




window.addEventListener('DOMContentLoaded', () =>{
    axios.get(`http://localhost:3000/products?page=0`) .then((data) => {
        console.log(data.data);
            const products = data.data;
            const parentSection = document.getElementById('products');
            let productHtml="";
            products.forEach(product =>{
                 productHtml += `<div>
                <h1> ${product.title}</h1>
                <img src=${product.imageUrl}></img>
                <button onclick ="addToCart(${product.id})">Add to Cart</button>
                </div>`
            })
            parentSection.innerHTML =productHtml;

        
    })    
})


function addToCart(productId){
    axios.post('http://localhost:3000/cart' , {productId : productId})

    
    .then(response => {
      if(response.status === 200){
        axios.get('http://localhost:3000/cart')
    .then(response =>{
    })
    .catch((err) => {
        console.log(err)
    });

          notifyUsers(response.data.message);
      }
    })
    .catch((err) => {
      notifyUsers(err)
    })   
  }
  
function getCartDetailes(){
    axios.get('http://localhost:3000/cart')
    .then(response =>{
        // console.log(response)
        if(response.status === 200){
            response.data.products.forEach(product =>{
                const cartContainer = document.getElementById('cart');
                cartContainer.innerHTML += `<li>  ${product.title} - ${product.cartItem.quantity}- ${product.price}}</li>`
            })
            document.querySelector('#cart').style = "display:block;" // shows on browser
        }
        // console.log(response)
    })
    .catch((err) => {
        console.log(err)
    });
}

  function notifyUsers(message){
    const container = document.getElementById("container");
      const notification = document.createElement("div");
      notification.classList.add("notification");
      notification.innerHTML = `<h4>${message}<h4>`;
      container.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 2500);
  }