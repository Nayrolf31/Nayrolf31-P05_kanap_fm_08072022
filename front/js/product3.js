//utilisation de urlsearchparams pour récupérer l'id du produit

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")
if (id != null) {
    let itemPrice = 0
    let imgUrl, altText, articleName
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
    articleName = name
    makeImageDiv(imageUrl, altTxt)
    makeTitle(name)
    makePrice(price)
    makeCartContent(description)
    makeColors(colors)
}

//func recup infos produit ( img, alt, title, price etc..)

function makeImageDiv(imageUrl, altTxt) {
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

function makeCartContent(description) {
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
    alertToCart()
}

//const pour recup toutes les infos necessaire ( dont price par l'API)
//fonction qui regroupe les infos

function saveOrder(color, quantity) {
    //if {}
    const key = `${id}-${color}`
    const data = {
        id: id,
        color: color,
        quantity: Number(quantity),
        price: itemPrice,
        imageUrl: imgUrl,
        altTxt: altText,
        name: articleName,
    }

    let localProducts = JSON.parse(localStorage.getItem('produit'));

    if (localProducts === null) {
        localProducts = [];
    }

    let updateProduct = false;

    if (localProducts) {

        localProducts.forEach((element, key) => {
            if (element.id === id && element.color === color) {
                localProducts[key].quantity = parseInt(element.quantity) +
                    parseInt(Number(quantity))
                localStorage.setItem('produit', JSON.stringify(localProducts
                ));
                updateProduct = true;
                alert('panier mis à jour')
            }
        });

        if (!updateProduct) {
            localProducts.push(data);
            localStorage.setItem('produit', JSON.stringify(localProducts));
        }
    }
}
//fonction pour verifier si une color et quantité à était choisis

function isOrderInvalid(color, quantity) {
    if (color == null || color === "") {
        alert("choisissez une couleur")
        return true
    }
    if (quantity == null || quantity == 0) {
        alert("choisissez une quantitée")
        return true
    }
}

function alertToCart() {
    alert("votre article à bien était ajouté au panier")
}

