const sql = require("./db.js");

// constructor
const Team = function(team) {
  this.id = team.id,
  this.name = team.name,
  this.coach_id = team.coach_id,
  this.league_id = team.league_id,
  this.notes = team.notes,
  this.motto = team.motto,
  this.logo_path = team.logo_path
}; 

Team.checkDuplicateName = (name, result)=>{
  sql.query(`SELECT * from teams where name = ?`, [name], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //found duplicate team
    if (res.length) {
      
      result(true);
      return;
    }
    //didn't find duplicate team
    result(false);
  });
}

Team.create = (newTeam, result) => {
  console.log(newTeam.coach_id)
  
  // sql.query("Select name, coach_name, phone, email, motto from(SELECT t.name, t.motto, p.phone, p.email concat(p.first_name+''+p.last_name)as coac_name FROM teams t JOIN people p on p.id=coach_id) as teams")

  sql.query("INSERT INTO teams SET ?", newTeam, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created team: ", { id: res.insertId, ...newTeam });
    result(null, { id: res.insertId, ...newTeam });
  });
};

Team.findById = (id, result) => {
  sql.query(`SELECT * FROM teams WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found team: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Team with the id
    result({ kind: "not_found" }, null);
  });
};

Team.getAll = (title, sortCol, sortDir, filterCol, filterStr, result) => {
  let query = "SELECT * FROM teams";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }
  if(filterCol, filterStr){
    query += ` WHERE ${filterCol} LIKE '%${filterStr}%'`;
  }

  if(sortCol, sortDir){
    query += ` ORDER BY ${sortCol} ${sortDir}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("teams: ", res);
    result(null, res);
  });
};


Team.updateById = (id, team, result) => {
  sql.query(
    "UPDATE teams SET title = ?, description = ?, published = ? WHERE id = ?",
    [team.title, team.description, team.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Team with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated team: ", { id: id, ...team });
      result(null, { id: id, ...team });
    }
  );
};

Team.remove = (id, result) => {
  sql.query("DELETE FROM teams WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Team with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted team with id: ", id);
    result(null, res);
  });
};

Team.removeAll = result => {
  sql.query("DELETE FROM teams", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} teams`);
    result(null, res);
  });
};

module.exports = Team;