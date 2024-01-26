import { Cart } from "./cartActions.mjs";
import { onSubmit } from "./cartForm.mjs";

async function updateTotalQuantityAndPrice() {
	const cart = new Cart();
	const updatedItems = cart.getItems();
	let totalQuantity = 0;
	let totalPrice = 0;

	for (const item of updatedItems) {
		const url = `http://localhost:3000/api/products/${item.id}`;
		const response = await fetch(url);
		const data = await response.json();

		totalQuantity += parseInt(item.quantity, 10);
		totalPrice += item.quantity * data.price;
	}

	const totalQuantitySpan = document.getElementById("totalQuantity");
	totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;

	const totalPriceSpan = document.getElementById("totalPrice");
	totalPriceSpan.textContent = `Total Price: €${totalPrice.toFixed(2)}`;
}

async function renderItems() {
	const cart = new Cart();
	const updatedItems = cart.getItems();
	const cartItems = document.getElementById("cart__items");

	cartItems.innerHTML = "";

	for (const item of updatedItems) {
		const url = `http://localhost:3000/api/products/${item.id}`;
		const response = await fetch(url);
		const data = await response.json();

		const itemElement = document.createElement("article");
		itemElement.className = "cart__item";
		itemElement.dataset.id = item.id;
		itemElement.dataset.color = item.color;
		itemElement.innerHTML = `
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
        `;
		cartItems.appendChild(itemElement);
	}

	updateTotalQuantityAndPrice();
	attachEventListeners();
}

function attachEventListeners() {
	const cartItems = document.getElementById("cart__items");
	const inputElements = cartItems.querySelectorAll(".itemQuantity");
	const deleteElements = cartItems.querySelectorAll(".deleteItem");

	inputElements.forEach((inputElement) => {
		inputElement.addEventListener("change", onChange);
	});

	deleteElements.forEach((deleteElement) => {
		deleteElement.addEventListener("click", deleteItems);
	});
}

function onChange(event) {
	const inputElement = event.target;
	const closestCartItem = inputElement.closest(".cart__item");
	const itemId = closestCartItem.dataset.id;
	const itemColor = closestCartItem.dataset.color;
	const inputValue = inputElement.value;
	const cart = new Cart();
	cart.setItemCount(itemId, parseInt(inputValue, 10), itemColor);

	inputElement
		.closest(".cart__item")
		.querySelector(
			".cart__item__content__settings__quantity p"
		).innerHTML = `Quantity : ${parseInt(inputValue, 10)}`;

	updateTotalQuantityAndPrice();
}

function deleteItems(event) {
	const elementToDelete = event.target;
	const closestCartItem = elementToDelete.closest(".cart__item");
	const itemId = closestCartItem.dataset.id;
	const cart = new Cart();
	cart.removeItem(itemId);

	closestCartItem.remove();

	updateTotalQuantityAndPrice();
	renderItems();
}

document.addEventListener("DOMContentLoaded", renderItems);

// New event listener on form
// form.add... ('submit', onSubmit);
document.getElementById("cartForm").addEventListener("submit", onSubmit);
