import axios from "axios";
import * as cheerio from 'cheerio';
import Db from "../data-manager/database";

import { nameIsInExclusions, nameIsInKeywords } from "../utils";
import { GroupConfig } from "./scraper";
import { Product } from "../data-manager/products";
import { getLastRecordByProductId } from "../data-manager/record";

function getBrandNameFromTitle(name: string) {
    let brand = "";
    const nameArr = name.split(" ");
    for (let i = 0; i < nameArr.length; i++) {
        if (nameArr[i].toUpperCase() !== nameArr[i]) {
            brand = nameArr.slice(0, i).join(" ");
            break;
        }
    }
    return brand;
}

export async function aldiScraper(group: GroupConfig) {
    const db = new Db();
    db.connect();

    // Aldi website pages
    for await (const page of Array.from({ length: 10 }, (_, i) => i + 1)) {
        const url = `https://www.aldi-now.ch/de/search?ipp=72&q=${group.name}&page=${page}#`;

        try {
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                }
            });

            const $ = cheerio.load(data);

            const productDomElements = [...$("product-item.product-item")];

            if (productDomElements) {
                for await (const productDomElem of productDomElements) {
                    const group_id = group.id;
                    const name = $(productDomElem).find(".product-item__name").text().trim();
                    const img_url = $(productDomElem).find("lazy-image.lazy-image").attr('src')!

                    const price = Number(
                        $(productDomElem).find(".money-price__amount").text().trim()
                    );

                    if (nameIsInKeywords(name, group.keywords) && !nameIsInExclusions(name, group.exclude)) {
                        let brand_id = null;
                        const brandName = getBrandNameFromTitle(name);

                        // Get Brand from DB
                        const brand = await db.getAllFromWhere("brands", "name", brandName);

                        if (brand.length) {
                            brand_id = brand[0].id;
                        } else if (brandName.trim()) {

                            // Save Brand in DB
                            const brandResponse = await db.store(
                                [
                                    {
                                        name: brandName,
                                        enabled: 1,
                                    },
                                ],
                                "brands"
                            );

                            brand_id = brandResponse.insertId;
                        }

                        // Search Product by name
                        const productInDb = await db.getAllFromWhere(
                            "products",
                            "name",
                            name
                        );

                        let measure = "";
                        let size = 0;
                        let pkg = 0;
                        let description = "";
                        let product = {} as Product;
                        let saveRecord = false;
                        let product_id;
                        const saleVolume = $(productDomElem)
                            .find(".product-item__sale-volume")
                            .text().trim()
                            .split("(");

                        const measureAndSize = saleVolume[0].trim().split(" ");
                        measure = measureAndSize[1] === "Liter" ? "l" : measureAndSize[1];

                        if (measureAndSize[0].includes("x")) {
                            //If includes x is a package
                            pkg = 1;
                            const [quantity, siz] = measureAndSize[0].split("x");
                            size = Number(quantity) * Number(siz.split(' ')[0]);
                            description = measureAndSize[0];
                        } else if (!measureAndSize[0].includes("-")) {
                            size = Number(measureAndSize[0]);
                        }

                        if (productInDb.length === 0) {
                            product = {
                                name,
                                group_id,
                                description,
                                measure,
                                size,
                                package: pkg,
                                brand_id,
                                enabled: 1,
                                img_url
                            };

                            console.log("🚀 ~ forawait ~ name:", name)

                            //Save product in DB
                            const productRes = await db.store([product], "products");
                            product_id = productRes.insertId;
                            saveRecord = true;

                        } else {
                            // Product exist in DB
                            // Get last product record
                            const lastRecord = (await getLastRecordByProductId(
                                productInDb[0].id,
                                db
                            )) as any[];
                            product_id = productInDb[0].id;

                            if (lastRecord.length === 0 || Number(lastRecord[0].price) !== price) {
                                saveRecord = true;
                            }
                        }

                        if (saveRecord) {
                            const measure_price = Number(price / size);
                            const volume_price = saleVolume[1].replace(")", "").trim();

                            const record = {
                                product_id,
                                price,
                                measure_price,
                                volume_price,
                                chain_id: 5,
                                currency_code: "CHF",
                            };

                            await db.store([record], "records");
                        }

                        console.log("---");
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to retrieve the webpage: ${error}`);
        }
    }
    db.end();
}
