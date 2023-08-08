import axios from "axios";
import User from "../model/userModel.js";
import Movie from "../model/privateMovie.js";

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
    const user = await User.findOne({ username, password, email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
};
export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username, password });
    if (findUser) {
      res.json(findUser);
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

export const publicPlaylist = async (req, res) => {
  try {
    const playlistObj = req.body;
    const findTheMovie = await Movie.findOne({ title: playlistObj.title, type: "public" });
    if (findTheMovie) {
      res.status(200).json({ message: "Movie is already in the playlist" });
    } else {
      const newPlaylist = new Movie(playlistObj);
      await newPlaylist.save();
      res.status(200).json({ message: "Movie added successfully" });
    }
  } catch (err) {
    res.status(500).send("Error while adding to the database: " + err.message);
  }
};

export const privatePlaylist = async (req, res) => {
  try {
    const privateObj = req.body;
    const findTheMovie = await Movie.findOne({ title: privateObj.title , type: "private" });
    if (findTheMovie) {
      res.status(200).json({ message: "Movie already exists in Private" });
    } else {
      const newPlaylist = new Movie(privateObj);
      await newPlaylist.save();
      res.status(200).json({ message: "Private Playlist success" });
    }
  } catch (err) {
    res.status(500).send("Error while adding to private ", err);
  }
};

export const viewPublic = async (req, res) => {
  try {
    const publicplaylist = await Movie.find({ type: "public" });
    if (publicplaylist) {
      res.status(200).json(publicplaylist);
    } else {
      res.status(200).json({ message: "No public playlist" });
    }
  } catch (err) {
    res.status(500).send("Error while getting public playlist data", err);
  }
};
export const viewPrivate = async (req, res) => {
  try {
    const { userId } = req.body;
    const privateplaylist = await Movie.find({
      userId: userId,
      type: "private",
    });
    if (privateplaylist) {
      res.status(200).json(privateplaylist);
    } else {
      res.status(200).json({ message: "No Private playlist" });
    }
  } catch (err) {
    res.status(500).send("Error while getting public playlist data", err);
  }
};
