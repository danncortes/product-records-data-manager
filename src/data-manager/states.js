import Db from "./database.js";

async function storeStates(states, country_code) {
  const values = states.map(({ name }) => ({
    name,
    country_code
  }));

  const db = new Db();

  db.store(values, 'states')
}

export { storeStates };
