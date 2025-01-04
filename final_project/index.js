const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ 
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true 
}))

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authenication mechanism here
    // Check if the user is logged in by verifying the session
    if (req.session.authorization) {
        // Extract the token from the session
        const token = req.session.authorization['accessToken'];

        // Verify the token
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                // If the token is valid, attach the user to the request object
                req.user = user;
                next(); // Proceed to the next middleware or route handler
            } else {
                // If the token is invalid, return an unauthorized error
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        // If there is no session authorization, return an unauthorized error
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 3333;



app.listen(PORT, () => console.log("Server is running"));
