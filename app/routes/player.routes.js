const { body, validationResult } = require('express-validator');


module.exports = app => {
    const players = require("../controllers/people.controller.js");
    var router = require("express").Router();
  
    // Create a new Person
    // router.post("/", players.create);
    router.post("/", players.validate('createPerson'), async(req, res) =>{
      try{
        await players.create(req, res);
      }
      catch(err){ 
        res.send(err)
        console.log(err.message)
      }
    });

    // Retrieve all players
    router.get("/", players.findAll);
  
    // Retrieve all published players
    router.get("/published", players.findAllPublished);
  
    // Retrieve a single Person with id
    router.get("/:id", players.findOne);
  
    // Update a Person with id
    router.put("/:id", players.update);
  
    // Delete a Person with id
    router.delete("/:id", players.delete);
  
    // Delete all players
    router.delete("/", players.deleteAll);
  
    app.use('/players', router);
  };