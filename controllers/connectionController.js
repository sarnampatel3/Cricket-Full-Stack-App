const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');
const {profile} = require('./userController');

exports.index = (req, res, next) => {
   model.find()
   .then(connections=> {
      let topics = model.getTopics(connections);
      console.log(topics);
      res.render('./connection/index', {connections, topics})}
      )
   .catch(err=>next(err));
   
};

exports.new = (req, res) => {
    res.render('./connection/new');
};

exports.create = (req, res, next) =>{
    let connection = new model(req.body); //created a new connection document
    connection.host = req.session.user;
    connection.save() //insert the document to the database
    .then(connection => {
       req.flash('success', 'created a new connection');
       res.redirect('/connections');
    })
    .catch(err=>{
       if(err.name === 'ValidationError') {
          err.status = 400;
          req.flash('error', err.message);
          return res.redirect('back');
       }
       next(err);
    });
};

exports.show = (req, res, next) => {
   let id = req.params.id;
   let user = req.session.user;
   Promise.all([model.findById(id), rsvpModel.count({ connection: id, rsvp: "YES" })])
       .then(results => {
           const [connection, rsvps] = results;
           if (connection) {
               console.log(rsvps);
               res.render('./connection/show', { connection, user, rsvps });
           } else {
               let err = new Error('Cannot find a connection with id ' + id);
               err.status = 404;
               next(err);
           }
       })
   .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
   // res.send('Send the edit form');
   let id = req.params.id;
   model.findById(id)
   .then(connection => {
         return res.render('./connection/edit', {connection});
   })
   .catch(err=>next(err));
};

exports.update = (req, res, next) => {
   // res.send('Update connections with id ' + req.params.id);
   let connection = req.body;
   let id = req.params.id;

   model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
   .then(connection =>{
      req.flash('success', 'Successfully edited a connection');
      res.redirect('/connections/' + id);
   })
   .catch(err=> {
      if(err.name === 'ValidationError') {
         err.status = 400;
         req.flash('error', err.message);
          return res.redirect('back');
      }
      next(err);
   });
};

exports.delete = (req, res, next)=>{
   let id = req.params.id;

   model.findByIdAndDelete(id, {useFindAndModify: false})
   .then(connection=>{
         res.redirect('/connections');
   })
   .catch(err=>next(err));
};

exports.editRsvp = (req, res, next) => {
   console.log(req.body.rsvp);
   let id = req.params.id;
   rsvpModel.findOne({ connection: id, user: req.session.user }).then(rsvp => {
       if (rsvp) {
           rsvpModel.findByIdAndUpdate(rsvp._id, { rsvp: req.body.rsvp }, { userFindAndModify: false, runValidators: true })
               .then(rsvp => {
                   req.flash('success', 'Successfully updated RSVP');
                   res.redirect('/users/profile');
               })
               .catch(err => {
                   console.log(err);
                   if (err.name === 'ValidationError') {
                       req.flash('error', err.message);
                       return res.redirect('/back');
                   }
                   next(err);
               })
       }
       else {
           let rsvp = new rsvpModel({
               connection: id,
               rsvp: req.body.rsvp,
               user: req.session.user
           });
           rsvp.save()
               .then(rsvp => {
                   req.flash('success', 'Successfully updated RSVP');
                   res.redirect('/users/profile');
               })
               .catch(err => {
                   req.flash('error', err.message);
                   next(err)
               });
       }
   })
}

exports.deleteRsvp = (req, res, next) => {
   let id = req.params.id;
   rsvpModel.findOneAndDelete({ connection: id, user: req.session.user })
       .then(rsvp => {
           res.redirect('/users/profile');
       })
       .catch(err => {
           req.flash('error', err.message);
           next(err);
       });
};

