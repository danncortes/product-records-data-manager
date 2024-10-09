export type chain = {
    id: number, name: string
}

export function getChainIdByName(name: string, chains: chain[]): {id: number, name: string} {
    for (let i = chains.length - 1; i >= 0; i--) {
        if (name.toLowerCase().includes(chains[i].name.toLowerCase())) {
            return chains[i];
        }
    }
    console.log('chain id not found')
    return {id: 1, name: ''};
}