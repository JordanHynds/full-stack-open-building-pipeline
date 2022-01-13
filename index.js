
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const PORT = process.env.PORT || 5001
const server = http.createServer(app)

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})

