var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
var User = require('./Users');
var jwt = require('jsonwebtoken');

var app = express();
module.exports = app; // for testing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

router.route('/users/:userId')
    .get(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.userId;
        User.findById(id, function(err, user) {
            if (err) res.send(err);

            var userJson = JSON.stringify(user);
            // return that user
            res.json(user);
        });
    });

router.route('/users')
    .get(authJwtController.isAuthenticated, function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(err);
            // return the users
            res.json(users);
        });
    });

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, message: 'Please pass username and password.'});
    }
    else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        // save the user
        user.save(function(err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists. '});
                else
                    return res.send(err);
            }

            res.json({ success: true, message: 'User created!' });
        });
    }
});

router.post('/signin', function(req, res) {
    var userNew = new User();
    userNew.name = req.body.name;
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) res.send(err);

        user.comparePassword(userNew.password, function(isMatch){
            if (isMatch) {
                var userToken = {id: user._id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, message: 'Authentication failed.'});
            }
        });


    });
});

//************************************************************************** Edited everything after this line
//THIS BLOCK OF CODE DOES NOT WORK.  WHEN I SEND A REQUEST FROM POSTMAN ALL THE DIFFERENT ROUTES ARE SKIPPED AND THERE IS
//      JUST AN "UNAUTHORIZED" MESSAGE

//need to make sure authHwtController.isAuthenticated is the one used for all the different routes
router.route("/movies")
    .post(authJwtController.isAuthenticated,function(req, res)
    {
        console.log(req.body);
        //not done with this line yet
        res.json({message: "Movie Saved", status: 200, headers: req.headers, query: req.query, env: process.env.SECRET_KEY})
    })
    .get(authJwtController.isAuthenticated,function(req,res)//get a movie/search for one ish...
    {
        console.log(req.body);
        res.json({ status: 200, message: "Movie Found", headers: req.headers, query: req.query, env: process.env.SECRET_KEY});
    })
    .put(authJwtController.isAuthenticated, function(req, res)//movie updated
    {
        console.log(req.body);
        res.json({message: "Movie Updated", status:200, headers: req.headers, query: req.query, env: process.env.SECRET_KEY});
    })
    .delete(authJwtController.isAuthenticated, function(req, res)
    {//need to make sure that this is the correct authentication needed for the delete
        console.log(req.body);
        res.json({message: "Movie Deleted", status: 200, headers: req.headers, query: req.query, env: process.env.SECRET_KEY});

    });

router.all('*', function(req, res)  //if there is a response that the server has no way to handle.
{
    res.json({error: "Unsupported HTTP Method"})
});

app.use('/', router);
app.listen(process.env.PORT || 8080);