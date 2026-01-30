const express = require("express");
const session = require("express-session");
const path = require("path");

require("./db"); // MongoDB connection
const authRoutes = require("./routes/auth");

const app = express();

/* 🔹 BODY PARSERS (VERY IMPORTANT) */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* 🔹 SESSION CONFIG */
app.use(
    session({
        secret: "simon-says-secret",
        resave: false,
        saveUninitialized: false
    })
);

/* 🔹 SERVE STATIC FILES */
app.use(express.static(path.join(__dirname, "../public")));

/* 🔹 ROOT → LOGIN PAGE */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

/* 🔹 AUTH ROUTES */
app.use("/", authRoutes);

/* 🔹 SERVER START */
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
