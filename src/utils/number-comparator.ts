export const areNumbersEqual = (num1: number, num2: number) => {
    const areFloats =
        Number.isFinite(num1) && Number.isFinite(num2) && (num1 % 1 !== 0 || num2 % 1 !== 0);
    if (areFloats) {
        const magnitude = Math.max(Math.abs(num1), Math.abs(num2));
        const epsilon = magnitude * Number.EPSILON;
        return Math.abs(num1 - num2) < epsilon;
    } else {
        return num1 === num2;
    }
};
