import { Cart } from "./cartActions.mjs";
async function updateTotalQuantityAndPrice() {
	const cart = new Cart();
	const updatedItems = cart.getItems();
	let totalQuantity = 0;
	let totalPrice = 0;

	for (const item of updatedItems) {
		const url = `http://localhost:3000/api/products/${item.id}`;
		const response = await fetch(url);
		const data = await response.json();

		totalQuantity += item.quantity;
		totalPrice += item.quantity * data.price;
	}

	const totalQuantitySpan = document.getElementById("totalQuantity");
	totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;

	const totalPriceSpan = document.getElementById("totalPrice");
	totalPriceSpan.textContent = `Total Price: €${totalPrice.toFixed(2)}`;
}

function renderItems() {
	const cart = new Cart();
	const updatedItems = cart.getItems();
	// Render to DOM;
	const cartItems = document.getElementById("cart__items");
	updatedItems.forEach(async (item) => {
		const url = `http://localhost:3000/api/products/${item.id}`;
		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				cartItems.innerHTML += `
			<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
				<div class="cart__item__img">
					<img src="${data.imageUrl}" alt="${data.altTxt}">
				</div>
				<div class="cart__item__content">
					<div class="cart__item__content__description">
						<h2>${data.name}</h2>
						<p>${item.color}</p>
						<p>€${data.price}</p>
					</div>
					<div class="cart__item__content__settings">
						<div class="cart__item__content__settings__quantity">
							<p id="quantity">Quantity : ${item.quantity}</p>
							<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
						</div>
						<div class="cart__item__content__settings__delete">
							<p class="deleteItem">Delete</p>
						</div>
					</div>
				</div>
			</article>`;
			});

		updateTotalQuantityAndPrice();

		function onChange(event) {
			const inputElement = event.target;
			const closestCartItem = inputElement.closest(".cart__item");
			const itemId = closestCartItem.dataset.id;
			const inputValue = inputElement.value;
			cart.setItemCount(itemId, parseInt(inputValue, 10));
			const temp = (inputElement
				.closest(".cart__item")
				.querySelector(
					".cart__item__content__settings__quantity p"
				).innerHTML = `Quantity : ${parseInt(inputValue, 10)}`);
			updateTotalQuantityAndPrice();
		}

		const inputElements = document.querySelectorAll(".itemQuantity");
		inputElements.forEach((inputElement) => {
			inputElement.addEventListener("change", onChange);
		});

		function deleteItems(event) {
			const elementToDelete = event.target;
			const closestCartItem = elementToDelete.closest(".cart__item");
			const itemId = closestCartItem.dataset.id;
			cart.removeItem(itemId);
			console.log(itemId);
		}

		const deleteElements = document.querySelectorAll(".deleteItem");
		deleteElements.forEach((deleteItem) => {
			deleteItem.addEventListener("click", deleteItems);
		});
	});
	window.addEventListener("unload", () => {
		const inputElements = cartItems.querySelectorAll(".itemQuantity");
		const deleteElements = cartItems.querySelectorAll(".deleteItem");
		deleteElements.forEach((deleteElement) => {
			deleteElement.removeEventListener("click", deleteItems);
		});
		inputElements.forEach((inputElement) => {
			inputElement.removeEventListener("change", onChange);
		});
	});
	cart.logCart();
}

document.addEventListener("DOMContentLoaded", renderItems);
