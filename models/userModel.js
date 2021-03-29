const mongoose = require('mongoose');

const { Schema } = mongoose;

const configSchema = new Schema(
  {
    increment: { percent: Boolean, summation: Boolean },
    volume: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Config = mongoose.model('config', configSchema);

module.exports = Config;
