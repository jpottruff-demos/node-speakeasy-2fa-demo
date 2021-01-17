const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const app = express();
app.use(express.json());

// See docs for Config arguments https://www.npmjs.com/package/node-json-db
const db = new JsonDB(new Config('my-database', true, false, '/'));


// ROUTES
app.get('/api', (req, res) => res.json({msg: 'Welcome to the 2fa Demo'}));

// Register user and create a temp secret
// NOTE: there would normally be some password authentication that goes along with this
app.post('/api/register', (req, res) => {
    const id = uuid.v4();

    try {
        // JSON DB stuff
        const path = `/user/${id}`;

        const temp_secret = speakeasy.generateSecret();

        db.push(path, {id, temp_secret});
        res.json({id, secret: temp_secret.base32});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `Error generating the secret: ${error}`});
    }
});

// Verify the token and make the secret permanent
app.post('/api/verify', (req, res) => {
    const {token, userId} = req.body;

    try {
        const path = `/user/${userId}`;
        const user = db.getData(path);

        const {base32:secret } = user.temp_secret
        
        // See docs: https://github.com/speakeasyjs/speakeasy
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        });

        if (verified) {
            db.push(path, {id: userId, secret: user.temp_secret})
            res.json({ verified: true });
        } else {
            res.json({verified: false, msg: 'handle in front end somehow'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: `Error finding user: ${error}`})
    }
});

// Validate the token
app.post('/api/validate', (req, res) => {
    const {token, userId} = req.body;

    try {
        const path = `/user/${userId}`;
        const user = db.getData(path);

        // NOTE: no longer temp_secret
        const {base32:secret } = user.secret
        
        // See docs: https://github.com/speakeasyjs/speakeasy
        const tokenValidates = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (tokenValidates) {
            res.json({ validatedToken: true });
        } else {
            res.json({ validatedToken: false, msg: 'handle in front end somehow'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: `Error validating token: ${error}`})
    }
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}...`));