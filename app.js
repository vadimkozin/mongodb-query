/*
Создать простое приложение на Express.js «Записная книжка» в виде API:

Список телефонов с фамилией и именем;
Добавление нового контакта;
Редактирование старой информации;
Удаление контакта;
Поиск по номеру телефона, фамилии, имени;
Дополнительное задание:

*/
const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const api = require('./routes/api');
const app = express();
const log = console.log;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true})); 

// Инициализация (удалим всё коллекцию)
app.delete("/api/contacts/delete", api.delAll);
// добавить контакт 
app.post("/api/contacts", api.addContact);
// все контакты
app.get("/api/contacts", api.getContacts);
// найти контакт по номеру телефона, фамилии, имени
app.get("/api/contacts/tel/:id", api.findByPhoneNumber);
app.get("/api/contacts/fam/:id", api.findByFam);
app.get("/api/contacts/name/:id", api.findByName);
// удаление контакта по номеру телефона
app.delete("/api/contacts/tel/:id", api.delByPhoneNumber);
// редактирование контакта (по _id )
app.put("/api/contacts/id/:id", api.editContact);

app.all('*', (req, res) => {
    res.status(400).send('Некорректный запрос!');
});

app.use((err, req, res, next) => {   
    log(err);
    res.json(err);
});

app.listen(port, function(){
    log("Server listened at port %d", port);
});

