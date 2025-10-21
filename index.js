require("dotenv/config");
require("./db.js");

const port = process.env.PORT || 3000;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user-route.js");
const productsRouter = require("./routes/products-route.js");
const errorHandler = require("./middlewares/errorHandler.js");
const missingProductRouter = require("./routes/missingProduct-route.js");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/missingProduct", missingProductRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
