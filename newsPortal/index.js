const axios = require('axios');
const News = require('../models/newsModel');

const igromaniaNews = require('./igromania');
const kanobuNews = require('./kanobu');
const playGroundNews = require('./playGround');
const stopGameNews = require('./stopGame');

module.exports = async function getNews() {
  const stopGamePart = await stopGameNews(axios);
  const igromaniaPart = await igromaniaNews(axios);
  const kanobuPart = await kanobuNews(axios);
  const playGroundPart = await playGroundNews(axios);

  const news = { ...igromaniaPart, ...kanobuPart, ...playGroundPart, ...stopGamePart };

  for (const key in news) {
    if (news.hasOwnProperty(key)) {
      try {
        await News.create(news[key]);
        console.log('Новая новость!');
      } catch (error) {
        console.log('Дублирование');
        continue;
      }
    }
  }
};
