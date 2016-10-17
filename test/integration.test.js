/* global describe, it */
const { expect } = require('chai')
const { MongoClient, ObjectId } = require('mongodb')
const request = require('request')
const createApp = require('../create-app')

const TEST_DB = 'mongodb://localhost:27017/test-books'
const TEST_PORT = 1337
const TEST_BOOK = {
  _id: ObjectId(),
  title: 'TDD by Example',
  author: 'Kent Beck'
}

describe('Books API', () => {

  let db, server

  before(done => {
    MongoClient.connect(TEST_DB, (err, _db) => {
      if (err) return done(err)
      db = _db
      const app = createApp(db)
      server = app.listen(TEST_PORT, () => {
        done()
      })
    })
  })

  after(done => {
    db.close(true, () => {
      server.close()
      done()
    })
  })

  beforeEach(done => {
    const books = db.collection('books')
    books.remove(err => {
      if (err) return done(err)
      books.insert(TEST_BOOK, err => {
        if (err) return done(err)
        done()
      })
    })
  })

  describe('PUT /books/:bookId', () => {

    it('updates a book', done => {
      const uri = 'http://localhost:' +
                  TEST_PORT +
                  '/books/' + TEST_BOOK._id.toString()
      const updates = { title: 'Testing by Example' }
      request.put(uri, { json: updates }, (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.include({
          title: updates.title,
          author: TEST_BOOK.author
        })
        done()
      })
    })

  })

  describe('GET /books', () => {

    it('returns all the books', done => {
      const uri = 'http://localhost:' + TEST_PORT + '/books'
      request.get(uri, { json: true }, (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.have.lengthOf(1)
        done()
      })
    })

  })

  describe('POST /books', () => {

    it('creates a book', done => {
      const uri = 'http://localhost:' + TEST_PORT + '/books'
      const newBook = { title: 'Programming', author: 'Some Guy' }
      request.post(uri, { json: newBook }, (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 201)
        expect(body).to.include({
          title: newBook.title,
          author: newBook.author
        })
        expect(body).to.have.property('_id')
        done()
      })
    })

  })

})
