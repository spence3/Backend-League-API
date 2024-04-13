const { body, validationResult } = require('express-validator');



module.exports = app => {
    const coaches = require("../controllers/people.controller.js");
    var router = require("express").Router();
  
    // Create a new Person
    // router.post("/", coaches.create);
    router.post("/", coaches.validate('createPerson'), async(req, res) =>{
      try{
        await coaches.create(req, res);
      }
      catch(err){ 
        res.send(err)
        console.log(err.message)
      }
    });

    // Retrieve all coaches
    router.get("/", coaches.findAll);
  
    // Retrieve all published coaches
    router.get("/published", coaches.findAllPublished);
  
    // Retrieve a single Person with id
    router.get("/:id", coaches.findOne);
  
    // Update a Person with id
    router.put("/:id", coaches.update);
  
    // Delete a Person with id
    router.delete("/:id", coaches.delete);
  
    // Delete all coaches
    router.delete("/", coaches.deleteAll);
  
    app.use('/coaches', router);
  };