const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { validateUserData } = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");

app.use(express.json());

// User registration (signup)
app.post("/signin", async (req, res) => {
    try {
        validateUserData(req);
        const { userName, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userName,
            email,
            password: hashPassword,
        });
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Protected route example
app.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

connectDB()
    .then(() => {
        console.log("Connection is Established");
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch((err) => {
        console.log(`Error: ${err.message}`);
    });

