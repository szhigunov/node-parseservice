const express = require('express');
const passport = require('passport');
const path = require('path'); // модуль для парсинга пути
const app = express();

require('../auth/auth.js');

// отдаем стандартную фавиконку, можем здесь же свою задать
app.use(require('serve-favicon')('public/favicon.ico'));

// выводим все запросы со статусами в консоль
app.use(require('morgan')('dev'));

// стандартный модуль, для парсинга JSON в запросах
app.use(require('body-parser').json());

// модуль для простого задания обработчиков путей
// app.use(require('restful-router'));

// запуск статического файлового сервера,
// который смотрит на папку public/
// (в нашем случае отдает index.html)
app.use(require('serve-static')(path.join(__dirname, "public")));
app.use(passport.initialize());

module.exports = app;
