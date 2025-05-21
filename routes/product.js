const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
// add a product
router.post("/addProduct", productController.createProduct);
// get all products
router.get("/allProducts", productController.getAllProducts);
// get product by id
router.get("/getProductById/:id", productController.getProductById);
//update product
router.put("/updateProduct/:id", productController.updateProduct);
// get products with pagination
router.get("/paginated", productController.getPaginatedProducts);
// delete product
router.delete("/deleteProduct/:id", productController.deleteProduct);
// add to the cart
router.post("/addtoCart/:productId",productController.addToCart);
router.delete("/deleterfromcart/:productId",productController.removeFromCart);
router.get("/getCartProducts",productController.getCart);
router.post("/payment/:productId",productController.paymentForProduct);
router.get("/history",productController.getOrderHistory);

module.exports = router;