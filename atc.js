let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

let products = [
    {
        id: 1,
        name: 'Relive kenit sneakers',
        image: 'Relive kenit sneakers.jpg',
        price: 1200
    },
    {
        id: 2,
        name: 'Mens sneakers Classic casuals',
        image: '/p2.PNG',
        price: 1200
    },
    {
        id: 3,
        name: 'Womens sneakers classic casuals',
        image: 'p4.jfif',
        price: 2200
    },
    {
        id: 4,
        name: 'Everyday Knit sneakers',
        image: 'p5.jpg',
        price: 1230
    },
    {
        id: 5,
        name: 'Puma static lace-up sneakers',
        image: 'p6.jpg',
        price: 3200
    },
    {
        id: 6,
        name: 'Eco slides',
        image: 'eco_slides.jpg',
        price: 1200
    },
    {
        id: 7,
        name: 'Eco flips',
        image: 'eco_flips.jpg',
        price: 1230
    },
    {
        id: 8,
        name: 'cotton classic sneakers',
        image: 'cotton_classic_sneakers.jpg',
        price: 3200
    },
    {
        id: 9,
        name: 'cotton classic exclusive series',
        image: 'cotton_classic_sneakers2.jpg',
        price: 1200
    },
{
        id: 10,
        name: 'Relive kenit sneakers',
        image: 'Relive kenit sneakers.jpg',
        price: 1200
    },
    {
        id: 11,
        name: 'Mens sneakers Classic casuals',
        image: '/p2.PNG',
        price: 1200
    },
    {
        id: 12,
        name: 'Womens sneakers classic casuals',
        image: 'p4.jfif',
        price: 2200
    },
{
        id: 13,
        name: 'Relive kenit sneakers',
        image: 'Relive kenit sneakers.jpg',
        price: 1200
    },
    {
        id: 14,
        name: 'Mens sneakers Classic casuals',
        image: '/p2.PNG',
        price: 1200
    },
    {
        id: 15,
        name: 'Womens sneakers classic casuals',
        image: 'p4.jfif',
        price: 2200
    },
];
let listCards  = [];
function initApp(){
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="img/${value.image}">
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCart(${key})">Add To Cart</button>`;
            
        list.appendChild(newDiv);
    })
}
initApp();
function addToCard(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
    }
    reloadCard();
}
function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key)=>{
        totalPrice = totalPrice + value.price;
        count = count + value.quantity;
        if(value != null){
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="img/${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>`;
                listCard.appendChild(newDiv);
        }
    })
    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = count;
}
function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key].price = quantity * products[key].price;
    }
    reloadCard();
}