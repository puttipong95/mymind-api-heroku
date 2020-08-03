const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChartSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  statusChart: {
    type: String,
  },
  province: {
    type: String,
  },
  map: {
    type: String,
  },
  orther: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Chart = mongoose.model("chart", ChartSchema);
