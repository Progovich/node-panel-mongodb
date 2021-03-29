# RU

Репозиторий представляет собой backend и frontend функционал панели управления MongoDB, дана возможность выводить список всех документов с редактированием элементов. Основан на REST архитектуре. Так же встроена панель авторизации администратора, которая считывает ранее занесённый логин/пароль из БД.

Так же в качестве примера подключен функционал парсинга данных с 4 порталов новостей в БД Для последующего вывода в панель. Данные заносятся в MongoDB.

##### Для тестирования 

Следует запускать с `NODE_ENV=development` тогда в логин и пароль можно вписать любые значения и авторизация пройдёт успешно. А в куки запишется необходимый JWT.

### Панель аутентификации

При аутентификации пользователю выдаётся **JWT** токен и в дальнейшем при каждом заходе на страницу он проверяется на валидность. Токен несёт в себе payload ID пользователя MongoDB.

Данные пользователя хранятся в **MongoDB**, пароль хранится в виде хэша **bcryptjs** с **Salt Length 12**

Т.к. я использую эту панель только для администратора, то все значения заносятся в БД руками

### Панель управления БД

Панель выводит каждое свойство полученного документа. Можно изменять значение Article и оно изменится в БД.
![alt text](https://github.com/Progovich/node-panel-mongodb/tree/main/other/panel.png)

### Серверная часть

По архитектуре разведены: маршрутизация, представления, контроллеры и модели.
Подключены NPM.

- Morgan - *логирование при development запуске*
- express-rate-limit - *ограничение на количество запросов к серверу в час*
- helmet - *защита заголовков*
- express-mongo-sanitaze - *санитайзер объектов для замены спец символов*
- xss-clean - санитайзер XSS

И другие стандартные модули для поддержки работы сервера.

### ENV

В конфиг включены следующие переменные.

```
PORT=3000
MONGO=mongodb+srv://user:exampleP@test.cluster.mongodb.net/bot?retryWrites=true&w=majority
JWT_SECRET=testsecretkey
JWT_EXPIRES_IN=70d
JWT_COOKIE_EXPIRES_IN=90
TIMER_NEWS=1

# THIS VALUE ACTIVATES
# MORGAN LOGGING
# DISABLES LOGIN VERIFICATION 
NODE_ENV=development
```

# EN

The repository is a backend and frontend functionality for administrator-user authorization on Node JS. It is based on the REST architecture. The user authorization panel is also connected

##### For testing 

You should start with enviroment variable `NODE_ENV=development` then you can enter any values in the username and password and the authorization will be successful. And the JWT will be written in the cookie.

### Authentication panel

After authentication, the user receives the **JWT** token and then it is checked for validity every time the page is requested again. The token contains the MongoDB user's payload ID.

The user data is stored in **MongoDB**, the password is stored as a hash **bcryptjs** with **Salt Length 12**

I use this panel only for the administrator, all values are entered in the database independently

### DB Control Panel

The panel displays each property of the received document MongoDB. You can change the value of Article and it will change in the database.

![panel](C:\Users\Uriy\Documents\node-all-project\node-panelDB\other\panel.png)

### Server part

Server architecture contains routing, views, controllers, and models.

Dependens NPM.

- Morgan - *logging. Only development*
- express-rate-limit - *rate limit per hour*
- helmet - *security HTTP header*
- express-mongo-sanitaze - _sanitaze reserv key of MongoDB _
- xss-clean - sanitaze XSS

And other standard modules to support the work of the server.

### ENV

config.env contains this variable.

```
PORT=3000
MONGO=mongodb+srv://user:exampleP@test.cluster.mongodb.net/bot?retryWrites=true&w=majority
JWT_SECRET=testsecretkey
JWT_EXPIRES_IN=70d
JWT_COOKIE_EXPIRES_IN=90
TIMER_NEWS=1

# THIS VALUE ACTIVATES
# MORGAN LOGGING
# DISABLES LOGIN VERIFICATION 
NODE_ENV=development
```
