const Connection = require('../models/connection');

//check is user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }
};

//check if the user is authenticated
exports.authenticate = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

//check is user is author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id
    Connection.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.host == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
           err.status = 404;
           next(err);
        }
    })
    .catch(err=>next(err));
};

