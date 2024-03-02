const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:3000'
}));


app.use('/*', createProxyMiddleware({
    target: 'https://example.com', // default
    router: function(req) {
        console.log("proxy", req.params[0]);
        return req.params[0];
    },
    changeOrigin: true,
    pathRewrite: {
        '^/': '',
    },
    followRedirects: true,
    // onProxyRes: function (proxyRes, req, res) {
    //     console.log('RAW Response from the target', { req, res }, JSON.stringify(proxyRes.headers, true, 2));
    // },
}));

app.listen(3001);
