import Db from "./database.js";

export type city = {
  name: string,
  latitude: string,
  longitude: string,
  state_id: number
}

async function storeCities(cities: city[]) {
    const db = new Db();

    db.store(cities, 'cities');
}

function getCities(stateID: number): Promise<city[]> {
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

                resolve(results as city[]);
                db.end();
            }
        );
    });
}


function getCityIdByName(cityName: string, cities: city[]) {
    return cities.find((city) => {
        return city.name.toLowerCase().split(' ').includes(cityName.toLowerCase())
    });
}

export { storeCities, getCities, getCityIdByName };
