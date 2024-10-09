import mysql from "mysql2";
import "dotenv/config";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

const { DB_HOST, DB_USER, DB_PASSWORD, DB } = process.env;

class Db {
    isConnected: boolean = false;
    connection: Connection;

    constructor(params?: { host: string, user: string, password: string, database: string }) {
        this.connection = mysql.createConnection({
            host: params?.host || DB_HOST,
            user: params?.user || DB_USER,
            password: params?.password || DB_PASSWORD,
            database: params?.database || DB,
        });
    }

    connect(): void {
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

    async store<T>(data: T[], table: string): Promise<any> {
        //this.connect();

        return new Promise<any>((resolve, reject) => {
            data.forEach((item: any) => {
                const columns = Object.keys(item).join(", ");
                const val = Object.values(item)
                    .map((value) => (typeof value === "string" ? `"${value}"` : value))
                    .join(", ");

                const query = `INSERT INTO ${table} (${columns}) VALUES (${val})`;

                this.connection.query(query, (err, results: mysql.ResultSetHeader) => {
                    if (err) {
                        console.error("Error executing query:", err);

                        reject();
                        return;
                    }
                    resolve(results);
                    console.log(`Inserted :${results.insertId}`, val);
                });
            });
        });

        //this.end();
    }

    async getAllFrom(table: string): Promise<any> {
        this.connect();

        const data = await new Promise((resolve, reject) => {
            const db = new Db();

            db.connection.query(`SELECT * FROM ${table}`, (err, results, fields) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                }

                resolve(results);
            });
        }).finally(() => {
            //this.end();
        });

        return data
    }


    async getAllFromWhere(table: string, prop: string, propValue: any): Promise<any> {
        //this.connect();

        const data = await new Promise((resolve, reject) => {

            this.connection.query(
                `SELECT * FROM ${table} WHERE ${prop}=?`,
                [propValue],
                (err, results, fields) => {
                    if (err) {
                        console.error("Error executing query:", err);
                        return reject();
                    }

                    resolve(results);
                    //this.end();
                }
            );
        }).finally(() => {
            //this.end();
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
