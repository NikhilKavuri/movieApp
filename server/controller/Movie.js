import axios from "axios";
import User from "../model/userModel.js";
export const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userObj = {
      username: username,
      email: email,
      password: password,
    };
    const newUser = new User(userObj);
    await newUser.save();
    res.json("User Added success");
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
};
export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username, password });
    if (findUser) {
      res.json({ message: "User exists" });
    } else {
      res.json({ message: "User not exists" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchMovie = async (req, res) => {
  try {
    const { movieName } = req.body;
    console.log(req.body);
    const data = await axios.get(
      `https://www.omdbapi.com/?t=${movieName}&&apikey=6532a9f`
    );
    res.status(200).json(data.data);
  } catch (err) {
    res.status(500).send("Error while searching the movie " + err);
  }
};
