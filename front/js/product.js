

//Utilisation de URLSearchParams pour récupérer les id produits pour la page produit.

let params = new URLSearchParams(document.location.search);
let idParams = params.get("id");

const product = window.location.search.split("?id=").join("");
console.log(product);

let allProduct = [];

//Utilisation d'un fetch pour récupérer les produits
//un par un sous forme d'objets.

const fetchProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${idParams}`)
    .then((res) => res.json())
    .then((promise) => {
      allProduct = promise;
      console.log(allProduct);
    });
};

//constante pour afficher les éléments de la page

const productDisplay = async () => {
  await fetchProduct();

try{
  document.querySelector(".item__img").innerHTML = `<img src=${allProduct.imageUrl} alt=${allProduct.altTxt}>`;
  document.getElementById("title").textContent = `${allProduct.name}`;
  document.getElementById("price").textContent = `${allProduct.price}`;
  document.getElementById("description").textContent = `${allProduct.description}`;
 
  //affichage de la couleur dans les options

  let select = document.getElementById("colors")
  console.log(select);

  console.log(allProduct.colors);

  allProduct.colors.forEach((color) => {
    console.log(color)
    let tagOption = document.createElement("option");

    tagOption.innerHTML = `${color}`;

    select.appendChild(tagOption)
    console.log(tagOption)
  });
  
  addBasket(allProduct)
  
} catch (e) {
  console.log("il y à une erreur" + e)
}
};

productDisplay();

//constante pour activer le bouton d'ajout au panier

/*document.getElementById('addToCart').id = '${idParams._id}';

const addBasket = (allProduct) => {
  let bouton = document.getElementById(allProduct._id);
  console.log(bouton);
  bouton.addEventListener("click", () => {
    let select = document.getElementById("colors")
    console.log(select)
  })
}*/

//constante qui permet d'envoyer les données dans le localstorage

const addBasket = (allProduct) => {
  document.getElementById(addToCart);
  console.log(addToCart);
  addToCart.addEventListener("click", () => {
    let produitTableau = JSON.parse(localStorage.getItem("product"));
    let select = document.getElementById("colors");
    /*let imageUrl, altTxt;
    let price*/
    console.log(select.value);
    /*console.log(produitTableau);
    console.log(imageUrl, altTxt);
    console.log(price);*/


    //constante qui permet de récupéré la couleur choisie

    const fusionProduitTeinte = Object.assign({} , allProduct, {
      teinte : `${select.value}`,
      quantite: 1, 
    });
    console.log(fusionProduitTeinte);

    if(produitTableau == null) {
      produitTableau = []
      produitTableau.push(fusionProduitTeinte);
      console.log(produitTableau)
      localStorage.setItem("product",JSON.stringify(produitTableau));
    }
  })
}



