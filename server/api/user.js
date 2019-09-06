const route = require("express").Router();
const User = require("../models/user");

route.get("/api/getuserinfos", async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({user: 'not connected'});
  try {
    const id  = req.user._id;
    console.log('req id=', id)
    const user = await User.findById(id);
    if(user){
        res.status(200).json({id:user._id, username: user.username});
    }else{
        res.status(300).json('not found')
    }
  } catch (error) {
    res.status(500).json({error:'server error'});
  }
});


module.exports = route;