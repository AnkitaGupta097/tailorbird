export const isFloatsEqual = (a: number, b: number) => {
    const magnitude = Math.max(Math.abs(a), Math.abs(b));
    const epsilon = magnitude * Number.EPSILON;
    return Math.abs(a - b) < epsilon;
};
