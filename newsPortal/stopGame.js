/* eslint-disable security/detect-object-injection */
module.exports = async function getStopGame(axios) {
  try {
    const newsObject = {};

    const html = await axios.get('https://stopgame.ru/news').catch((err) => console.log(err));
    const linknews = html.data.match(/\/newsdata\/\d+/g).filter((elem, index, array) => {
      return elem !== array[index + 1] && elem !== array[index + 2];
    });
    for (let i = 0; i < 10; i++) {
      const fullUrl = `https://stopgame.ru${linknews[i]}`;

      const htmlNewsPage = await axios.get(fullUrl);

      if (!/из новости/.test(htmlNewsPage.data)) continue;
      const article = htmlNewsPage.data.match(/article-title.+?>(.+?)<\/h1/)[1].replace(/&nbsp;/, ' ');
      const gamelink = htmlNewsPage.data
        .match(/items.+?prompt/s)[0]
        .match(/summary.+?href=".+?"/gs)
        .map((elem) => elem.match(/href="(.+?)"/)[1]);

      newsObject[fullUrl] = {
        Portal: 'StopGame',
        Article: article,
        Url: fullUrl,
        Games: {},
      };
      for (let j = 0; j < gamelink.length; j++) {
        const htmlGameProfile = await axios
          .get(`https://stopgame.ru${gamelink[j]}`)
          .catch((err) => console.log(err));

        const gameName = htmlGameProfile.data.match(/article-title.+?href.+?">([^<]+)/s)[1];
        const gamesDevelop = htmlGameProfile.data
          .match(/Разработчик.+?div/s)[0]
          .match(/>\w+[^<]/g)
          .join(', ')
          .replace(/>/g, '');
        const gameGenre = htmlGameProfile.data
          .match(/Жанр.+?div/s)[0]
          .match(/">\n.+?<\/a/gis)
          .map((e) => e.match(/\n(.+?)\n/)[1]);
        newsObject[fullUrl].Games[gameName] = { Genre: gameGenre, Develop: gamesDevelop };
      }
    }
    return newsObject;
  } catch (error) {
    console.log(error);
    return {};
  }
};
