const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://default:1234@cluster0-hh2r8.mongodb.net/polls2019?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true });
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', 'views');
app.use('/static', express.static(path.join(__dirname, 'static')));

const schema = mongoose.Schema({
  title: String,
  description: String
});

const Poll = mongoose.model("Poll", schema);

app.get("/", async (req, res) => {
  const polls = await Poll.find();
  res.render("index", {polls});
});
app.get("/polls/new", (req, res) => {
  res.render("new");
});
app.post("/polls", async (req, res) => {
  let pollTitle = req.body.pollTitle;
  let pollDesc = req.body.pollDesc;
  Poll.create({ title: pollTitle, description: pollDesc }, err =>{
    if (err) return console.error(err);
  });
  res.redirect("/");
});
app.get("/polls/:id", async (req, res) => {
    await Poll.findById(req.params.id, (err, poll) => {
    if (err) return console.error(err);  
    poll.remove(err => {
      if (err) return console.error(err);
    });
  });
  res.redirect("/");
});

app.listen(3000, () => console.log('Listening on port 3000!'));