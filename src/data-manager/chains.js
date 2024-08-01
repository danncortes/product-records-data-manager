import Db from './database.js';

function getChains() {
    return new Promise((resolve, reject) => {
        const db = new Db();
    
        db.connection.query('SELECT * FROM chains', (err, results, fields) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject();
            }
            
            resolve(results);
            db.end();
        });
    })
}

function getChainIdByName(name, chains) {
    for (let i = chains.length - 1; i >= 0; i--) {
        if (name.toLowerCase().includes(chains[i].name.toLowerCase())) {
            return chains[i];
        }
    }
    console.log('chain id not found')
    return {id: 1};
}

export {getChains, getChainIdByName};