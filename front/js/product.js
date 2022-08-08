//utilisation de urlsearchparams pour récupérer l'id du produit

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")
if (id != null) {
    let itemPrice = 0
    let imgUrl, altText
}

fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(res => handleData(res))


//fontion pour récupérer les infos produit

function handleData(produit) {
    console.log({ produit })

    const { altTxt, colors, description, imageUrl, name, price } = produit
    itemPrice = price
    imgUrl = imageUrl
    altText = altTxt
    makeImage(imageUrl, altTxt)
    makeTitle(name)
    makePrice(price)
    makeDescription(description)
    makeColors(colors)

    //const altTxt = produit.altTxt
    //const colors = produit.colors
    //const description = produit.description
    //const name = produit.name
    //const price = produit.price
    //const _id = produit._id
}

//func recup infos produit ( img, alt, title, price etc..)

function makeImage(imageUrl, altTxt) {
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)
}

function makeTitle(name) {
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}

function makePrice(price) {
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}

function makeDescription(description) {
    const p = document.querySelector("#description")
    if (p != null) p.textContent = description
}

function makeColors(colors) {
    const select = document.querySelector("#colors")
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild(option)
        });
    }
}


//const pour récupérer la couleur et quantité du produit

const button = document.querySelector("#addToCart")
button.addEventListener("click", handleClick)


function handleClick() {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value
    if (isOrderInvalid(color, quantity)) return
    saveOrder(color, quantity)
    redirectToCart()
}

//const pour recup toutes les infos necessaire ( dont price par l'API)
//fonction qui regroupe les infos

function saveOrder(color, quantity) {
    const data = {
        id: id,
        color: color,
        quantity: Number(quantity),
        price: itemPrice,
        imageUrl: imgUrl,
        altTxt: altText
    }
    localStorage.setItem(id, JSON.stringify(data))
}

//fonction pour verifier si une color et quantité à était choisis

function isOrderInvalid(color, quantity) {
    if (color == null || color === "" || quantity == null || quantity == 0) {
        alert("choisissez une couleur et une quantitée")
        return true
    }
}

//fonction pour rediriger vers la page cart

function redirectToCart() {
    window.location.href = "cart.html"
}