const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON } = require("./_transform");

const adminToJSON = {
  ...toJSON,
  transform(doc, ret) {
    toJSON.transform(doc, ret);
    delete ret.password; // never expose the hash
    return ret;
  },
};

const adminSchema = new mongoose.Schema(
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
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true, toJSON: adminToJSON },
);

// Hash password before save when it changed.
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
