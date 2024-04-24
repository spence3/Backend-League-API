const sql = require("./db.js");

// constructor 
const Person = function(person) {
  this.first_name = person.first_name,
  this.last_name = person.last_name,
  this.address1 = person.address1,
  this.notes = person.notes,
  this.city = person.city,
  this.state = person.state
  this.zip = person.zip
  this.team_id = person.team_id
  this.email = person.email
  this.phone = person.phone
  this.password = person.password
  this.user_name = person.user_name
  this.license_level_id = person.license_level_id
  this.license_level_id = person.license_level_id
  this.person_type = person.person_type
  this.logo_path = person.logo_path
};

Person.checkDuplicateEmail = (email, result)=>{
  sql.query(`SELECT * from people where email = ?`, [email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //found douplicate person
    if (res.length) {
      result(true);
      return;
    }

    // no duplicate person
    result(false);
    return;
  });
}

Person.create = (newPerson, result) => {
  sql.query("INSERT INTO people SET ?", newPerson, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created person: ", { id: res.insertId, ...newPerson });
    result(null, { id: res.insertId, ...newPerson });
  });
};

Person.findById = (id, result) => {
  sql.query(`SELECT * FROM people WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found person: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Person with the id
    result({ kind: "not_found" }, null);
  });
};

Person.getAll = (title, sortCol, sortDir, filterCol, filterStr, limit, offset, person_type, result) => {
  // let query = `SELECT * FROM people WHERE person_type = '${person_type}'`;
  // console.log(team_id)
  let query = `
  SELECT 
    people.*, 
    teams.name AS team_name
  FROM 
    people
  JOIN 
    teams ON people.team_id = teams.id
  WHERE 
    people.person_type = '${person_type}'`;


  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  if(filterCol, filterStr){
    query += ` WHERE ${filterCol} LIKE '%${filterStr}%'`;
  }

  if(sortCol, sortDir){
    query += ` ORDER BY ${sortCol} ${sortDir}`;
  }

  query += ` LIMIT ? OFFSET ?`;

  sql.query(query, [limit, offset], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("people: ", res);
    result(null, res);
  });

  // sql.query(query, (err, res) => {
  //   if (err) {
  //     console.log("error: ", err);
  //     result(null, err);
  //     return;
  //   }

  //   console.log("people: ", res);
  //   result(null, res);
  // });
};


Person.updateById = (id, person, result) => {
  sql.query(
    "UPDATE people SET first_name = ?, last_name = ?, address1 = ?, notes = ?, city = ?, state = ?, zip = ?, team_id = ?, email = ?, phone = ?, password = ?, user_name = ?, license_level_id = ?, person_type = ?, logo_path = ? WHERE id = ?",
    [person.first_name, person.last_name, person.address1, person.notes, person.city, person.state, person.zip, person.team_id, person.email, person.phone, person.password, person.user_name, person.license_level_id, person.person_type, person.logo_path, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Person with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated person: ", { id: id, ...person });
      result(null, { id: id, ...person });
    }
  );
};

Person.remove = (id, result) => {
  sql.query("DELETE FROM people WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Person with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted person with id: ", id);
    result(null, res);
  });
};

Person.removeAll = result => {
  sql.query("DELETE FROM people", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} people`);
    result(null, res);
  });
};

module.exports = Person;