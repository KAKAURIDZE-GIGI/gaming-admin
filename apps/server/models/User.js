const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON } = require("./_transform");

// Players never expose their password hash or verification token.
const userToJSON = {
  ...toJSON,
  transform(doc, ret) {
    toJSON.transform(doc, ret);
    delete ret.password;
    delete ret.verifyToken;
    delete ret.verifyTokenExpires;
    return ret;
  },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    balance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpires: Date,
    role: { type: String, default: "player" },
  },
  { timestamps: true, toJSON: userToJSON },
);

// Hash password before save when it changed (same pattern as Admin).
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
