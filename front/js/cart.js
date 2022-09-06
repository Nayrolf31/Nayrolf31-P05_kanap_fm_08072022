let localProducts = JSON.parse(localStorage.getItem('produit'));
console.log("ici", localProducts)
//const pour créer un array d'objet dans cart ( avec cart.push(itemObject))
//let card = [];
let products = [];

function getProduct() {
    const url = "http://localhost:3000/api/products"
    return fetch(url)
        .then(res => res.json())
        .then(data => data)
        .catch(function (error) {
            console.log(error)
        })
}

//const itemPrice = price

function makePrice(price) {
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
    console.log("prix", price)
}

//retrieveItemsFromCache()
//loop pour afficher les objects dans le panier
//cart.forEach((item) => displayItem(item))

//const formulaire
const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))


// loop pour pouvoir récupérer plusieurs produits du localstorage
for (i = 0; i < localProducts.length; i++) {
    products.push(localProducts[i].id)
}

const card = document.getElementById("cart__items")

function displayItem(products, productToShow) {
    let childCard = document.createElement("article");
    childCard.classList.add("cart__item");
    childCard.dataset.id = productToShow.id
    childCard.dataset.color = productToShow.color
    childCard.innerHTML =
        `
            <div class="cart__item__img">
                <img src="${products.imageUrl}" alt="${products.alt}">
            </div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${products.name}</h2>
    <p>${productToShow.color}</p>
    <p>${products.price}</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productToShow.quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div> `
    card.appendChild(childCard);
}

async function compareProduct() {
    const products = await getProduct();
    for (let productToShow of localProducts) {
        const product = products.filter(p => p._id === productToShow.id)
        displayItem(product[0], productToShow)
    }
    return
}

//function total qté 
function displayTotalQuantity(localProducts) {
    let total = 0;
    console.log("total =", total)
    for (let i in localProducts) {
        console.log("yay", localProducts)
        const allProducts = localProducts[i].quantity
        total += allProducts
    }
    return total
}

async function displayQuantityAndPrice() {
    const totalQuantity = document.getElementById("totalQuantity")
    totalQuantity.textContent = displayTotalQuantity(localProducts)

    const totalPrice = document.getElementById("totalPrice")
    totalPrice.textContent = await displayTotalPrice()
}

//function pour total prix
async function displayTotalPrice() {
    let total = 0;
    console.log("price =", total)
    const allProducts = await getProduct();
    for (let j in localProducts) {
        for (let i in allProducts) {
            const price = allProducts[i].price;
            const id = allProducts[i]._id;
            if (localProducts[j].id === id) {
                total += localProducts[j].quantity * price
            }
        }
    }
    return total
}

//func pour suprimer le visuel de l'article dans le panier

function changeQuantityFromCard() {
    const itemQuantity = document.getElementsByName("itemQuantity");
    for (let item of itemQuantity) {
        item.addEventListener("change", function (event) {
            const parent = event.target.closest("article")
            const id = parent.dataset.id
            const color = parent.dataset.color
            const quantity = parseInt(event.target.value)
            saveChangeQuantity(id, color, quantity)
        })
    }
}

function saveChangeQuantity(id, color, quantity) {
    for (let i in localProducts) {
        if (localProducts[i].id === id && localProducts[i].color === color) {
            localProducts[i].quantity = quantity
            localStorage.setItem('produit', JSON.stringify(localProducts));
            displayQuantityAndPrice();
        }
    }
}

function deleteItemFromCard() {
    const deleteQuantity = document.getElementsByClassName("deleteItem");
    for (let item of deleteQuantity) {
        item.addEventListener("click", function (event) {
            const parent = event.target.closest("article")
            const id = parent.dataset.id
            const color = parent.dataset.color
            if (window.confirm("souhaitez-vous vraiment supprimer cette article de votre panier?")) {
                chooseProductDelete(id, color);
                location.reload()
            }
        })
    }
}

function chooseProductDelete(id, color) {
    for (let i in localProducts) {
        if (localProducts[i].id === id && localProducts[i].color === color){
            localProducts.splice(i, 1)
            localStorage.setItem('produit', JSON.stringify(localProducts));
            displayQuantityAndPrice();
        }
    }
}

//func formulaire
function submitForm(e) {
    e.preventDefault()
    if (localProducts.length === 0) {
        alert("selectionner des articles à acheter")
        return
    }

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

function isfirstNameInvalid() {
    const firstname = document.querySelector("#firstName").value
    const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
    if (regex.test(firstname) === false) {
        document.getElementById('firstNameErrorMsg').innerHTML = "Veuillez entrer un prénom valide";
        firstName.focus();
        return true
    }
    else document.getElementById('firstNameErrorMsg').innerHTML = "";
}

function islastNameInvalid() {
    const lastname = document.querySelector("#lastName").value
    const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
    if (regex.test(lastname) === false) {
        document.getElementById('lastNameErrorMsg').innerHTML = "Veuillez entrer un Nom valide";
        lastName.focus();
        return true
    }
    else document.getElementById('lastNameErrorMsg').innerHTML = "";
}

function isCityInvalid() {
    const city = document.querySelector("#city").value
    const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
    if (regex.test(city) === false) {
        document.getElementById('cityErrorMsg').innerHTML = "Veuillez entrer un nom de ville valide";
        city.focus();
        return true
    }
    else document.getElementById('cityErrorMsg').innerHTML = "";
}

function isAddressInvalide() {
    const address = document.querySelector("#address").value
    const regex = /^[a-zA-Z0-9\s]{3,}$/
    if (regex.test(address) === false) {
        document.getElementById('addressErrorMsg').innerHTML = "Veuillez entrer une Adresse valide";
        address.focus();
        return true
    }
    else document.getElementById('addressErrorMsg').innerHTML = "";
}

//func pour voir si l'email est bien rempli
function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (regex.test(email) === false) {
        document.getElementById('emailErrorMsg').innerHTML = "Veuillez entrer un e-mail valide exemple: didier@gmail.com";
        email.focus();
        return true
    }
    else document.getElementById('emailErrorMsg').innerHTML = "";
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
    const ids = []
    for (let i = 0; i < localProducts; i++) {
        const key = localStorage.products(i)
        console.log("key", products)
        const id = products.split("-")[0]
        ids.push(id)
    }
    return ids
}

async function main() {
    await compareProduct();
    displayQuantityAndPrice();
    changeQuantityFromCard();
    deleteItemFromCard();
}
main()