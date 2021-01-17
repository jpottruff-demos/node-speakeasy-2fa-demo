# Node w/ Speakeasy (Two Factor Authentication/2FA)

## Overview
Made following [Brad Traversy's tutorial](https://www.youtube.com/watch?v=KQya9i6czhM&t=180s) and paritally based of [this LogRocket article](https://blog.logrocket.com/implementing-two-factor-authentication-using-speakeasy/). 

It should be noted that no password has been implemented *(obviously something you would add in)* to keep things simple. 

## Frameworks / Libraries
- [Express](https://expressjs.com/)
- [Speakeasy](https://github.com/speakeasyjs/speakeasy)
- [UUID](https://www.npmjs.com/package/uuid)
- [node-json-db](https://www.npmjs.com/package/node-json-db)
- [Google Authenticator Extension](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai?hl=en)

# Flow
1. Start it up with `npm start`
1. Run *Register User* postman request
1. Copy the **id** from the response
1. Open the *Verify* postman request and paste the above **id** into the **userId** field 
1. Open *Chrome Authenticator* and setup a new token
    - Manual Entry
    - Issuer: `2fa speakeasy`
    - Secret: `<secret from register user request>`
1. Copy the token it gives you *(eg. 6 digit number)* and paste it into the **token** field of the *Verify* request. 
1. Send the *Verify* request - it should come back *verified*. This would also change the `temp_secret` field of your user in the database to just `secret`
1. The tokens supplied by *Google Validator* will expire after a bit - you can continuously validate using the *Validate Token* postman request - simply update the token value with whatever the current valid token is from the authenticator for that user. 
