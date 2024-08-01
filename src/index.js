import { storeStores } from "./data-manager/stores.js";
import { storeStates } from "./data-manager/states.js";
import { storeCities } from "./data-manager/cities.js";
import { getChainIdByName } from "./data-manager/chains.js";
import { scrapeCoop } from "./webscraper/coop-scraper.js";
import {storeGroups} from './data-manager/groups.js'
import {storeBrands} from './data-manager/brands.js'
import Db from "./data-manager/database.js";

//storeStores();
//getChainIdByName('a', [{name: 'Coop'}, {name: 'Migros'}, {name: 'Aldi'}, {name: 'Coop Pronto'}, {name: 'Aldi Suisse'}]);
//storeStates(states, 'CH')
//storeCities(cities);
//scrapeCoop()
//storeBrands();
