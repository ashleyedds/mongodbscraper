const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const method = require("method-override");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use(method("_method"));
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongoscraper");

// app.get("/", function(req, res) {
// db.Article.find({}, null, {sort: {created: -1}}, function(err, data) {
//       if(data.length === 0) {
//         res.render("placeholder", {message: "Click the scrape button to populate."});
//       }
//       else {
//         res.render("index", {articles: data});
//       }
//     })
//   });

app.get("/scrape", (req, res) => {
    axios.get("https://www.huffingtonpost.com/section/travel").then(function(response) {
        var $ = cheerio.load(response.data);

        $(".card__headline__text").each(function(i, element) {
            var result = {};

            result.title = $(this).text();
            result.link = $(this)
                .parent()
                .attr("href");

            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
        });

        res.send("Scrape Complete");
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({})
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.get("/articles/:id", (req, res) => {
    db.Artcile.findOne({ _id: req.params.id })
        .populate("note")
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then((dbNote) => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});

