"use strict";
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(session({
            secret: 'super-super',
            resave: false,
            saveUninitialized: true
        }));
        this.express.use((req, res, next) => {
            let omni = req.session.onmi;
            if (!onmi) {
                omni = req.session.onmi = {};
            }
        });
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    routes() {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App().express;
