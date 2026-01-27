// Cau 1
function Product(id, name, price, quantity, category, isAvailable) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.quantity = quantity;
  this.category = category;
  this.isAvailable = isAvailable;
}
// cau 2
const products = [
  new Product(1, "acer gaming", 35000000, 10, "Laptops", true),
  new Product(2, "readmi 12", 28000000, 5, "Phones", true),
  new Product(3, "readmi 13", 32000000, 3, "Phones", true),
  new Product(4, "readmi 14", 29000000, 0, "Phones", false),
  new Product(5, "readmi 15", 6000000, 15, "Phones", true),
  new Product(5, "AirPods Pro", 6000000, 15, "Accessories", true),
  new Product(5, "logitech superlight 2", 500000, 15, "Accessories", false),
  new Product(6, "readmi 16", 2500000, 0, "Phones", false)
];
// cau 3
const nameAndPrice = products.map(p => ({
  name: p.name,
  price: p.price
}));

console.log(nameAndPrice);

//cau 4
const inStockProducts = products.filter(p => p.quantity > 0);

console.log(inStockProducts);

//cau 5
const hasExpensiveProduct = products.some(p => p.price > 30000000);

console.log(hasExpensiveProduct);

//cau 6
const accessoriesAvailable = products
  .filter(p => p.category === "Accessories")
  .every(p => p.isAvailable === true);

console.log(accessoriesAvailable);
//cau 7
const totalInventoryValue = products.reduce(
  (total, p) => total + p.price * p.quantity,
  0
);

console.log(totalInventoryValue);

//cau 8
for (const product of products) {
  const status = product.isAvailable ? "Đang bán" : "Ngừng bán";
  console.log(`${product.name} - ${product.category} - ${status}`);
}

//cau 9
for (const key in products[0]) {
  console.log(`${key}: ${products[0][key]}`);
}

// cau 10
const availableAndInStockNames = products
  .filter(p => p.isAvailable && p.quantity > 0)
  .map(p => p.name);

console.log(availableAndInStockNames);
