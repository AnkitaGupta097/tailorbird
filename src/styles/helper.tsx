const typoStandard = (size: number, weight: number) => {
    return {
        fontWeight: `${weight}`,
        fontSize: `${size}px`,
        fontFamily: "IBM Plex Sans",
    };
};

export { typoStandard };
