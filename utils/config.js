require("dotenv").config({ path: ".env" })

const PORT = process.env.PORT

const mongoUri = process.env.NODE_ENV === "test"
    ? process.env.test_mongo_Uri
    : process.env.MONGO_URI

module.exports = {
    PORT, mongoUri
}