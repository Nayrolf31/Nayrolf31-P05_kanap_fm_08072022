/* création fetch */

let allProduct = [];

const fetchProduct = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((promise) => {
      allProduct = promise;
      console.log(allProduct);
    });
};


//définition d'une const pour récupérer les données de l'API

const productDisplay = async () => {
  await fetchProduct();

  try {
    document.getElementById("items",).innerHTML = allProduct.map((product) => `
    <a class="button" id="${product._id}" href="./product.html?id=${product._id}">
      <article >
        <img class="productImg" src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class="productTitle">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
       <!--  <div class="productColor">${product.colors}</div>
        <span class="productPrice">${product.price} €</span> -->
      </article>
    </a>
  `).join("");
  } catch (e) {
    console.log("il y à une erreur" + e)
  }

  //mise en place d'une variable pour accéder à la page produit

  let buttons = document.querySelectorAll(".button");
  console.log(buttons)

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      console.log(button);

      window.location = `product.html?${button.id}`;
    }),
  );

};

productDisplay();