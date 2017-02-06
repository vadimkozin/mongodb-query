// маршруты
/*
интерфейс:
const api = require('./routes/api')
api.addContact          - добавить контакт     
api.editContact         - редактировать контакт
api.delContact          - удалить контакт
api.getContacts         - вернуть все контакты
api.findByPhoneNumber   - найти контакт по номеру телефона
api.findByFam           - найти контакт по фамилии
api.findByName          - найти контакт по имени
*/
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const url = "mongodb://localhost:27017/contacts";
const nameCollection = 'contacts';

const log = console.log;

// удалить всё коллекцию
exports.delAll = function(req, res, next) {
    mongoClient.connect(url, function(err, db) {  
        db.collection(nameCollection).drop(function(err, result) {         
            log(result);
            res.json({result: result});
            db.close();
        });
    });
}

// добавить контакт
exports.addContact = function(req, res, next) {    
    if(!req.body) return res.sendStatus(400);
     
    const name = req.body.name;
    const fam = req.body.fam;
    const number = req.body.number;
    const user = {name, fam, number};
    
    if (!(name && fam && number)) { 
        return res.status(400).json({message: 'для добавления надо указать надо указать все поля: name, fam, number'});
    }
     
    mongoClient.connect(url, function(err, db){
        db.collection(nameCollection).insertOne(user, function(err, result){
             
            if(err) return res.status(400).send();
             
            res.send(user);
            db.close();
            log('add:', user);
        });
    });
}

// вернуть все контакты
exports.getContacts =  function(req, res, next) {
    mongoClient.connect(url, function(err, db){
        db.collection(nameCollection).find({}).toArray(function(err, users) {
            res.send(users)
            db.close();
            log('get users:', users);
        });
    });
}

// поиск контакта по номеру телефона
exports.findByPhoneNumber =  function(req, res, next) {
    let number = req.params.id;
    if (!number) { 
        return res.status(400).json({message: 'для поиска по номеру надо указать поле: number'});
    }
  
    mongoClient.connect(url, (err, db) => {
        db.collection(nameCollection).findOne({number: number}, (err, user) => {
             
            if(err) return res.status(400).send();
            if (!user) return res.status(404).json({message: contactNoExist('tel', number)});

            res.send(user);

            db.close();
            log('get contact by number:', number, ', user:', user);
        });
    });
}

// поиск контакта по фамилии
exports.findByFam =  function(req, res, next) {
    let fam = req.params.id;
    if (!fam) { 
        return res.status(400).json({message: 'для поиска по фамилии надо указать поле: fam'});
    }
  
    mongoClient.connect(url, (err, db) => {
        db.collection(nameCollection).find({fam:fam}).toArray(function(err, users) {
            if(err) return res.status(400).send();
            if (users.length == 0) return res.status(404).json({message: contactNoExist('fam', fam)});
            res.send(users)
            db.close();
            log('get contats by fam:', fam, ', users:', users);
        });
    });
}

// поиск контакта по имени
exports.findByName =  function(req, res, next) {
    let name = req.params.id;
    if (!name) { 
        return res.status(400).json({message: 'для поиска по имени надо указать поле: name'});
    }
  
    mongoClient.connect(url, (err, db) => {
        db.collection(nameCollection).find({name:name}).toArray(function(err, users) {
            if(err) return res.status(400).send();
            if (users.length == 0) return res.status(404).json({message: contactNoExist('name', name)});
            res.send(users)
            db.close();
            log('get contats by name:', name, ', users:', users);
        });
    });
}

// удалить контакт по номеру телефона
exports.delByPhoneNumber =  function(req, res, next) {
    let number = req.params.id;

    mongoClient.connect(url, (err, db) => {

        db.collection(nameCollection).findOneAndDelete({number: number}, function(err, result) {
                     
            if(err) return res.status(400).send();

            let user = result.value;
            if (!user) return res.status(404).json({message: contactNoExist('tel', number)});

            res.send(user);

            db.close();
            log('del number:', number, '--> user:', user);
        });
    });
}

// редактировать контакт (по уникальному коду записи)
exports.editContact =  function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    //const id = new objectId(req.body.id);
    const id = new objectId(req.params.id);
    const name = req.body.name;
    const fam = req.body.fam;
    const number = req.body.number;

    if (!(name || fam || number)) { 
        return res.status(400).json({message: 'для обновления надо указать хотя бы одно поле из: name, fam, number'});
    }
    let setUpdate = {};
    if (name) setUpdate.name = name;
    if (fam) setUpdate.fam = fam;
    if (number) setUpdate.number = number;
    
    mongoClient.connect(url, function(err, db) {
        db.collection(nameCollection).findOneAndUpdate({_id: id}, { $set: setUpdate }, {returnOriginal: false }, 
             function(err, result) {
             
                if(err) return res.status(400).send();
             
                const user = result.value;
                res.send(user);
                db.close();
                log('edit id:', id, 'user:', user);
            });
    });
}

function contactNoExist(key, data) {
    return `Контактов с ${key}:${data} не найдено.`;
}