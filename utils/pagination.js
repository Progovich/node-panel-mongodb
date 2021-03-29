module.exports = async function (viewsOnPage, numberPage, news) {
  news.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  const countPage = Math.ceil(news.length / viewsOnPage);

  const start = (numberPage - 1) * viewsOnPage;

  const end = start + viewsOnPage > news.length ? news.length : start + viewsOnPage;

  const notes = news.slice(start, end);

  return { countPage: countPage, news: notes, info: `C ${start + 1} по ${end}. Всего: ${news.length}` };
};
