const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({  
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      maxlength: [20, "username max length 20 carracters"]
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password min length 8 carracters"]
    }
});

userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified()) return next();
  bcrypt.hash(user.password, 12, (err, hashedPassword) => {
    if (err) return next(err);
    user.password = hashedPassword;
    next();
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
