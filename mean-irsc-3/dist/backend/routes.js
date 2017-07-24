"use strict";
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.sendFile('index.html');
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=routes.js.map