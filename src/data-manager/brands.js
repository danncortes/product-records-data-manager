import Db from "./database.js";

const brands = [
//   {
//     name: "Coop",
//     enabled: 1,
//   },
//   {
//     name: "OATLY",
//     enabled: 1,
//   },
//   {
//     name: "alpro",
//     enabled: 1,
//   },
//   {
//     name: "Sproud",
//     enabled: 1,
//   },
//   {
//     name: "Thai Kitchen",
//     enabled: 1,
//   },
//   {
//     name: "Emmi Beleaf",
//     enabled: 1,
//   },
//   {
//     name: "natürli",
//     enabled: 1,
//   },
//   {
//     name: "Naturaplan Bio",
//     enabled: 1,
//   },
//   {
//     name: "Pro Montagna",
//     enabled: 1,
//   },
//   {
//     name: "Prix Garantie",
//     enabled: 1,
//   },
//   {
//     name: "Echt Entlebuch",
//     enabled: 1,
//   },
  {
    name: "Migros",
    enabled: 1,
  },
];

export function storeBrands() {
  const db = new Db();

  db.store(brands, "brands");
}
