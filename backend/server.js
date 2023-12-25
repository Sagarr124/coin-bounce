const express = require("express");
const { PORT } = require("./config/index");
const connectDB = require("./database/index");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(router);

connectDB();

app.use("/storage", express.static("storage"));

app.use(errorHandler);

app.listen(PORT, console.log(`Server started on port ${PORT}`));
