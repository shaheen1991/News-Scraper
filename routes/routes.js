var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models/index.js");


// Export our routes
module.exports = function (app) {


  // GET to load all unsaved articles
  app.get("/", function (req, res) {
    db.Article.find({
        saved: false
      })
      .then(function (dbArticle) {
        let hbsObject = {
          articles: dbArticle
        };
        res.render("allarticles", hbsObject);
      })
      .catch(function (err) {
        res.json(err);
      });
  });


  // GET to scrape new articles
  app.get("/scrape", function (req, res) {

    // Load the Articles document into a local array/object
    db.Article.find({}, function (err, dbArticles) {

      // Get the website data
      axios.get("http://www.nytimes.com/").then(function (response) {

        // Load into cheerio for scraping by element(s)
        let $ = cheerio.load(response.data);
        let counter = 0;

        // Loop through all the results that have article, story and h2 elements.
        $("article.story").has("h2").each(function (i, element) {

          let result = {};
          result.title = $(element).children("h2").children("a").text();
          result.link = $(element).children("h2").children("a").attr("href");
          result.summary = $(element).children("p.summary").text();

          // Check for duplicates
          let duplicate = false;
          for (let i = 0; i < dbArticles.length; i++) {
            if (dbArticles[i].title === result.title) {
              duplicate = true;
              break;
            }
          }

          // Create article only if not a duplicate and all three have values
          if (!duplicate && result.title && result.link && result.summary) {
            db.Article.create(result);
            counter++;
          }

        });
        // Return number of artices added
        res.json({
          count: counter
        });

      });
    });
  });


  // GET to load all saved articles
  app.get("/saved", function (req, res) {
    db.Article.find({
        saved: true
      })
      .then(function (dbArticle) {
        let hbsObject = {
          articles: dbArticle
        };
        res.render("savedarticles", hbsObject);
      })
      .catch(function (err) {
        res.json(err);
      });
  });


  // GET to load a specific article and its notes
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
      })
      .populate("notes")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });


  // POST to create an article's note
  app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findByIdAndUpdate({
          _id: req.params.id
        }, {
          $push: {
            notes: dbNote._id
          }
        }, {
          new: true
        });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });


  // POST to save an article
  app.post("/savearticle/:id", function (req, res) {
    db.Article.findByIdAndUpdate({
        _id: req.params.id
      }, {
        saved: true
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      })
  });


  // POST to delete a saved article
  app.post("/deletearticle/:id", function (req, res) {
    db.Article.findByIdAndUpdate({
        _id: req.params.id
      }, {
        saved: false
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      })
  });


  // POST to delete a note
  app.post("/deletenote/:id", function (req, res) {
    db.Note.remove({
        _id: req.params.id
      })
      .then(function (dbNote) {
        res.json(dbNote);
      })
      .catch(function (err) {
        res.json(err);
      })
  });


  // GET to clear the database (used for testing purposes)
  app.get("/cleardb", function (req, res) {
    db.Article.remove({})
      .then(function () {
        res.send("Cleared!");
      })
      .catch(function (err) {
        res.json(err);
      })
  });


}