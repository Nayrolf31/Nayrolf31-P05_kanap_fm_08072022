let addProduit = JSON.parse(localStorage.getItem("product"));

console.log(addProduit)

const panierDisplay = async () => {
    console.log("salut");
    if(addProduit){
        await addProduit;
        console.log(addProduit);

        cart__item.classList.add("display-none");

        order.addEventlistener("click", () => {
            cart__item.classList.remove("display-none");


            //ajout boucle for let index = 0 < produitTableau; index ++ (avec lenght)

            //recup price ( doit être récupérer de l'API avec fetch comme product)
            
//boucle pour récupérer les produits dans la panier
let cart__items = getElementById(cart__items)
            cart__items.innerHTML = addProduit.map((product) => {
              `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
              <div class="cart__item__img">
                <img src="../images/product01.jpg" alt="Photographie d'un canapé">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>Nom du produit</h2>
                  <p>Vert</p>
                  <p>42,00 €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`
            console.log(product)
            }) 
             
        });

    }
}

panierDisplay();

let basket = localStorage.getItem("addBasket");