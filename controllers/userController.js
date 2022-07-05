const User = require('../models/user');
const Connection = require('../models/connection');
const rsvpModel = require('../models/rsvp');

exports.new = (req, res, next) => {
        return res.render('new');
 };

exports.login = (req, res, next) => {
        return res.render('login');
 };

exports.create = (req, res, next)=> {
        let user = new User(req.body);
        if(user.email) {
            user.email = user.email.toLowerCase();
        }
    user.save()
    .then(()=> {
        req.flash('success', 'User created successfully');
        res.redirect('/users/login');
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }

        if(err.code === 11000) { //duplicate key
            req.flash('error', 'Email address has been used');
            return res.redirect('/users/new');
        }
        next(err)
    });
};

exports.authenticate = (req, res, next)=>{
    //authenticate user's login request
    let email = req.body.email;
    if(email) {
        email = email.toLowerCase();
    }
    let password = req.body.password;

    //get the user that matched the email 
    User.findOne({email: email})
    .then(user=>{
        if(user) {
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id; //store user's id in the session
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    //console.log('wrong password');
                    req.flash('error', 'Wrong Password!');
                    res.redirect('/users/login');
                }
            })
        } else {
            //console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([User.findById(id), Connection.find({host: id}), rsvpModel.find({ user: id }).populate('connection')])
    .then(results=>{
        const [user, connections, rsvps] = results;
        res.render('profile', {user, connections, rsvps});
    })
    .catch(err=>next(err));
    
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else 
            res.redirect('/');
    })
}