import { responseData } from "../cart/cartForm.mjs";
function renderResponse(responseData) {
	document.getElementById("orderId").innerHTML = responseData.orderId;
}
renderResponse(responseData);
// What is the best way to render the data?
