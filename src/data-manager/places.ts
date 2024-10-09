import "dotenv/config";
import axios from "axios";
import Db from "./database";

const { API_KEY } = process.env;
const RADIUS = 12000; // Search radius in meters
const TYPE = "supermarket";

async function fetchGMapPlaces(nextPageToken = "", location: string) {
    const url = nextPageToken
        ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${API_KEY}`
        : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${RADIUS}&type=${TYPE}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching places:", error);
        return { results: [], next_page_token: "" };
    }
}

async function fetchGMapPlaceDetails(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const addressComponents = response.data.result.address_components;
        const postalCodeComponent = addressComponents.find((component: any) =>
            component.types.includes("postal_code")
        );
        const cityComponent = addressComponents.find((component: any) =>
            component.types.includes("locality")
        );
        const countryComponent = addressComponents.find((component: any) =>
            component.types.includes("country")
        );

        return {
            post_code: postalCodeComponent ? postalCodeComponent.long_name : "N/A",
            country_code: countryComponent ? countryComponent.short_name : "N/A",
            city: cityComponent ? cityComponent.long_name : "N/A",
        };
    } catch (error) {
        console.error(`Error fetching details for place ${placeId}:`, error);
        return {
            postalCode: "N/A",
            city: "N/A",
            country: "N/A",
        };
    }
}

async function getPlaceById(db: Db, google_place_id: string) {
    return new Promise((resolve, reject) => {
        db.connection.query(
            `SELECT * FROM stores WHERE google_place_id=?`,
            [google_place_id],
            (err, results, fields) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject();
                }

                resolve(results);
            }
        );
    });
}

export { fetchGMapPlaces, fetchGMapPlaceDetails, getPlaceById };
