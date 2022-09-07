const orderId = getOrderId()
displayOrderId(orderId)
removeAllCache()

function getOrderId () {
    //utilisation de urlsearchparams pour récupérer l'id de la commande
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get("orderId")
}

//fonction pour afficher l'id de commande
function displayOrderId() {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId
}

//func pour clean le localstorage
function removeAllCache() {
    const cache = window.localStorage
    cache.clear()
}

