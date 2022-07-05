const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const {DateTime} = require('luxon');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      let err = new Error("Invalid connection id");
      err.status = 400;
      return next(err);
    } else {
      return next();
    }
  };

  exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
  body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
  body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
  body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min:8, max:64})];

  exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
  body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min:8, max:64})];

  exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
      return next();
    }
  };

  exports.validateConnection = [
    body("title","title should be atleast 5 characters long").notEmpty().bail().trim().isLength({ min: 5 }).escape(),
    body("content","content should be atleast 10 character long").notEmpty().bail().trim().isLength({ min: 10 }).escape(),
    body("where","Location should not be empty").notEmpty().bail().trim().escape(),
    body('when', 'Date must be a valid date').isDate(),
    body('when', 'Date must be after todays date').isAfter(new Date().getDate().toString()),
    body("start", " Please provide a valid start time").matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    body('end', 'Please enter a valid end time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    body('end').custom((endTime, {req}) => {
      let startTime = req.body.start;
      let startTimeMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
      let endTimeMinutes =  parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

      if(endTimeMinutes <= startTimeMinutes) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
    body("imageURL", "image should be a valid URL").notEmpty().bail().trim().isURL(),
  ];
  
 
  

  
  