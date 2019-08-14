const fs = require('fs')
const path = require('path')
const http = require('http')
const Config = require('./config')

class ApiServer {
    constructor() {
        this.server = http.createServer((req, res) => {
            res.writeHead(200, {'Content-Type': 'application/json'})

            let routes = this.getRoutes();
            let routePrefix = Config.getApiRoutePrefix()

            routes.map(route => {
                let routePath = route.path.startsWith('/') 
                    ? route.path.slice(1)
                    : route.path;
                let fullPath = `/${routePrefix}/${routePath}`;
                console.log(req.url, fullPath)
                if (req.url === fullPath) {
                    let contentHeader = routePath === ''
                        ? {'Content-Type': 'text/html'}
                        : {'Content-Type': 'application/json'};
                    this.handleResponse(res, route.method, contentHeader)
                }
            })
        })
    }

    handleResponse(res, callback, headers) {
        res.writeHead(200, headers)
        let body = headers['Content-Type'] === 'application/json'
            ? JSON.stringify(callback())
            : callback().toString() // if the response is a View instance
        res.write(body)
        res.end()
    }

    getServer() {
        return this.server
    }

    getRoutes() {
        return require(path.join(__dirname, '..', 'server', 'routes.js'))
    }

    startListening() {
        this.getServer().listen(Config.getServerPort(), function() {
            console.log(
                [`API web server started and listening on port `.yellow, `${Config.getServerPort()}`.magenta.bold].join('')
            )
        })
    }
}

module.exports = new ApiServer()