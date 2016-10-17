const express = require('express')
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')

function createApp(db) {

  const books = db.collection('books')
  const app = express()

  app.use(bodyParser.json())

  app.get('/books', (req, res) => {
    books.find().toArray((err, docs) => {
      if (err) return res.sendStatus(500)
      res.json(docs)
    })
  })

  app.post('/books', (req, res) => {
    books.insert(req.body, (err, result) => {
      if (err) return res.sendStatus(500)
      const doc = result.ops[0]
      res.status(201).json(doc)
    })
  })

  app.put('/books/:bookId', (req, res) => {
    const update = req.body
    let _id
    try {
      _id = ObjectId(req.params.bookId)
    }
    catch (err) {
      return res.sendStatus(500)
    }
    books.update({ _id }, { $set: req.body }, err => {
      if (err) return res.sendStatus(500)
      books.findOne({ _id }, (err, doc) => {
        if (err) return res.sendStatus(500)
        res.json(doc)
      })
    })
  })

  return app
}

module.exports = createApp
