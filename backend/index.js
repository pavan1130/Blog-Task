const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

const mongoURI =
  "mongodb+srv://admin:11301130@cluster0.ibfabjp.mongodb.net/blog?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
