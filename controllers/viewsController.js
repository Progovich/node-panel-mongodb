const AppError = require('../utils/appError');
const News = require('../models/newsModel');
const pagination = require('../utils/pagination');

exports.getLoginForm = async (req, res, next) => {
  res.render('login');
};

exports.getPanel = async (req, res, next) => {
  const { page } = req.params;

  //Checking the Url for letters
  const validateUrlOnlyInt = /[^\d]/.test(page);

  if (validateUrlOnlyInt) {
    return next(new AppError('Not Found', 404));
  }

  const allNews = await News.find().lean();

  const paginationNews = await pagination(10, page, allNews);

  //Check if request page incorrect
  if (page > paginationNews.countPage || page <= 0) {
    return next(new AppError('Not Found', 404));
  }
  res.locals.data = paginationNews;
  res.render('panelDb');
};

exports.goToMainPage = async (req, res, next) => {
  return res.redirect('/page/1');
};
