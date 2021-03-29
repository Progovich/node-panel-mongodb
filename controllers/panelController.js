const News = require('../models/newsModel');
const AppError = require('../utils/appError');

exports.updateDb = async (req, res, next) => {
  const { _id, Article } = req.body;
  const result = await News.updateOne({ _id: _id }, { $set: { Article: Article } });

  if (!result) {
    return next(new AppError('ERROR. The document was not changed'));
  }

  res.status(200).json({ message: 'The document was changed' });
};

exports.deleteDb = async (req, res, next) => {
  const { _id } = req.body;

  const result = await News.findByIdAndDelete(_id);

  if (!result) {
    return next(new AppError('Document not Found ', 400));
  }

  res.status(200).json({ message: 'The document was deleted' });
};
