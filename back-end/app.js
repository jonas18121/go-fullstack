const express = require('express');

const app = express();

app.use((request, response) => {
    response.json({message: 'Votre requête a bien été reçue !'});
});

module.exports = app;