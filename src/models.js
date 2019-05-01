"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("io-ts");
exports.Issue = t.type({
    title: t.string,
    url: t.string
});
