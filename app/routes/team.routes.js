module.exports = app => {
    const teams = require("../controllers/team.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Team
    // router.post("/", teams.create);
    router.post("/", teams.validate);
  
    // Retrieve all teams
    router.get("/", teams.findAll);
  
    // Retrieve all published teams
    router.get("/published", teams.findAllPublished);
  
    // Retrieve a single Team with id
    router.get("/:id", teams.findOne);
  
    // Update a Team with id
    router.put("/:id", teams.update);
  
    // Delete a Team with id
    router.delete("/:id", teams.delete);
  
    // Delete all teams
    router.delete("/", teams.deleteAll);
  
    app.use('/teams', router);
  };