//packages/npm libraries
const express = require("express");
const app = express();
const Listing = require("./models/listings.js");
const mongoose = require("mongoose");
const path = require("path");
const Chats = require("./models/chats.js");
const runChat = require("./config/gemini");
const methodOverride = require("method-override");
// const prompt =
//   "Print a given matrix in spiral form using the simulation approach using c++";
app.set("view engine", "ejs");
app.set("/views", path.join(__dirname + "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then((res) => {
    console.log("connnect success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/codeNivaran");
}
// let sampleData = new Listing({
//   username: "bhargav",
//   email: "bhargav@gmail.com",
//   password: "hey@123",
// });
// sampleData.save();
app.get("/", (req, res) => {
  res.render("landing");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/authorize", (req, res) => {
  res.render("authorize");
});
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  await Chats.findByIdAndDelete(id);
  res.redirect("/dispChats");
});
app.post("/signup", async (req, res) => {
  const newListings = new Listing(req.body);
  await newListings.save();
  //   console.log(req.body);
  res.redirect("/");
});
app.get("/chats", async (req, res) => {
  const Allchats = await Chats.find({});
  res.render("chat", { Allchats });
});
app.post("/chats", async (req, res) => {
  const newChat = new Chats(req.body);
  await runChat(newChat.prompted);
  // const Allchats = await Chats.find({});
  res.redirect("/dispChats");
});

app.get("/dispChats", async (req, res) => {
  const Allchats = await Chats.find({});
  res.render("dispChats.ejs", { Allchats });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/home", async (req, res) => {
  let { username, password } = req.body;
  let searchedUser = await Listing.findOne({ username });
  if (searchedUser.password === password) {
    res.redirect("/chats");
  } else {
    res.render("error");
  }
});
app.get("/mainchat", (req, res) => {
  res.render("mainchat");
});

const PORT = 3028; // Change to a different port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/history", async (req, res) => {
  const Allchats = await Chats.find({});
  res.render("history.ejs", { Allchats });
});
