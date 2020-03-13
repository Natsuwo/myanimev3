'use strict';

module.exports = (rootDir) => {
    require('./database')
    const express = require('express')
    const app = express()
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser');
    const session = require('express-session')
    const flash = require('connect-flash');
    const routers = require('./routes')

    app.use(session({
        secret: process.env.SESSION_SECRET,
        name: '_session',
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

    // Engine 
    app.set('views', 'views')
    app.set('view engine', 'pug')
    // App Use
    app.use(flash())
    app.use(cookieParser(process.env.SESSION_SECRET))
    app.use(express.static('static'));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/', routers)

    app.use(function (req, res, next) {
        res.status(404);
        if (req.accepts('html')) {
            res.render('404', {
                pageTitle: 'Myanime - Error',
                layout: '404',
                message: req.flash(),
            });
            return;
        }
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }
        res.type('txt').send('Not found');
    });


    app.use((err, req, res, next) => {
        if (err) {
            return res.status(403).send(err.message);
        }
        next();
    });

    return app;
}