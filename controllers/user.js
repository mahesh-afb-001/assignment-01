
const users = [
  { id: 1, email: "mahesh@afb.com", password: "mahesh" ,cart:[]},
  
];

module.exports.users = users;


module.exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.log("Error in logging in: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


module.exports.userSignup = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    
    const newUser = {
      id: newUserId,
      email,
      password ,
      cart: [] 
    };

    
    users.push(newUser);

    return res.status(201).json({
      success: true,
      message: "User signup successfully",
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.log("Error in sign up: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal  error"
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    
    const Users = users.map(({ id, email,cart }) => ({ id, email ,cart}));
    
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: Users
    });
  } catch (error) {
    console.log("Error in retrieving users: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// module.exports.getOrderistory = async (req, res) => {
//   try {
//     const { userId, page = 1, pageSize = 1 } = req.query;

    
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required"
//       });
//     }

//     // Validate pagination parameters
//     const pPage = parseInt(page);
//     const pPageSize = parseInt(pageSize);
//     if (isNaN(pPage) || pPage < 1 || isNaN(pPageSize) || pPageSize < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Page and pageSize must be positive integers"
//       });
//     }

//     // Check if user exists
//     const user = users.find(u => u.id === parseInt(userId));
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Get purchased products
//     const purchasedProducts = products.filter(p => p.boughtBy === user.email);

//     // Pagination logic
//     const totalProducts = purchasedProducts.length;
//     const totalPages = Math.ceil(totalProducts / pPageSize);
//     const startIndex = (pPage - 1) * pPageSize;
//     const endIndex = startIndex + pPageSize;

//     // Check if page is out of range
//     if (startIndex >= totalProducts && totalProducts > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Page number exceeds total pages"
//       });
//     }

//     // Get paginated products
//     const paginatedProducts = purchasedProducts.slice(startIndex, endIndex);

//     return res.status(200).json({
//       success: true,
//       message: "Purchase history retrieved successfully",
      
//       products: paginatedProducts
//     });
//   } catch (error) {
//     console.log("Error in retrieving purchase history: ", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };
