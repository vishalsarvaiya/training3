const mysql = require("mysql");
const con = mysql.createConnection({
  host: "192.168.2.8",
  user: "trainee",
  password: "trainee@123",
  database: "trainee",
  timezone: "utc", //<-- here
});
const queryRunner = (query) => {
  return new Promise((resolve, reject) => {
    con.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { queryRunner };
