const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send("Username and password required");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            highScore: 0
        });

        // ✅ AUTO LOGIN AFTER REGISTER
        req.session.user = {
            _id: user._id,
            username: user.username
        };

        // redirect to game with success message
        res.redirect("/game.html?msg=registered");

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).send("Signup error");
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send("Username and password required");
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Invalid password");
        }

        req.session.user = {
            _id: user._id,
            username: user.username
        };

        // redirect with login success message
        res.redirect("/game.html?msg=login");

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send("Login error");
    }
});

/* ================= GET LOGGED USER ================= */
router.get("/user", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("Unauthorized");
    }

    const user = await User.findById(req.session.user._id);

    res.json({
        username: user.username,
        highScore: user.highScore
    });
});

/* ================= SAVE SCORE ================= */
router.post("/score", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("Unauthorized");
    }

    const { score } = req.body;
    const user = await User.findById(req.session.user._id);

    if (score > user.highScore) {
        user.highScore = score;
        await user.save();
    }

    res.send("Score saved");
});

/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login.html");
    });
});

module.exports = router;
