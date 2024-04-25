const User = require("../models/user");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    if (!userDetails) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }
    const passwordMatch = await bycrypt.compare(password, userDetails.password);
    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: userDetails._id, username: userDetails.username },
      process.env.SECRET_CODE,
      { expiresIn: "60h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.json({
      message: "User logged in",
      token: token,
      username: userDetails.username,
      userId:userDetails._id

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};


const logoutUser = async(req,res,next)=>{
  try{
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logged out succesfully" });
  }catch(error){
    console.log(error);
    res.status(500).json({ errorMessage: "Error logging out!" });
  }

}

const loadUser = async (req, res, next) => {
  const { username } = req.params;
  console.log(req.params, username);
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json({ success: true, username: username, userId: user._id, user });
    } else {
      res.status(400).json("User does not exist");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting User!" });
  }
};

module.exports = { registerUser, loginUser , logoutUser , loadUser };
