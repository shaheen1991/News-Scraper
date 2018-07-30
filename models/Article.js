var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create a new ArticleSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

// This creates our model from the above schema using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;