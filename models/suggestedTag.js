const mongoose = require("mongoose");

const suggestedTagSchema = new mongoose.Schema(
  {
    //the user who sent the request....
    tagTitle: {
      type: "String",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const SuggestedTag = mongoose.model("SuggestedTag", suggestedTagSchema);
module.exports = SuggestedTag;
