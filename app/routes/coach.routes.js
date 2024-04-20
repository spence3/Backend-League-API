const { body, validationResult } = require('express-validator');



module.exports = app => {
  const coaches = require("../controllers/people.controller.js");
  var router = require("express").Router();

  // Create a new coach
  router.post("/", coaches.validate('createPerson'), async(req, res) =>{
    try{
      await coaches.create(req, res);
    }
    catch(err){ 
      res.send(err)
      console.log(err.message)
    }
  });

  // Update a coach with id
  router.put("/:id", coaches.validate('updatePerson'), async(req, res) =>{
  try{
    await coaches.update(req, res);
  }
  catch(err){ 
    res.send(err)
    console.log(err.message)
  }
});

  // Retrieve all coaches
  router.get("/", coaches.findAll);

  // Retrieve a single Person with id
  router.get("/:id", coaches.findOne);

  // Delete a Person with id
  router.delete("/:id", coaches.delete);

  app.use('/coaches', router);
};