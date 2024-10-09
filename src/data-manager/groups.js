import Db from "./database.js";

const groups = [
    {
        name: "GROUP_MILK",
        default_name: "Milk",
    },
    {
        name: "GROUP_CHEESE",
        default_name: "Cheese",
    },
    {
        name: "GROUP_YOGURT",
        default_name: "Yogurt",
    },
    {
        name: "GROUP_BUTTER",
        default_name: "Butter",
    },
    {
        name: "GROUP_APPLES",
        default_name: "Apples",
    },
    {
        name: "GROUP_TOMATOES",
        default_name: "Tomatoes",
    },
    {
        name: "GROUP_CARROTS",
        default_name: "Carrots",
    },
    {
        name: "GROUP_RICE",
        default_name: "Rice",
    },
    {
        name: "GROUP_PASTA",
        default_name: "Pasta",
    },
    {
        name: "GROUP_EGGS",
        default_name: "Eggs",
    },
    {
        name: "GROUP_OIL",
        default_name: "Oil",
    },
    {
        name: "GROUP_BEER",
        default_name: "Beer",
    },
    {
        name: "GROUP_JUICE",
        default_name: "Juice",
    },
    {
        name: "GROUP_SUGAR",
        default_name: "Sugar",
    },
    {
        name: "GROUP_FLOUR",
        default_name: "Flour",
    },
    {
        name: "GROUP_COFFEE",
        default_name: "Coffee",
    },
    {
        name: "GROUP_TEA",
        default_name: "Tea",
    },
    {
        name: "GROUP_HONEY",
        default_name: "Honey",
    },
    {
        name: "GROUP_PEAR",
        default_name: "Pear",
    },
];

async function saveGroup(group, db) {
    const columns = Object.keys(group).join(", ");
    const val = Object.values(group)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(", ");

    const query = `INSERT INTO groupss (${columns}) VALUES (${val})`;

    db.connection.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return;
        }
        console.log("Inserted row:", results.insertId);
    });
}

export function storeGroups() {
    const db = new Db();

    groups.forEach(async (group) => {
        await saveGroup(group, db);
    });

    db.end();
}
