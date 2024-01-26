function Cart() {
	let items = [...(getCartFromLocalStorage() ?? [])];

	function getCartFromLocalStorage() {
		const items = JSON.parse(localStorage.getItem("cart")).items;
		// Get from LS
		return createItemsWithUniqueValuesAndTotalQuantity(items);
	}

	function setCartToLocalStorage() {
		// Set to LS
		localStorage.setItem("cart", JSON.stringify({ items }));
	}

	function addItem(newItem) {
		const existingItem = items.find(
			(item) => item.id === newItem.id && item.color === newItem.color
		);

		if (existingItem) {
			setItemCount(
				existingItem.id,
				existingItem.quantity + newItem.quantity,
				newItem.color
			);
		} else {
			items = [...items, newItem];
		}

		setCartToLocalStorage();
		return items;
	}

	function getItems() {
		return items;
	}

	function setItemCount(id, quantity, color) {
		const index = items.findIndex(
			(item) => item.id === id && item.color === color
		);

		if (index !== -1) {
			items[index] = { ...items[index], quantity: parseInt(quantity) };

			setCartToLocalStorage();
			return items;
		}
	}

	function removeItem(id) {
		const index = items.findIndex((item) => item.id === id);
		items.splice(index, 1);
		setCartToLocalStorage();
	}

	function logCart() {
		const currentCart = JSON.parse(localStorage.getItem("cart"));
		console.log(currentCart);
	}

	return {
		addItem,
		getCartFromLocalStorage,
		getItems,
		logCart,
		removeItem,
		setItemCount,
		setCartToLocalStorage,
	};
}

// Util
function createItemsWithUniqueValuesAndTotalQuantity(items) {
	const consolidatedItems = items.reduce((acc, item) => {
		const existingItem = acc.find(
			(x) => x.id === item.id && x.color === item.color
		);

		if (existingItem) {
			const newItem = { ...existingItem };
			newItem.quantity += parseInt(item.quantity);
			acc[acc.indexOf(existingItem)] = newItem;
		} else {
			acc.push({ ...item });
		}

		return acc;
	}, []);

	const newItems = consolidatedItems.filter((item) => item.quantity !== 0);
	return newItems;
}

export { Cart };
