import mysql from "mysql2";
import "dotenv/config";

const { DB_HOST, DB_USER, DB_PASSWORD, DB } = process.env;

class Db {
  isConnected = false;

  constructor(params) {
    this.connection = mysql.createConnection({
      host: params?.host || DB_HOST,
      user: params?.user || DB_USER,
      password: params?.password || DB_PASSWORD,
      database: params?.database || DB,
    });
  }

  connect() {
    if (!this.isConnected) {
      this.connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }

        this.isConnected = true;
        console.log("Connected to the MySQL database");
      });
    }
  }

  async store(data, table) {
    this.connect();

    await new Promise((resolve, reject) => {
      data.forEach((item) => {
        const columns = Object.keys(item).join(", ");
        const val = Object.values(item)
          .map((value) => (typeof value === "string" ? `"${value}"` : value))
          .join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${val})`;

        this.connection.query(query, (err, results) => {
          if (err) {
            console.error("Error executing query:", err);

            reject();
            return;
          }
          resolve();
          console.log("Inserted row:", results.insertId);
        });
      });
    });

    this.end();
  }

  async getAllFrom(table) {
    this.connect();

    const data = await new Promise((resolve, reject) => {
      const db = new Db();

      db.connection.query(`SELECT * FROM ${table}`, (err, results, fields) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject();
        }

        resolve(results);
      });
    }).finally(() => {
      this.end();
    });

    return data
  }

  end() {
    if (this.isConnected) {
      try {
        this.connection.end();
        this.isConnected = false;
        console.log("Connection closed");
      } catch (err) {
        console.error("Error closing the connection:", err);
      }
    }
  }
}

export default Db;
