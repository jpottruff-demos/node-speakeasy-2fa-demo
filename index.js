const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const app = express();

// See docs for Config arguments https://www.npmjs.com/package/node-json-db
const db = new JsonDB(new Config('my-database', true, false, '/'));

app.get('/api', (req, res) => res.json({msg: 'Welcome to the 2fa Demo'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}...`));