import Db from "./database.js";
import { getChainIdByName, chain } from "./chains.js";
import {
    fetchGMapPlaces,
    fetchGMapPlaceDetails,
    getPlaceById,
} from "./places.js";
import { getCities, getCityIdByName } from "./cities.js";

const state_id = 14;

export type store = {
  chain_id: number,
  address: string,
  post_code: string,
  cit_id: number,
  google_place_id: string,
  enabled: number,
  name: string
}

async function storeStores() {
    //Here open connection
    const db = new Db();
    db.connect();

    const chains: chain[] = await db.getAllFrom('chains');
    const cities = await getCities(state_id);

    const allPlaces = [];

    for (const city of cities) {
        console.log("🚀 ~ main ~ city:", city.name);
        let nextPageToken = "";
        const location = `${city.latitude},${city.longitude}`;

        do {
            const { results, next_page_token } = await fetchGMapPlaces(
                nextPageToken,
                location
            );
            allPlaces.push(...results);
            nextPageToken = next_page_token;

            // Google recommends a small delay between requests to avoid exceeding the rate limit
            if (nextPageToken) {
                await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
            }
        } while (nextPageToken);
    }

    const citiesNotInDB = [];

    for (const place of allPlaces) {
    // Request place by place_id
        const placeInDb = await getPlaceById(db, place.place_id);
        if (placeInDb.length === 0) {
            const details = await fetchGMapPlaceDetails(place.place_id);

            const { country_code, post_code, city } = details;
            const cityData = await getCityIdByName(city, cities);

            if (cityData && country_code === "CH") {
                const city_id = cityData.id;

                const { name, vicinity: address, place_id } = place;

                const { id: chain_id } = getChainIdByName(name, chains);

                const store = {
                    chain_id,
                    address,
                    post_code,
                    city_id,
                    google_place_id: place_id,
                    enabled: 1,
                    name,
                };

                await db.store([store], "stores");
            } else {
                citiesNotInDB.push(city);
            }

            //Save result in DB
        } else {
            console.log("Store exists");
        }
    }

    db.end();

    console.log("🚀 ~ storeStores ~ citiesNotInDB:", citiesNotInDB);
    console.log("Data saved to supermarkets.xlsx");
}

export { storeStores };
