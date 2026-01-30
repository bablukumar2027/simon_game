const express = require("express");
const session = require("express-session");
const path = require("path");

require("./db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "simon-says-secret",
        resave: false,
        saveUninitialized: false
    })
);

/* 🔥 SERVE PUBLIC FOLDER */
app.use(express.static(path.join(__dirname, "../public")));

/* 🔥 ROOT ROUTE → LOGIN PAGE */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

/* ROUTES */
app.use(authRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
