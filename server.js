const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');

//require all models
const db = require("./models");

const PORT = process.env.PORT || 8080;

//initialize express
const app = express();

//body-parser for handling submissions
app.use(bodyParser.urlencoded({
    extended: true
}));

// express.static to serve public folder as static directory
app.use(express.static("public"));

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

  app.get('/', function (req, res) {
    res.render('index');
});


//routes

app.get('/articles', function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data)
        }
    });
});

app.get("/scrape", function (req, res) {

    request("https://theplaylist.net/category/news", function (error, response, html) {

        let $ = cheerio.load(html);

        let allArticles = [];

        $("article").each(function (i, element) {

            let result = {}

            result.title = $(this).find("h2").text().trim();
            result.excerpt = $(this).find(".cb-excerpt").text().trim();
            result.link = $(this).find("a").attr("href");

            allArticles.push(result);

        })

            Promise
            .all(allArticles).then(function(newArticles)  {
                newArticles.forEach(function (eachArticle) {
                    db.Article.create(eachArticle)
                    .then(function (tvmoviedb) {
                        console.log(tvmoviedb)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                    
                })
            })
                

        // res.send('scrape complete');

    });
});


app.get('/articles/:id', function (req, res) {
    db.Article.findOne({
            _id: req.params.id
        })
        .populate("comment")
        .then(function (tvmoviedb) {
            res.json(tvmoviedb);
        })
        .catch(function (err) {
            res.json(err)
        })
})

app.post("/submit/:id", function (req, res) {

            db.Comment.create(req.body)
                .then(function (dbComment) {

                return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
                })
                .then(function(tvmoviedb) {
    
                    res.json(tvmoviedb);
                  })
                  .catch(function(err) {

                    res.json(err);
                  });
              });


        //server
        app.listen(PORT, function () {
            console.log("App running on port " + PORT + "!");
        });