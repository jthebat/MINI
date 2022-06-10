const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({   //다른 곳은 new 안쓰는데 차이가 ??

  user_id: String,
  profile_image: Number,
  nickname: String,
  password: String,
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);


