const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  password: { type: String, required: true, unique: true, select: false },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  location: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, enum: ["user", "mucAdmin"], default: "user" },
  status: {
    type: String,
    enum: ["aktiv", "inaktiv", "ausstehend", "gesperrt"],
    default: "ausstehend",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const User = model("User", userSchema);

module.exports = User;
