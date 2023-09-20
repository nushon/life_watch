const { error } = require("console");
const express = require("express");
const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3100
require('dotenv').config();

const db = new sqlite3.Database("lifeWatch.db");

function createTable() {
    db.run(
      "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER, hospital_id INT, individual_id INT, FOREIGN KEY(individual_id) REFERENCES individual(individual_id), FOREIGN KEY(hospital_id) REFERENCES hospital(hospital_id), FOREIGN KEY(admin_id) REFERENCES admin(admin_id))"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS admin(admin_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, phone_numb INT)"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS hospital_admin(hospital_id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, location TEXT NOT NULL, county TEXT NOT NULL, password TEXT NOT NULL, hospital_name TEXT NOT NULL, orange_num INT, lonestar_num INT)"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS individual(individual_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, dob DATE NOT NULL, unique_key TEXT NOT NULL, location TEXT, father_name TEXT, mother_name TEXT, hospital_id INT , FOREIGN KEY(hospital_id) REFERENCES hospital(hospital_id))"
    );
    
}
createTable();
// db.run(
//   "DROP TABLE IF EXISTS individual"
// )

app.use(express.json())
// POST REQUESTS 
app.post('/admin', function (req, res) {
  let data = req.body;
  console.log(data);

  let query = `INSERT INTO admin(user_name, email, password, phone_numb) VALUES(?, ?, ?, ?)`;
  db.run(
    query,
    [
      data["user_name"],
      data["email"],
      data["password"],
      data["phone_numb"]
    ],
    (error)=>{
      if(error){
        res.status(500).send("Error while inserting in the admin's table");
        console.log(`Admin's table error: ${error}`);
      }else{
        res.status(200).send("Successfully inserted in the admin's table");
      }
    }
  )
});

app.post("/hospital", function (req, res) {
  let data = req.body;
  let query = `INSERT INTO hospital_admin(email, location, county, password, hospital_name, orange_numb, lonestar_numb  ) VALUES(?,?,?,?,?,?,?)`
  db.run(
    query,
    [
      data["email"],
      data["location"],
      data["county"],
      data["password"],
      data["hospital_name"],
      data["orange_numb"],
      data["lonestar_numb"]
    ],
    (error) =>{
      if(error){
        res.status(500).send("Error while inserting in the hospital_admin's table");
        console.log(`Hospital admin's table error: ${error}`);
      }else{
        res.status(200).send("Successfully inserted in the hospital_admin's table");
      }
    }
  )
});

app.post("/individual", function (req, res) {
  let data = req.body;
  let query = `INSERT INTO individual(name, dob, unique_key, father_name, mother_name) VALUES(?,?,?,?,?)`
  db.run(
    query,
    [
      data["name"],
      data["dob"],
      data["unique_key"],
      data["father_name"],
      data["mother_name"]
    ],
    (error) =>{
      if(error){
        res.status(500).send("Error while inserting in the individual's table");
        console.log(`Individual's table error: ${error}`);
      }else{
        res.status(200).send("Successfully inserted in the individual's table");
      }
    }
  )
  
});

server.listen(port);
console.log(`Server is listening at port: ${port}`)