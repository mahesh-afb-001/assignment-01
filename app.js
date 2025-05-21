const express = require('express');
const app = express();

app.use(express.json());
//router for users
const userRoutes = require("./routes/user");
// router for product
const productRoutes = require("./routes/product");

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'This is the base url' });
});

const PORT = 3000;
// listening to the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});