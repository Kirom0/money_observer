## Описание

Money-observer - Fullstack приложение предназначенное для отслеживания личных финансов. Frontend написан на [React](https://github.com/facebook/react), Backend на [Nest](https://github.com/nestjs/nest).

## Демонстрация

[![Watch the video](https://i.ibb.co/d50mTn0/Preview.png)](https://youtu.be/gecc7Umghek)

## Использованные технологии
<ul>
  <li>`React` - https://github.com/facebook/react</li>
  <li>`Nest` - https://github.com/nestjs/nest</li>
  <li>База данных - `Mongoose` - https://github.com/Automattic/mongoose</li>
  <li>Управление данными - `Redux`, `react-redux`, `redux-thunk` - https://github.com/reduxjs/redux, https://github.com/reduxjs/react-redux, https://github.com/reduxjs/redux-thunk</li>
  <li>Сборщик - `Webpack` - https://github.com/webpack/webpack</li>
  <li>Язык - `TypeScript` - github.com/Microsoft/TypeScript</li>
</ul>

## Установка

```bash
$ npm install
$ cd client && install
```

Затем в корневой папке необходимо создать файл `development.env` со следующими полями:
```
DB_LOGIN=*Логин в базе данных Mongo*
DB_PASSWORD=*Пароль*
DB_NAME=*Имя базы данных*

VK_CLIENT_ID=*Поле client_id приложения в ВК, предназначенного для авторизации пользователей*
VK_CLIENT_SECRET=*Поле client_secret*
VK_REDIRECT_URI=*Текущее доменное имя приложения, например: http://localhost:3000/*
```

## Запуск

```bash
# development
$ npm run all:dev
```

## Контакты

- Author: Кирилл Мещеряков - kiromekexity@gmail.com
