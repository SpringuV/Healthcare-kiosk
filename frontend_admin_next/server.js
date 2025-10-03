/* eslint-disable @typescript-eslint/no-require-imports */
/* server.js */
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
require('dotenv').config(); // Load biến môi trường từ .env

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

// Cấu hình HTTPS với chứng chỉ self-signed
const httpsOptions = {
  key: fs.readFileSync(process.env.HTTPS_KEY || '../certs/localhost-key.pem'),
  cert: fs.readFileSync(process.env.HTTPS_CERT || '../certs/localhost.pem'),
};

// Lấy port từ .env hoặc mặc định 8000
const port = parseInt(process.env.PORT, 10) || 3000;

// URL cơ sở (dùng cho callbackUrl trong Auth.js)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://localhost:${port}`;

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`>> Next.js HTTPS dev server ready on ${baseUrl}`);
  });
});
