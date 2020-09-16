require('dotenv').config()
const express = require('express');

const app = express();

// Routes
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/users", require("./routes/api/users"))

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
