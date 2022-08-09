

//const pour créer un array d'objet dans cart ( avec cart.push(itemObject))
const cart = [];

retrieveItemsFromCache()
//loop pour afficher les objects dans le panier
cart.forEach((item) => displayItem(item))

function retrieveItemsFromCache() {
    // const pour récupérer le localstorage

    const numerOfItems = localStorage.length
    // loop pour pouvoir récupérer plusieurs produits du localstorage
    for (let i = 0; i < numerOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        console.log("objet en position", i, "est", item)
        //const pour que le produit devienne un objet
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

//fonc pour afficher les objects
function displayItem(item) {
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item)
    article.appendChild(imageDiv)
    
    const cartItemContent = makeCartContent(item)
    article.appendChild(cartItemContent)

    displayArticle(article)
}

//fonc contenue cart
function makeCartContent( item) {
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
    return settings
}

//func ajout qté aux settings
function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classlist.add("cart__item__content__settings__quantity")
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
    settings.appendChild(input)
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
