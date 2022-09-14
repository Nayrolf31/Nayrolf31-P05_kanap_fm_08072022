let localProducts = JSON.parse(localStorage.getItem('produit'));
let products = [];

//fonction qui permet de récupérer tout les produits de l'API par le fetch
function getProduct() {
    const url = "http://localhost:3000/api/products"
    return fetch(url)
        .then(res => res.json())
        .then(data => data)
        .catch(function (error) {
            console.log(error)
        })
}

//const formulaire
const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))


// loop pour pouvoir récupérer plusieurs produits du localstorage
for (i = 0; i < localProducts.length; i++) {
    products.push(localProducts[i].id)
}

//const qui permet de récupérer "cart__items"
const card = document.getElementById("cart__items")

//fonction qui permet de générer l'affichage des produits dans l'article 
//en fonction des produits présent dans le LS et des infos de l'API
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

//fonction qui permet de retrouver un produit de LS dans l'API par le biais de l'ID
async function compareProduct() {
    //équivalent fetch
    const products = await getProduct();
    //productToShow = produit récup du LS
    for (let productToShow of localProducts) {
        //pour chaque produit trouver dans le LS => const product => filter 
        // = recherche dans résultat fetch. si produit LS stric = produit fetch => affichage
        const product = products.filter(p => p._id === productToShow.id)
        // 0 car tableau démarre à 0, pour être sûr qu'aucun produit n'est oublié
        displayItem(product[0], productToShow)
    }
    return
}

//function qui permet de calculer la qté totale de produits dans le panier
function displayTotalQuantity(localProducts) {
    let total = 0;
    //boucle qui permet d'aller regarder chaque produit du LS => récupère qté de chaque item 
    //=> assigne valeur totale
    for (let i in localProducts) {
        const allProducts = localProducts[i].quantity
        total += allProducts
    }
    return total
}

//fonction qui permet d'afficher le total d'article et de prix correspondant
async function displayQuantityAndPrice() {
    const totalQuantity = document.getElementById("totalQuantity")
    totalQuantity.textContent = displayTotalQuantity(localProducts)

    const totalPrice = document.getElementById("totalPrice")
    totalPrice.textContent = await displayTotalPrice()
}

//function qui permet de calculer le prix total
async function displayTotalPrice() {
    let total = 0;
    const allProducts = await getProduct();
    //première boucle qui cherche dans le LS pour récupérer les produits
    for (let j in localProducts) {
        //seconde boucle qui fouille dans l'API pour trouver le prix et l'id correspondant au produits LS
        for (let i in allProducts) {
            const price = allProducts[i].price;
            const id = allProducts[i]._id;
            //point d'équivalence entre l'ID du LS et l'ID du produit de l'API 
            //=> calcul du prix en fonction de la Qté des produits présent dans le LS et prix API
            if (localProducts[j].id === id) {
                total += localProducts[j].quantity * price
            }
        }
    }
    return total
}

//fonction changement qté cart
function changeQuantityFromCard() {
    const itemQuantity = document.getElementsByName("itemQuantity");
    //boucle qui regarde tout les input
    for (let item of itemQuantity) {
        //ajout evenlistener qui permet de cibler l'input au click 
        //par la récupération de l'id et color grace aux dataset
        item.addEventListener("change", function (event) {
            const parent = event.target.closest("article")
            const id = parent.dataset.id
            const color = parent.dataset.color
            const quantity = parseInt(event.target.value)
            saveChangeQuantity(id, color, quantity)
        })
    }
}

//fonction qui permet de vérifier que la Qté modifier correspond bien à l'article voulut
function saveChangeQuantity(id, color, quantity) {
    for (let i in localProducts) {
        if (localProducts[i].id === id && localProducts[i].color === color) {
            localProducts[i].quantity = quantity
            localStorage.setItem('produit', JSON.stringify(localProducts));
            displayQuantityAndPrice();
        }
    }
}

//fonction qui permet de cibler le bon bouton supprimer par les dataset
function deleteItemFromCard() {
    const deleteQuantity = document.getElementsByClassName("deleteItem");
    //ajout d'un evenement au click qui cible le produit
    for (let item of deleteQuantity) {
        item.addEventListener("click", function (event) {
            const parent = event.target.closest("article")
            const id = parent.dataset.id
            const color = parent.dataset.color
            //ajout d'une alerte qui permet une meilleur expérience à l'utilisateur et évite la suppression accidentel
            if (window.confirm("souhaitez-vous vraiment supprimer cette article de votre panier?")) {
                chooseProductDelete(id, color);
                //refresh pour affichage des modifications
                location.reload()
            }
        })
    }
}

//fonction qui fouille dans le LS pour comparer l'id et la couleur de celui-ci
function chooseProductDelete(id, color) {
    for (let i in localProducts) {
        if (localProducts[i].id === id && localProducts[i].color === color)
        {
            //splice qui permet de retirer un article de l'array du LS
            localProducts.splice(i, 1)
            localStorage.setItem('produit', JSON.stringify(localProducts));
            displayQuantityAndPrice();
        }
    }
}

//func formulaire
function submitForm(e) {
    e.preventDefault()
    //si LS est vide => alerte
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

//regroupement d'appel de fonctions dans main
async function main() {
    await compareProduct();
    displayQuantityAndPrice();
    changeQuantityFromCard();
    deleteItemFromCard();
}
main()