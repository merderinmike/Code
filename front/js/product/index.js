import { Cart } from "../cart/cartActions.mjs";

const cart = new Cart();

(async () => {
	const productId = new URLSearchParams(window.location.search).get("id");
	const id = encodeURIComponent(productId);

	// Sanitize id?
	const url = `http://localhost:3000/api/products/${id}`;
	const itemImg = document.getElementById("itemImg");
	const productName = document.getElementById("title");
	const price = document.getElementById("price");
	const description = document.getElementById("description");
	const colors = document.getElementById("colors");

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			itemImg.innerHTML = `<img src="${data.imageUrl}" alt=${data.altTxt}/>`;
			productName.innerHTML = data.name;
			price.innerHTML = data.price;
			description.innerHTML = data.description;
			for (const color of data.colors) {
				colors.innerHTML += `<option value=${color}>${color}</option>`;
			}
		});
})();

const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
	const productId = new URLSearchParams(window.location.search).get("id");
	const id = encodeURIComponent(productId);
	const itemColor = document.getElementById("colors").value;
	const itemQuantity = document.getElementById("quantity").value;
	const addedProduct = {
		id: id,
		color: itemColor,
		quantity: itemQuantity,
	};
	cart.addItem(addedProduct);
	cart.logCart();
});
