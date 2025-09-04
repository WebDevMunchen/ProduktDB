const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  password: { type: String, required: true, unique: true, select: false },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const User = model("User", userSchema);

module.exports = User;
