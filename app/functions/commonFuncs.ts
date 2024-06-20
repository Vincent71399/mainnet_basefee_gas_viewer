export const Number2Hex = (input:number): string => {
    return "0x" + input.toString(16)
}

export const Hex2Number = (input:string): number => {
    return parseInt(input, 16)
}