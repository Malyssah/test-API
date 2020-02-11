var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

// paramètres de connexion à la base de données
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_js_api'
});

// connexion à la base
dbConn.connect(); 


// Récupérer toutes les catégories 
app.get('/categories', function (req, res) {
    dbConn.query('SELECT * FROM categories', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'liste des catégories.' });
    });
});

// Récupérer une catégorie avec l'id
app.get('/categories/:id', function (req, res) {
    let categorie_id = req.params.id;
    if (!categorie_id) {
        return res.status(400).send({ error: true, message: 'Veuillez fournir l\'id de la categorie' });
    }
    dbConn.query('SELECT * FROM categories where id=?', categorie_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'liste des catégories.' });
    });
});


// Ajouter une nouvelle categorie
app.post('/categories', function (req, res) {
    let categorie = req.body.categorie;
    if (!categorie) {
        return res.status(400).send({ error:true, message: 'Veuillez fournir une catégorie' });
    }
    dbConn.query("INSERT INTO categories SET ? ", { categorie: categorie }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Une nouvelle catégorie a été créée avec succès.' });
    });
});

//  Mettre à jour une catégorie avec l'id
app.put('/categories', function (req, res) {
    let categorie_id = req.body.categorie_id;
    let categorie = req.body.categorie;
    if (!categorie_id || !categorie) {
        return res.status(400).send({ error: categorie, message: 'Veuillez fournir l\'id de la categorie' });
    }
    dbConn.query("UPDATE categories SET categorie = ? WHERE id = ?", [categorie, categorie_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'la catégorie a été mise à jour avec succès.' });
    });
});


//Supprimer une catégorie
app.delete('/categories', function (req, res) {
    let categorie_id = req.body.categorie_id;
    if (!categorie_id) {
        return res.status(400).send({ error: true, message: 'Veuillez fournir l\'id de la categorie' });
    }
    dbConn.query('DELETE FROM categories WHERE id = ?', [categorie_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'la catégorie a été mise à jour avec succès.' });
    });
});

// définition du port d’écoute (!= port de React) et démarrage du serveur
app.listen(5000, function () {
    console.log('Node app is running on port 5000');
});

module.exports = app;