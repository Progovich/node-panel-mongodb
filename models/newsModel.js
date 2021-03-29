const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsScheme = new Schema(
  {
    Portal: String,
    Url: { type: String, unique: true },
    Article: String,
    Games: { type: { Develop: String, Genre: String }, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const News = mongoose.model('news', newsScheme);

module.exports = News;
