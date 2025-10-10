import { setLocalStorage, getLocalStorage, loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "/js/ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";



let selectedItemsRaw = localStorage.getItem("selectedItems");
let selectedItems = [];

if (selectedItemsRaw && selectedItemsRaw !== "undefined") {
  try {
    selectedItems = JSON.parse(selectedItemsRaw);
  } catch (e) {
    console.error("Error parsing selectedItems:", e);
  }
} else {
  console.warn("selectedItems was undefined or missing. Resetting to empty array.");
  selectedItems = [];
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems)); // optional reset
}

loadHeaderFooter();

const dataSource = new ProductData("tents");
console.log(dataSource);
const productID = getParam("product");
console.log(productID);

const product = new ProductDetails(productID, dataSource);
product.init();

async function addProductToCart(product) {
  const existingItem = selectedItems.find((item) => item.Id === product.Id);
  if (!existingItem) {
    product.quantity = 1;
    selectedItems.push(product);
  } else {
    existingItem.quantity += 1;
  }
  //reruns loadheaderfooter to update cart count
  await loadHeaderFooter();
  const cartSup = document.getElementById("cart-sup");
  cartSup.classList.add("animate");
  setTimeout(() => cartSup.classList.remove("animate"), 300);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
  setLocalStorage("selectedItems", selectedItems);
}

setTimeout(() => {
  document
    .getElementById("add-to-cart")
    .addEventListener("click", addToCartHandler);
}, 100);

