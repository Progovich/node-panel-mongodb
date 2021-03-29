module.exports = async function getPlayGround(axios) {
  try {
    const newsObject = {};

    const html = await axios.get('https://www.playground.ru/news');
    const linknews = html.data
      .match(/href="https:\/\/www.playground.+?\d\d\d+?">/g)
      .map((elem) => elem.replace(/href="/, '').replace(/">/g, ''))
      .filter((elem, index, array) => {
        return (
          elem !== array[index + 1] && !/#commentsList/.test(elem) && !/misc/.test(elem) && !/css/.test(elem)
        );
      });

    for (let i = 0; i < 10; i++) {
      let gameGenre;
      const htmlNewsPage = await axios.get(linknews[i]);
      const article = htmlNewsPage.data.match(/headline">(.+?)<\/h1>/i)[1].replace(/&quot;/g, '');
      const gameName = htmlNewsPage.data.match(/muted">\n(.+?)\n/)[1].trim();
      const gameLinkProfile = htmlNewsPage.data.match(/gp-game-title.+\n.+?href="(\/.+?)"/);
      const htmlGameProfile = await axios.get(`https://www.playground.ru${gameLinkProfile[1]}`);
      const gamesDevelop = /разработчик/i.test(htmlGameProfile.data)
        ? htmlGameProfile.data.match(/разработчика.+\n.+name">(.+?)<\/sp/)[1]
        : null;
      if (/genre[^s]/.test(htmlGameProfile.data)) {
        gameGenre = htmlGameProfile.data
          .match(/class="genres".+?<\/div>/s)[0]
          .match(/[а-я]+[^"</a>]+/gi)
          .filter((elem, index, array) => {
            return elem !== array[index + 1];
          })
          .join(', ');
      }
      newsObject[linknews[i]] = {
        Portal: 'Playground',
        Article: article,
        Url: linknews[i],
        Games: { [gameName]: { Genre: gameGenre, Develop: gamesDevelop } },
      };
    }
    return newsObject;
  } catch (error) {
    console.log(error);
    return {};
  }
};
