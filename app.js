'use strict';

module.exports = (rootDir) => {
    require('./database');
    // require('./cache');
    const compression = require('compression');
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const session = require('express-session');
    const flash = require('connect-flash');
    const routers = require('./routes');

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
    app.use(compression());
    app.use(express.static('static', {
        maxAge: 31536000,
        setHeaders: (res, path) => {
            const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.');
            if (path.endsWith('.html')) {
                // All of the project's HTML files end in .html
                res.setHeader('Cache-Control', 'no-cache');
            } else if (hashRegExp.test(path)) {
                // If the RegExp matched, then we have a versioned URL.
                res.setHeader('Cache-Control', 'max-age=31536000');
            }
        },
    }));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/', routers)

    app.use(function (req, res, next) {
        const Mobile = require('./helpers/is-mobile')
        res.status(404);
        if (req.accepts('html')) {
            res.render('error', {
                pageTitle: 'Error',
                isMobile: Mobile(req),
                isFooter: false
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
            console.error(err)
            const Mobile = require('./helpers/is-mobile')
            res.status(404);
            if (req.accepts('html')) {
                res.render('error', {
                    pageTitle: 'Error',
                    isMobile: Mobile(req),
                    isFooter: false
                });
                return;
            }
            if (req.accepts('json')) {
                res.send({ error: 'Not found' });
                return;
            }
            res.type('txt').send('Not found');
        }
        next();
    });
    return app;
}