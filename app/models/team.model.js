const sql = require("./db.js");

// constructor
const Team = function(team) {
  this.title = team.title;
  this.description = team.description;
  this.published = team.published;
};

Team.create = (newTeam, result) => {
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

Team.getAll = (title, result) => {
  let query = "SELECT * FROM teams";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
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

Team.getAllPublished = result => {
  sql.query("SELECT * FROM teams WHERE published=true", (err, res) => {
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