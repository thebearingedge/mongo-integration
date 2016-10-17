const createApp = require('./create-app')
const { MongoClient } = require('mongodb')

MongoClient.connect(process.env.MONGODB_URI, (err, db) => {

  const app = createApp(db)

  app.listen(process.env.PORT)
})
