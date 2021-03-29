/* eslint-disable security/detect-object-injection */
module.exports = async function getIgromania(axios) {
  try {
    const newsObject = {};
    const html = await axios.get('https://www.igromania.ru/news/');
    const linknews = html.data
      .match(/href="\/news\/.+html/g)
      .map((elem) => elem.replace(/href="/, ''))
      .filter((elem, index, array) => {
        return elem !== array[index + 1];
      });

    for (let i = 0; i < 10; i++) {
      const htmlNewsPage = await axios.get(`https://www.igromania.ru${linknews[i]}`);
      if (!/Игра в материале/i.test(htmlNewsPage.data)) continue;
      const article = htmlNewsPage.data.match(/headline.+?>(.+?)<\/h1/)[1];
      const gameName = htmlNewsPage.data.match(/rbox_info_ttl t_18">(.+?)<\/div>/)[1].replace(/&nbsp;2/, '');
      const gameGenre = htmlNewsPage.data
        .match(/Жанр:.+?haveselect">.+?<\/div>/g)[0]
        .match(/ect">.+?<\/span/g)
        .map((elem) => elem.match(/>(.+?)</)[1]);
      const gamesDevelop = htmlNewsPage.data.match(/Разработчик:.+">(.+)<\/a><\/span>/);
      newsObject[`https://www.igromania.ru${linknews[i]}`] = {
        Portal: 'Igromania',
        Article: article,
        Url: `https://www.igromania.ru${linknews[i]}`,
        Games: { [gameName]: { Genre: gameGenre, Develop: gamesDevelop ? gamesDevelop[1] : null } },
      };
    }
    return newsObject;
  } catch (error) {
    console.log(error);
    return {};
  }
};
