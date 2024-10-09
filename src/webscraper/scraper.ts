import { aldiScraper } from "./aldi-scraper";

export type GroupConfig = {
    id: number,
    name: string,
    keywords: string[]
    exclude: string[]
}

const scrapConfig = {
    groups: [
        {
            name: "milch",
            id: 1,
            keywords: [
                "milch",
                "vollmich",
                "milchdrink",
                "drinkmilch",
                "fairmilk",
                "milkshake",
                "reisdrink",
                "mandeln",
                "schafmilch",
                "milch drink",
                "sojadrink",
                "haferdrink",
            ],
            exclude: [
                "seife",
                "dusch"
            ]
        },
        {
            name: "käse",
            id: 2,
            keywords: [
                "käse",
                "käsescheiben",
                "Käseaufschnitt",
                "Käsesnack",
                "Käse-Fondue",
                "Mini-Babybel",
                "Gouda",
                "Schmelzkäsescheiben",
                "Trappistenkäse",
                "Käsemischung",
                "Grillkäse",
                "Scheiben",
                "Rosetten",
                "Käse,"
            ],
            exclude: [
                "pizza",
                "pizz‘ah",
                "flammkuchen",
                "nacho",
                "Reischips",
                "Käsekuchen",
                "Katzensnack",
                "Linsen Salat",
                "Sandwich",
                "Grillschnecke",
                "Schinken",
                "Knusperfilets",
                "Plätzli",
                "Cracker",
                "snack",
                "Salat",
                "Tortelloni",
                "Wienerli",
                "Pastagericht",
                "Schweinswürstchen",
                "Pasta"


            ]
        },
        {
            name: "Yogurt",
            id: 3,
            keywords: [
                "joghurt"
            ],
            exclude: [
                "kit kat",
                "Salatsauce",
                "Weichkäse",
                "Bonbons",
                "Schokoriegel",
                "Lachgummi",
                "Heringfilets",
                "Müesli",
                "Fruchtgummi",
                "Tzatziki"
            ]
        },
    ],
    chains: [
        {
            name: "aldi",
            scraper: aldiScraper,
        },
    ],
};

export function scrapSites() {
    const { chains, groups } = scrapConfig;

    chains.forEach(chain => {
        groups.forEach(group => {
            chain.scraper(group);
        })
    })
}
