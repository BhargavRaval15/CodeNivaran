const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: String,
  password: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
