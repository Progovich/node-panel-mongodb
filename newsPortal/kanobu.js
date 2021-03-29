module.exports = async function kanobu(axios) {
  try {
    const newsObject = {};

    const html = await axios.get('https://kanobu.ru/news/videogames/');
    const linkNews = html.data
      .match(/href="\/news\/\w.+?"/g)
      .map((elem) => elem.replace(/href="/, '').replace(/"/g, ''))
      .filter((elem, index, array) => {
        return elem !== array[index + 1] && !/#comments_block/.test(elem);
      });

    for (let i = 0; i < 10; i++) {
      const fullUrl = `https://kanobu.ru${linkNews[i]}`;
      const htmlNewsPage = await axios.get(fullUrl);
      if (!/Игры в материале/.test(htmlNewsPage.data)) continue;
      const gamelink = htmlNewsPage.data
        .match(/Игры в материале.+?\/games\/.+?aside/s)[0]
        .match(/href=".+?"/g)
        .map((elem) => elem.match(/"(.+?)"/)[1]);
      const article = htmlNewsPage.data.match(/<h1>(.+?)<\/h1>/)[1].replace(/&nbsp;/, ' ');

      newsObject[fullUrl] = {
        Portal: 'Kanobu',
        Article: article,
        Url: fullUrl,
        Games: {},
      };

      for (let j = 0; j < gamelink.length; j++) {
        const htmlGameProfile = await axios.get(`https://kanobu.ru${gamelink[j]}`);
        const gameName = htmlGameProfile.data.match(/game-header.+?>(.+?)</)[1];
        const gamesDevelop = htmlGameProfile.data.match(/Разработчик.+?\/">(.+?)<\/a/)[1];
        const gameGenre = htmlGameProfile.data
          .match(/genres.+?<\/ul>/i)[0]
          .match(/new\/">.+?</g)
          .map((elem) => elem.match(/>(.+?)</)[1]);
        newsObject[fullUrl]['Games'][gameName] = { Genre: gameGenre, Develop: gamesDevelop };
      }
    }
    return newsObject;
  } catch (error) {
    console.log(error);
    return {};
  }
};
