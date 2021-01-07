const http = require('http');

const server = http.createServer((request, response) => {
    response.end('Voila la réponse du serveur ! ');
});

server.listen(process.env.PORT || 3000);