//const pour créer un array d'objet dans cart ( avec cart.push(itemObject))
//const cart = []

//func recupération infos
function getProduct() {
    const url = "http://localhost:3000/api/products"
    return fetch(url)
        .then(res => res.json())
        .then(data => data)
        .catch(function (error) {
            console.log(error)
        })
}

//retrieveItemsFromCache()
//loop pour afficher les objects dans le panier
let cart = getStorage()
cart.forEach((item) => displayItem(item))

//const formulaire
const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

// function retrieveItemsFromCache() {
//     // const pour récupérer le localstorage

//     const numerOfItems = localStorage.length
//     // loop pour pouvoir récupérer plusieurs produits du localstorage
//     for (let i = 0; i < numerOfItems; i++) {
//         const item = localStorage.getItem('produit') || ""
//         //console.log("objet en position", i, "est", item)

//         //const pour que le produit devienne un objet
//         const itemObject = JSON.parse(item)
//         cart.push(itemObject)
//     }
// }

function getStorage() {
    let cart = localStorage.getItem('produit');
    if (cart == null) {
        return []
    } else {
        return JSON.parse(cart)
    }
}

//fonc pour afficher les objects
function displayItem(item) {
    console.log("ici", item)
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item)
    article.appendChild(imageDiv)
    const cartItemContent = makeCartContent(item)
    article.appendChild(cartItemContent)
    displayArticle(article)
    displayTotalPrice()
    displayTotalQuantity()
}

//function total qté 
function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, item) => total + item.quantity, 0)
    totalQuantity.textContent = total
}

//function pour total prix
function displayTotalPrice() {
    let total = 0;
    const totalPrice = document.querySelector("#totalPrice")
    cart.forEach(item => {
        const totalUnitPrice = item.price * item.quantity
        total += totalUnitPrice
    })
    //console.log(total)
    totalPrice.textContent = total
}

//fonc contenue cart
function makeCartContent(item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent
}

//function settings ( qté)
function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings
}


//function bouton delete
function addDeleteToSettings(settings, item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.classList.add("deleteItem")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

//func suppression produit
function deleteItem(item) {
    const itemToDelete = cart.findIndex(
        (product) => product.id === item.id && product.color === item.color
    )
    cart.splice(itemToDelete, 1)
    console.log(cart)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataFromCache(item)
    deleteArticleFromPage(item)
}

//func pour suprimer le visuel de l'article dans le panier
function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    console.log("article supp", articleToDelete)
    articleToDelete.remove()
}

//func ajout qté aux settings
function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté : "
    quantity.appendChild(p)
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => updatePriceAndQuantity(item.id, input.value, item))

    quantity.appendChild(input)
    settings.appendChild(quantity)
}

//fonction pour changer le prix et quantité direct dans cart
function updatePriceAndQuantity(id, newValue, item) {
    const itemToUpdate = cart.find(item => item.id === id)
    itemToUpdate.quantity = Number(newValue)
    item.quantity = itemToUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToCache(item)
}

//func pour supp le data du cache
function deleteDataFromCache(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
    console.log("on retire cette key", key)
}

//fonc pour sauvegarder les changement dans le cache localstorage
function saveNewDataToCache(item) {
    console.log(item)
    const dataToSave = JSON.stringify(item)
    //const key = `${item.id}-${item.color}`
    localStorage.setItem('produit', dataToSave)
}



//function description produit
function makeDescription(item) {
    //création const description
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name;
    const p = document.createElement("p")
    p.textContent = item.color;
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €";

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
}


//fonc affichage article
function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}


function makeImageDiv(item) {
    //création div
    const div = document.createElement("div")
    div.classList.add("cart__item__img")
    //création img
    const image = document.createElement("img")
    image.src = item.imageUrl,
        image.alt = item.altTxt
    div.appendChild(image)
    return div
}

//func formulaire
function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("selectionner des articles à acheter")
        return
    }

    //if (isFormInvalid()) return
    if (isfirstNameInvalid()) return
    if (islastNameInvalid()) return
    if (isAddressInvalide()) return
    if (isCityInvalid()) return
    if (isEmailInvalid()) return

    const body = makeRequestBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            window.location.href = "confirmation.html" + "?orderId=" + orderId
            return console.log(data)
        })
        .catch((err) => console.error(err))
}

//func pour voir si le form est bien rempli
function isFormInvalid() {
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
            alert("veuillez remplir tout le formulaire")
            return true
        }
        return false
    })
};

function isfirstNameInvalid() {
    const firstname = document.querySelector("#firstName").value
    const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
    if (regex.test(firstname) === false) {
        document.getElementById('firstNameErrorMsg').innerHTML="Veuillez entrer un prénom valide";  
        firstName.focus(); 
        return true
    }
    else document.getElementById('firstNameErrorMsg').innerHTML="";  
}

function islastNameInvalid() {
    const lastname = document.querySelector("#lastName").value
    const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
    if (regex.test(lastname) === false) {
        document.getElementById('lastNameErrorMsg').innerHTML="Veuillez entrer un Nom valide";  
        lastName.focus(); 
        return true
    }
    else document.getElementById('lastNameErrorMsg').innerHTML="";
}

function isCityInvalid() {
    const city = document.querySelector("#city").value
    const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
    if (regex.test(city) === false) {
        document.getElementById('cityErrorMsg').innerHTML="Veuillez entrer un nom de ville valide";  
        city.focus(); 
        return true
    }
    else document.getElementById('cityErrorMsg').innerHTML="";
}

function isAddressInvalide() {
    const address = document.querySelector("#address").value
    const regex = /^[a-zA-Z0-9\s]{3,}$/
    if (regex.test(address) === false) {
        document.getElementById('addressErrorMsg').innerHTML="Veuillez entrer une Adresse valide";  
        address.focus(); 
        return true
    }
    else document.getElementById('addressErrorMsg').innerHTML="";
}

//func pour voir si l'email est bien rempli
function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    // /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(email) === false) {
        document.getElementById('emailErrorMsg').innerHTML="Veuillez entrer un e-mail valide exemple: didier@gmail.com";  
        email.focus(); 
        return true
    }
    else document.getElementById('emailErrorMsg').innerHTML="";
}

//fonction pour faire remonter les infos du formulaire
function makeRequestBody() {
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    const body = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
        },
        products: getIdsFromCache()
    }
    console.log("body", body)
    return body
}

//fonction pour pouvoir ajouter les ids aux caches
function getIdsFromCache() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        console.log("key", key)
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
}