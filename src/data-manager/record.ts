import Db from "./database";

export async function getLastRecordByProductId(prodId: number, db: Db) {
    const data = await new Promise((resolve, reject) => {
        db.connection.query(
            `SELECT * FROM records
      WHERE product_id=?
      ORDER BY created_at DESC
      LIMIT 1
      `,
            [prodId],
            (err, results) => {
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

    return data;
}
