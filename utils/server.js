const fs = require('fs')
const path = require('path')
const http = require('http')
const Config = require('./config')

class ApiServer {
    constructor() {
        this.server = http.createServer((req, res) => {
            res.writeHead(200, {'Content-Type': 'application/json'})

            let routes = this.getRoutes();
            routes.map(route => {
                console.log(req.url, route.path)
                if (req.url === route.path) {
                    res.write(JSON.stringify(route.method()))
                    res.end()
                }
            })
        })
    }

    getServer() {
        return this.server
    }

    getRoutes() {
        return require(path.join(__dirname, '..', 'server', 'routes.js'))
    }

    startListening() {
        this.getServer().listen(3000, function() {
            console.log(
                [`API web server started and listening on port `.yellow, Config.getServerPort().magenta.bold].join('')
            )
        })
    }
}

module.exports = new ApiServer()