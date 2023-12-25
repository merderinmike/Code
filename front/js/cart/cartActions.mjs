function Cart() {
	let items = [...(getCartFromLocalStorage()?.items ?? [])];

	function getCartFromLocalStorage() {
		// Get from LS
		return JSON.parse(localStorage.getItem("cart"));
	}

	function setCartToLocalStorage() {
		// Set to LS
		localStorage.setItem("cart", JSON.stringify({ items }));
	}

	function addItem(newItem) {
		items = [...items, newItem];
		setCartToLocalStorage();
		return items;
	}

	function getItems() {
		return createItemsWithUniqueValuesAndTotalQuantity(items);
	}

	function setItemCount(id, quantity) {
		const item = items.find((item) => item.id === id);
		const newItem = quantity > 0 ? { ...item, quantity } : null;

		const index = items.findIndex((item) => item.id === id);
		if (index !== -1) {
			items[index] = newItem;
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
			newItem.quantity += item.quantity;
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
