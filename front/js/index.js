//création d'un fetch pour récupérer les données API

const url = "http://localhost:3000/api/products"
fetch(url)
  .then(res => res.json())
  .then(data => addProducts(data))


//création d'une fonction pour récupérer les produits

function addProducts(produits) {

  //mise en place Loop pour récupérer tout les produits

  produits.forEach((produit) => {
    console.log("produit", produit)

//appel de la fonction makeanchor

  const { _id, imageUrl, altTxt, name, description } = produit
  const anchor = makeAnchor(_id);
  const article = document.createElement("article")
  const image = makeImage(imageUrl, altTxt)
  const h3 = makeH3(name)
  const p = makeParagraphe(description)

  appendElementsToArticle(article, image, h3, p)
  appendArticleToAnchor(anchor, article)
});
}

function appendElementsToArticle(article, image, h3, p) {
  article.appendChild(image)
  article.appendChild(h3)
  article.appendChild(p)

}

function makeAnchor(id) {
  const anchor = document.createElement("a");
  anchor.href = "./product.html?id=" + id
  return anchor
}

function appendArticleToAnchor(anchor, article) {
  const items = document.querySelector("#items")
  if (items != null) {
    items.appendChild(anchor)
    anchor.appendChild(article)
    console.log("élément ajouté à items", items)
  }
}

//fonction pour récup img

function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}

//fonc recup name

function makeH3(name) {
  const h3 = document.createElement("h3")
  h3.textContent = name
  h3.classList.add("productName")
  return h3
}

//fonc recup P

function makeParagraphe(description) {
  const p = document.createElement("p")
  p.textContent = description
  p.classList.add("productDescription")
  return p

}






