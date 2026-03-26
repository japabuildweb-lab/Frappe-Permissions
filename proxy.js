const http = require('http');
const https = require('https');

const PORT = 8080;

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const targetUrl = req.url.slice(1);
    if (!targetUrl || !targetUrl.startsWith('http')) {
        res.writeHead(400);
        res.end('Invalid URL. Example usage: http://localhost:8080/https://api.example.com');
        return;
    }

    console.log('-> Proxying:', targetUrl);

    const options = {
        method: req.method,
        headers: { ...req.headers },
    };
    
    delete options.headers.host;
    delete options.headers.origin;
    delete options.headers.referer;

    const reqMethod = targetUrl.startsWith('https') ? https.request : http.request;

    const proxyReq = reqMethod(targetUrl, options, (proxyRes) => {
        // Copiamos las cabeceras de vuelta asegurandonos de mantener CORS
        const headers = { ...proxyRes.headers };
        headers['Access-Control-Allow-Origin'] = '*';
        
        res.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error('Error:', err);
        if (!res.headersSent) {
            res.writeHead(500);
        }
        res.end('Proxy Error: ' + err.message);
    });

    req.pipe(proxyReq, { end: true });
}).listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`      Frappe Permission Auditor Proxy    `);
    console.log(`=========================================`);
    console.log(`[+] Proxy escuchando en el puerto ${PORT}`);
    console.log(`[!] NO CIERRES ESTA VENTANA mientras uses el auditor.`);
});
