const User = require("../models/auth.js");
const Blog = require("../models/blogPost.js");
const Draft = require("../models/blogDraft.js");
const Bloglikes = require("../models/blogReaction.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// to update the profile

exports.updateProfile = async (req, res) => {
  try {
    const fileData = Buffer.from(req.body.profilePicture, "base64");
    const { username, email, password, phone, userId } = req.body;

    // Check if the user already exists
    const existingUser = await User.findById(req.body.userId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (req.body.username === existingUser.username) {
      return res.status(400).json({
        error: "Username is already taken. Please choose a different username.",
      });
    }
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({
        error: "The email address you provided is already in use.",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Update the user's username
    existingUser.username = username;
    existingUser.email = email;
    existingUser.phone = phone;
    existingUser.password = hash;
    // Update the user's profile picture
    if (req.body.profilePicture)
      existingUser.profilePicture = `data:image/png;base64,${fileData.toString(
        "base64"
      )}`;

    // Save the updated user data

    await existingUser.save();
    await Blog.updateMany(
      { userId: req.body.userId },
      { username: req.body.username }
    );
    const result = await User.findOne({ _id: req.body.userId });
    res.status(200).json({ result, message: "Profile updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error.inside catch" });
  }
};

// for signup
exports.signup = async (req, res, next) => {
  try {
    // Check if the user already exists
    const existingUserName = await User.findOne({
      username: req.body.username,
    });
    const existingUserEmail = await User.findOne({ email: req.body.email });

    if (existingUserName) {
      return res.status(400).json({
        error: "Username is already taken. Please choose a different username.",
      });
    } else if (existingUserEmail) {
      return res
        .status(400)
        .json({ error: "The email address you provided is already in use." });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT);

    const { password, ...othersData } = newUser._doc;

    const user = await User.findById(newUser._id);
    const loginToken = jwt.sign({ id: user?._id }, process.env.JWT);
    const { password: loginPassword, ...loginOthersData } = user._doc;
    res
      .cookie("access_token", loginToken, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        token: loginToken,
        ...loginOthersData,
        message: "Welcome to the TechBits.",
      });
  } catch (err) {
    next(err);
  }
};
exports.signin = async (req, res, next) => {
  try {
    const userInput = req.body.email;
    const userWithUsername = await User.findOne({ username: userInput });
    const userWithEmail = await User.findOne({ email: userInput });

    if (!userWithUsername && !userWithEmail) {
      return res.status(404).json({ error: "User Not Found." });
    }

    const user = userWithUsername || userWithEmail;
    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) {
      return res.status(404).json({ error: "Wrong Password." });
    }
    const token = jwt.sign({ id: user?._id }, process.env.JWT);
    const { password, ...othersData } = user._doc;

    res
      .cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        token: token,
        ...othersData,
        message: "Welcome to the TechBits.",
      });
  } catch (err) {
    next(err);
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const isPresent = User.findById({ userId });
    if (isPresent != null) {
      await User.deleteOne({ _id: userId });
      await Blog.deleteMany({ userId: userId });
      await Bloglikes.deleteMany({ userId: userId });
      await Draft.deleteMany({ userId: userId });
      res.status(200).json({
        message: "Deleted",
        flag: true,
      });
    } else {
      console.log(err);
      res.status(500).json({ error: "User  not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete the user." });
  }
};

// bookmarks
exports.bookmark = async (req, res) => {
  try {
    const userId = req.body.userId;
    const blogId = req.body.blogId;
    const userFound = await User.findOne({ _id: userId });

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userFound.bookmarks) {
      userFound.bookmarks = [];
    }

    const bookmarkIndex = userFound.bookmarks.indexOf(blogId);

    if (bookmarkIndex !== -1) {
      userFound.bookmarks.splice(bookmarkIndex, 1);
      await userFound.save();
      const updatedUser = await User.findOne({ _id: userId });

      res
        .status(200)
        .json({ updatedUser, message: "Bookmark Removed", bookmarked: false });
    } else {
      userFound.bookmarks.push(blogId);
      await userFound.save();
      const updatedUser = await User.findOne({ _id: userId });

      res
        .status(200)
        .json({ updatedUser, message: "Bookmarked", bookmarked: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Bookmark failed" });
  }
};
exports.getAllBookmark = async (req, res) => {
  try {
    const getAll = await User.findById(req.body.userId);
    res.status(200).json({ getAll, message: "success" });
  } catch (err) {
    res.status(500).json({ error: "Bookmark failed" });
  }
};

exports.follow = async (req, res) => {
  try {
    const { userId, followerId } = req.body;
    const [userFound, followedBy] = await Promise.all([
      User.findById(userId),
      User.findById(followerId),
    ]);

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = followedBy?.following?.includes(userId);
    const isFollower = userFound?.followers?.includes(followerId);

    if (isFollowing) {
      followedBy.following = followedBy.following.filter((id) => id !== userId);
    } else {
      followedBy.following.push(userId);
    }

    if (isFollower) {
      userFound.followers = userFound.followers.filter(
        (id) => id !== followerId
      );
    } else {
      userFound.followers.push(followerId);
    }
    const updatedFollowList = await followedBy.save();
    await userFound.save();

    res.status(200).json({ updatedFollowList, message: "Success" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update following status" });
  }
};

exports.allUser = async (req, res) => {
  try {
    const userList = await User.find();
    if (Object.keys(userList).length < 0) {
      res.status(200).json({ erros: "No data" });
    }

    res.status(200).json({ message: "success", userList });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch the user list" });
  }
};
