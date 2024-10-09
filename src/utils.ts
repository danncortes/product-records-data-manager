export function nameIsInKeywords(str: string, keywords: string[]) {
    return keywords.some(keyword => str.toLowerCase().split(' ').includes(keyword.toLowerCase()))
}

export function nameIsInExclusions(str: string, exclusions: string[]) {
    return exclusions.some(exc => str.toLowerCase().includes(exc.toLowerCase()))
}