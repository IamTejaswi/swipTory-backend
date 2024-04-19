const User = require("../models/user");
const bycrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        errorMessage: "Please fill all input",
      });
    }

    const isExistingUser = await User.findOne({ username: username });
    if (isExistingUser) {
      return res.status(409).json({ errorMessage: "User already exists" });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const userData = new User({
      username,
      password: hashedPassword,
    });

    await userData.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        errorMessage: "Please enter valid Username",
      });
    }
    const userDetails = await User.findOne({ username });

    if (!userDetails)
      return res.status(401).json({ errorMessage: "Invalid credentials" });

    const passwordMatch = await bycrypt.compare(password, userDetails.password);
    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    res.json({ message: "User logged in" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

module.exports = { registerUser, loginUser };
