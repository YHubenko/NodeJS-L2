import http from 'http';
import { parse } from 'url';

const routes = {
    '/': {
        GET: (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Welcome to the homepage!');
        },
    },
    '/api/data': {
        GET: (req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const responseData = { message: 'Data from the API' };
            res.end(JSON.stringify(responseData));
        },
        POST: (req, res) => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const parsedBody = JSON.parse(body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(parsedBody));
            });
        },
    },
    '/api/xml': {
        GET: (req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/xml' });
            const responseData = '<data>XML Data</data>';
            res.end(responseData);
        },
    },
};

const server = http.createServer((req, res) => {
    const { pathname } = parse(req.url, true);
    const route = routes[pathname];

    if (route && route[req.method]) {
        route[req.method](req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});