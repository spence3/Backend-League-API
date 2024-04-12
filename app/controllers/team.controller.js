const Team = require("../models/team.model.js");
const { body,validationResult } = require('express-validator');

exports.validate = (method) =>{
  let rules=[ 
    body('name','name cannot be empty').not().isEmpty().trim().escape(),
    body('name','Must not create duplicate teams').custom((name) => { 
      Team.checkDuplicateName(name, (isDup)=>{
        return isDup;
      });//custom validation to check if team exists
    }),
    body('coach_id', 'coach_id cannot be empty').not().isEmpty().trim().escape(),
    body('league_id', 'league_id cannot be empty').not().isEmpty().trim().escape(),
    body('notes').trim().escape(),   //just sanitize notes
    body('motto').trim().escape()   // just sanitize motto
  ]
  switch(method){
    case 'createTeam':
      return rules

    case 'upDateTeam':
      break;
  } 
}

// Create and Save a new Team
exports.create = (req, res) => {
  // Validate request
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  
  // Create a Team
  const team = new Team({
    id: req.body.id,
    name: req.body.name,
    coach_id: req.body.coach_id,
    league_id: req.body.league_id,
    notes: req.body.notes,
    motto: req.body.motto,
    logo_path: req.body.logo_path

  });


  // Save Team in the database
  Team.create(team, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Team."
      });
    else res.send(data);
  });
};


// Retrieve all Teams from the database (with condition).
exports.findAll = (req, res) => {
    const title = req.query.title;

    Team.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving teams."
        });
      else res.send(data);
    });
};

// Find a single Team with a id
exports.findOne = (req, res) => {
    Team.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Team with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Team with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// find all published Teams
exports.findAllPublished = (req, res) => {
    Team.getAllPublished((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving teams."
          });
        else res.send(data);
      });
};

// Update a Team identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Team.updateById(
    req.params.id,
    new Team(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Team with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Team with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Team with the specified id in the request
exports.delete = (req, res) => {
    Team.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Team with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Team with id " + req.params.id
            });
          }
        } else res.send({ message: `Team ${req.params.id} was deleted successfully!` });
      });
};

// Delete all Teams from the database.
exports.deleteAll = (req, res) => {
    Team.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all teams."
          });
        else res.send({ message: `All Teams were deleted successfully!` });
      });
};