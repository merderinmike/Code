(async () => {
	const url = "http://localhost:3000/api/products";
	const container = document.getElementById("items");
	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			for (let { _id, name, description, imageUrl, altTxt } of data) {
				container.innerHTML += `
				<a href="./product.html?id=${_id}">
					<article>
					<img
						src="${imageUrl}"
						alt="${altTxt}"
					/>
					<h3 class="productName">${name}</h3>
					<p class="productDescription">
						${description}
					</p>
				</article>
			</a>
				`;
			}
		})
		.catch((error) => {
			console.error("error fetching data: ", error);
		});
})();
