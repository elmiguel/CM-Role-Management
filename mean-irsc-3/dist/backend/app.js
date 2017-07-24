"use strict";
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.NODE_ENV || 3000;
app.use(express.static(path.join(__dirname, '../', 'frontend')));
app.use(require('./routes').default());
app.listen(port);
//# sourceMappingURL=app.js.map