import { Cart } from "./cartActions.mjs";
import { renderResponse } from "../confirmation/index.js";

function isValidString(value) {
	return !/\d/.test(value) && value.length > 1;
}

function isValidAddress(value) {
	return typeof value === "string" && value.length > 1;
}

function isValidEmail(email) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return regex.test(email);
}

function validateField(value, element, errorMsgElementId, validationFunction) {
	const errorMessageElement = document.getElementById(errorMsgElementId);
	const isValid = validationFunction(value);
	if (isValid) {
		element.dataset.error = false;
		return true;
	} else {
		element.dataset.error = true;
		errorMessageElement.innerHTML = isValid ? "" : "Invalid input";
		return false;
	}
}

const fieldConfig = {
	firstName: {
		errorId: "firstNameErrorMsg",
		validator: isValidString,
	},
	lastName: {
		errorId: "lastNameErrorMsg",
		validator: isValidString,
	},
	address: {
		errorId: "addressErrorMsg",
		validator: isValidAddress,
	},
	email: { errorId: "emailErrorMsg", validator: isValidEmail },
	city: { errorId: "cityErrorMsg", validator: isValidString },
};

async function onSubmit(event) {
	const cart = new Cart();
	const updatedItems = cart.getItems();

	const ids = updatedItems.reduce((acc, current) => {
		return [...acc, current.id];
	}, []);
	console.log(ids);

	let errors = [];

	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const data = Array.from(formData.entries());
	data.forEach(([name, value]) => {
		const element = document.querySelector(`[name=${name}]`);
		const config = fieldConfig[name];
		if (!config)
			throw new Error(
				"Form includes an input not represented by this form's config"
			);
		const valid = validateField(
			value,
			element,
			config.errorId,
			config.validator
		);
		if (!valid) errors.push("Error in input" + name);
	});

	if (errors.length > 0) {
		console.error("Form submission failed: ", errors);
		return;
	} else {
		const contactData = Object.fromEntries(data);
		try {
			const response = await fetch(
				"http://localhost:3000/api/products/order",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						contact: contactData,
						products: ids,
					}),
				}
			);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Form submitted successfully:", responseData);
				window.location.href =
					"http://localhost:5500/front/html/confirmation.html";
				return responseData;
			} else {
				console.error("Form submission failed:", await response.text());
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	}
}
document.getElementById("cartForm").addEventListener("input", (event) => {
	const target = event.target;
	const name = target.name;
	const value = target.value;
	const config = fieldConfig[name];

	if (!config) {
		return;
	} else {
		const isValid = validateField(
			value,
			target,
			config.errorId,
			config.validator
		);
		if (isValid) {
			const errorMessageElement = document.getElementById(config.errorId);
			errorMessageElement.innerHTML = "";
		}
	}
});
export { onSubmit };
