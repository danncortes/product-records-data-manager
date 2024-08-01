import Db from "./database.js";

async function storeCities(cities) {
  const db = new Db();

  cities.forEach((city) => {
    const columns = Object.keys(city).join(", ");
    const val = Object.values(city)
      .map((value) => (typeof value === "string" ? `'${value}'` : value))
      .join(", ");

    const query = `INSERT INTO cities (${columns}) VALUES (${val})`;

    db.connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log("Inserted row:", results.insertId);
    });
  });

  db.end();
}

function getCities(stateID) {
  return new Promise((resolve, reject) => {
    const db = new Db();

    db.connection.query(
      "SELECT * FROM cities WHERE state_id=?",
      [stateID],
      (err, results, fields) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject();
        }

        resolve(results);
        db.end();
      }
    );
  });
}

function getCityDbIdByName(cityName) {
  return new Promise((resolve, reject) => {
    const db = new Db();

    db.connection.query(
      "SELECT * FROM cities WHERE name LIKE ?",
      [`%${cityName}%`],
      (err, results, fields) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject();
        }

        resolve(results);
        db.end();
      }
    );
  });
}

function getCityIdByName(cityName, cities) {
  return cities.find((city) => {
    return city.name.toLowerCase().split(' ').includes(cityName.toLowerCase())
  });
}

export { storeCities, getCities, getCityIdByName };
