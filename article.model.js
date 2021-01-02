const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: String
})

const Article = mongoose.model('Article', ArticleSchema)
module.exports = Article
