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

    // Update a Player with id
    router.put("/:id", players.validate('updatePerson'), async(req, res) =>{
      try{
        await players.update(req, res);
      }
      catch(err){ 
        res.send(err)
        console.log(err.message)
      }
    });

    // Retrieve all players
    router.get("/", players.findAll);
  
    // Retrieve a single Person with id
    router.get("/:id", players.findOne);
  
    // Delete a Person with id
    router.delete("/:id", players.delete);
  
    app.use('/players', router);
  };