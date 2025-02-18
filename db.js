const { MongoClient } = require("mongodb")

let dbConnection
let uri = 'mongodb+srv://user2000:test123@bookstore.vcmdi.mongodb.net/bookstore?retryWrites=true&w=majority&appName=BookStore'

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}