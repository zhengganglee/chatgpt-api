import http from 'http';
import qs from 'querystring';
import { exec } from 'child_process';

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const params = qs.parse(body);
            const prompt = params.prompt;
            const cmd = `npx tsx demos/app.ts ${prompt}`;
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Command execution failed: ${error}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(stdout);
                }
            });
        });
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid request');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
