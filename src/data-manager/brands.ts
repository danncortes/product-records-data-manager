import { Id } from "../types.js";
import Db from "./database.js";

export type Brand = {
  name: string,
  enabled: 1 | 0
}

export type BrandRes = Brand & Id

const brands: Brand[] = [
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

export function storeBrands(brands: Brand[]): Promise<any> {
    const db = new Db();

    return db.store(brands, "brands");
}
