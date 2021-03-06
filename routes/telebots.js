const router = require("express").Router();
const telebot = require("../models/telebot");
const botCategory = require("../models/botCategories")
const User = require('../models/User');

//SET UP TELE USERNAME
router.post("/", async (req, res) => {
  try {
    const userid = req.user.id;
    const teleusername = req.body.username;
    const user = await User.findById(userid)
    const webusername = user.username
    const response = await telebot.create({
      webusername,
      teleusername,
    });

    const { _id } = response._doc;
    res.status(200).json({ id: _id });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//INITIALISE CATEGORY
router.post("/:cat", async (req, res) => {
    try {
        const category = req.params.cat;
        const response = await botCategory.create({
            category
          });
      
        const { _id } = response._doc;
        res.status(200).json({ id: _id });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

//ADD TO CATEGORY MAILING LIST
//NEED TO INITIALISE THE RECORD FOR EACH CATEGORY
router.put("/", async (req, res) => {
    const userid = req.user.id;
    const category = req.body.category;
    try {
      const user = await User.findById(userid)
      const username = user.username
      const teleDetails = await telebot.findOne( { "webusername": username } )
      const chatid = teleDetails.chatid
      const userList = await botCategory.find({
        "category": category, 
        users: chatid }
      );

      console.log(userList)
      if (userList.length === 0) {
        await botCategory.findOneAndUpdate({
          "category": category},
          { $push: { users: chatid}
        });
        res.status(200).json("Added successfully");
      } else {
        res.status(200).json("Category already added!");
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

module.exports = router;
