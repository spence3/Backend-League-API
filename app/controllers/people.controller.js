const People = require("../models/people.model.js");
const { body,validationResult } = require('express-validator');

exports.validate = (method) =>{ 
  let rules=[
    body('first_name','first_name cannot be empty').not().isEmpty().trim().escape(),
    body('last_name', 'last_name cannot be empty').not().isEmpty().trim().escape(),
    body('address1', 'league_id cannot be empty').not().isEmpty().trim().escape(),
    body('city', 'city cannot be empty').not().isEmpty().trim().escape(),
    body('state', 'state cannot be empty').not().isEmpty().isLength({min: 2}),
    body('zip', 'zip cannot be empty').not().isEmpty().isNumeric().isLength({min: 2}),
    body('email', 'email cannot be empty').not().isEmpty().isEmail(),
    body('phone', 'phone cannot be empty').not().isEmpty().trim().escape(),
    body('team_id', 'team_id cannot be empty').not().isEmpty().trim().escape(),
    body('user_name', 'username cannot be empty').isLength({min: 6}).not().isEmpty().trim().escape(),
    body('license_level_id', 'license_level_id cannot be empty').not().isEmpty().trim().escape(),
    body('password', 'password cannot be empty and must be a strong password').not().isEmpty().trim().escape(),
    body('person_type', 'person_type cannot be empty').not().isEmpty().trim().escape(),
    body('notes').trim().escape(),   //just sanitize notes
    body('logo_path').trim().escape(),   //just sanitize logo_path
  ]
  switch(method){
    case 'createPerson':
      // rules.push(body('email','Must not create duplicate player or coach').custom((email) => { 
      //   People.checkDuplicateEmail(email, (isDup)=>{
      //     return isDup;
      //   });//custom validation to check if team exists
      // }))
      return rules
      
    case 'updatePerson':
      return rules;
  } 
}

// Create and Save a new People
exports.create = (req, res) => {
  // Validate request
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(402).json({errors: errors.array()})
  }

  if (!req.body) {
    res.status(402).send({
      message: "Content can not be empty!"
    });
  }

  
  // Create a People
  const people = new People({
    id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address1: req.body.address1,
    notes: req.body.notes,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    team_id: req.body.team_id,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    user_name: req.body.user_name,
    license_level_id: req.body.license_level_id,
    person_type: req.body.person_type,

    logo_path: req.body.logo_path

  });


  // Save People in the database
  People.create(people, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the People."
      });
    else res.status(201).send(data);
  });
};

// Update a People identified by the id in the request
exports.update = (req, res) => {
  // Validate request
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(402).json({errors: errors.array()})
  }

  // Validate Request
  if (!req.body) {
    res.status(402).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  People.updateById(
    req.params.id,
    new People(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(422).send({
            message: `Not found People with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating People with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};



// Retrieve all People from the database (with condition).
exports.findAll = (req, res, person_type) => {
  const title = req.query.title;
  const sortCol = req.query.sortCol;
  const sortDir = req.query.sortDir;
  const filterCol = req.query.filterCol;
  const filterStr = req.query.filterStr;
  const limit = req.query.limit ? parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    People.getAll(title, sortCol, sortDir, filterCol, filterStr, limit, offset, person_type, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving People."
        });
      else res.send(data);
    });
};

// Find a single People with a id
exports.findOne = (req, res) => {
    People.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found People with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Plater with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Delete a People with the specified id in the request
exports.delete = (req, res) => {
    People.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found People with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete People with id " + req.params.id
            });
          }
        } else res.send({ message: `People ${req.params.id} was deleted successfully!` });
      });
};

// Delete all people from the database.
exports.deleteAll = (req, res) => {
    People.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all people."
          });
        else res.send({ message: `All People were deleted successfully!` });
      });
};