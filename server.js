const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");
const blogPostRoutes = require("./routes/blogPostRoutes.js");
const blogReactionRoutes = require("./routes/blogReactionRoutes");
const bodyParser = require("body-parser");
dotenv.config();
const PORT = 8000;
const app = express();

// connect to the database
const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB database");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB database:", err.message);
      process.exit(1);
    });
};
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/blogPost", blogPostRoutes);
app.use("/blogReact", blogReactionRoutes);

app.listen(PORT, () => {
  connect();
  console.log("Listening on port", PORT);
});
