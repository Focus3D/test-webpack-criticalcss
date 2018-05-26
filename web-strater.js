const express = require('express');
const expressStaticGzip = require('express-static-gzip');

const path = require('path');

const app = express();
const DIST_DIR = path.resolve(__dirname, './dist/');

app.use(
  '/',
  expressStaticGzip(DIST_DIR, {
    enableBrotli: true
  })
);

app.listen(8000);
