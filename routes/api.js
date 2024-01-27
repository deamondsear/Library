/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../services/mongoose.js").Book;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      try {
        res.json(await Book.find());
      } catch (err) {
        res.send(err);
      }
    })

    .post(async (req, res) => {
      let title = req.body.title;
      try {
        const book = new Book({ title: title });
        await book.save();
        res.json(book);
      } catch (err) {
        res.json('missing required field title');
      }
    })

    .delete(async (req, res) => {
      try {
        await Book.deleteMany();
        res.send("complete delete successful");
      } catch (err) {
        res.json("Server error");
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      let bookid = req.params.id;
      try {
        let result = await Book.findById(bookid)
        if (result) {
          res.json(result);
        } else {
          res.json("no book exists");
        }
      } catch (err) {
        res.json("no book exists");
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!bookid) {
        res.json("Missing id");
        return;
      }
      if (!comment) {
        res.json("missing required field comment");
        return;
      }
      try {
        let result = await Book.findByIdAndUpdate(
          bookid,
          {
            $push: { comments: comment },
            $inc: { commentcount: 1 },
          },
          { new: true }
        )
        if (result) {
          res.json(result)
            } else {
          res.json("no book exists");
            }
      } catch (err) {
        res.json("no book exists");
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      try {
        let result = await Book.findByIdAndDelete(bookid);
        if (result) {
          res.json("delete successful");
        } else {
          res.json("no book exists");
        }
      } catch (err) {
        res.json("no book exists");
      }
    });
};
