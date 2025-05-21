const { users } = require("./user");
// product array
const products = [
  { id: "1", name: "macbook", quantity: "10", boughtBy: "" }
];

// creating a product

module.exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, boughtBy } = req.body;

    //name and quantity is needed to add a product
    if (!name || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Name and quantity are required"
      });
    }

    const newId = products.length > 0 
      ? (Math.max(...products.map(p => parseInt(p.id))) + 1).toString() 
      : "1";
    
    const newProduct = {
      id: newId,
      name,
      quantity: quantity.toString(),
      boughtBy: boughtBy || ""
    };
    // adding to the products
    products.push(newProduct);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.log("Error in creating product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products
    });
  } catch (error) {
    console.log("Error in retrieving products: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      product
    });
  } catch (error) {
    console.log("Error in retrieving product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, boughtBy } = req.body;

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      quantity: quantity ? quantity.toString() : products[productIndex].quantity,
      boughtBy: boughtBy !== undefined ? boughtBy : products[productIndex].boughtBy
    };

    products[productIndex] = updatedProduct;

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.log("Error in updating product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct
    });
  } catch (error) {
    console.log("Error in deleting product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    if (page < 1 || pageSize < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and pageSize must be positive integers"
      });
    }

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedProducts = products.slice(startIndex, endIndex);

    if (startIndex >= totalProducts && totalProducts > 0) {
      return res.status(400).json({
        success: false,
        message: "Page number exceeds total pages"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paginated products retrieved successfully",
      pagination: {
        currentPage: page,
        pageSize,
        totalProducts,
        totalPages
      },
      products: paginatedProducts
    });
  } catch (error) {
    console.log("Error in retrieving paginated products: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, quantity } = req.body;
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    // Validate inputs
    if (!productId || !userId || !quantity) {
      console.log("Validation failed:", { productId, userId, quantity });
      return res.status(400).json({
        success: false,
        message: "Product ID, user ID, and quantity are required"
      });
    }

    // Validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer"
      });
    }

    // Check if product exists
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user exists
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Ensure user has a cart array
    if (!user.cart) {
      user.cart = [];
    }

    // Check if product is already in user's cart
    const cartItemIndex = user.cart.findIndex(item => item.productId === productId);
    if (cartItemIndex !== -1) {
      // Update quantity
      user.cart[cartItemIndex].quantity += parsedQuantity;
    } else {
      // Add new item to user's cart
      user.cart.push({
        productId,
        quantity: parsedQuantity
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: user.cart
    });
  } catch (error) {
    console.log("Error in adding to cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    // Validate inputs
    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and user ID are required"
      });
    }

    // Check if user exists
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find item in user's cart
    const cartItemIndex = user.cart.findIndex(item => item.productId === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    // Remove item from cart
    const removedItem = user.cart.splice(cartItemIndex, 1)[0];

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      removedItem,
      cart: user.cart
    });
  } catch (error) {
    console.log("Error in removing from cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if user exists
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Enrich cart with product details
    const enrichedCart = user.cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      product: products.find(p => p.id === item.productId) || null
    }));

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart: enrichedCart
    });
  } catch (error) {
    console.log("Error in retrieving cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


module.exports.paymentForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, paid } = req.body;

    // Validate inputs
    if (!productId || !userId || paid === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, user ID, and paid status are required"
      });
    }

    // Check if user exists
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if product exists
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Ensure user has a cart array
    if (!user.cart) {
      user.cart = [];
    }

    
    

    // Check payment status
    if (!paid) {
      return res.status(400).json({
        success: false,
        message: "Payment failed: paid status is false"
      });
    }

    // Process payment: update product and cart
    product.boughtBy = user.email; // Mark product as bought by user
    product.quantity = (parseInt(product.quantity) - user.cart[cartItemIndex].quantity).toString(); // Reduce product quantity
    if (parseInt(product.quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient product quantity"
      });
    }

    // Remove product from cart
    user.cart.splice(cartItemIndex, 1);

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      product,
      cart: user.cart
    });
  } catch (error) {
    console.log("Error in processing payment: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// for order history

module.exports.getOrderHistory = async (req, res) => {
  try {
    const { userId, page = 1, pageSize = 5 } = req.query;

    // Validate inputs
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Validate pagination parameters
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and pageSize must be positive integers"
      });
    }

    // Check if user exists
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get purchased products
    const orderedProducts = products.filter(p => p.boughtBy === user.email);

    // Pagination logic
    const totalProducts = orderedProducts.length;
    const totalPages = Math.ceil(totalProducts / parsedPageSize);
    const startIndex = (parsedPage - 1) * parsedPageSize;
    const endIndex = startIndex + parsedPageSize;

    // Check if page is out of range
    if (startIndex >= totalProducts && totalProducts > 0) {
      return res.status(400).json({
        success: false,
        message: "Page number exceeds total pages"
      });
    }

    // Get paginated products
    const paginatedProducts = orderedProducts.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      message: "Order history retrieved successfully",
      pagination: {
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalProducts,
        totalPages
      },
      products: paginatedProducts
    });
  } catch (error) {
    console.log("Error in retrieving order history: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};