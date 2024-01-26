function renderOrderResponse() {
	const orderIdFromSession = JSON.parse(sessionStorage.getItem("orderId"));
	document.getElementById("orderId").innerHTML = orderIdFromSession;
}
window.onload = renderOrderResponse();
