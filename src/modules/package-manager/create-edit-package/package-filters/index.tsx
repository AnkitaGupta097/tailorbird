import { Chip, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { ILabor, IMaterialPackage, IPackageFilterProps } from "../../interfaces";

const PackageFilters = (props: IPackageFilterProps) => {
    const [completenessMap, setCompletenessMap] = React.useState({} as any);
    const { skuRows } = props;
    useEffect(() => {
        const _completenessMap: any = {};
        skuRows.forEach((skuRow: IMaterialPackage | ILabor) => {
            _completenessMap[skuRow.category] = true;
        });
        setCompletenessMap(_completenessMap);
    }, [skuRows]);
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                {props.category.map((category) => {
                    const isCategoryPresent = !!completenessMap[category];
                    const isSelected = props.selectedCategory.includes(category);
                    return (
                        <Tooltip
                            key={category}
                            title={`${category} ${
                                isCategoryPresent ? "is present" : "is not present"
                            }`}
                        >
                            <Chip
                                style={{
                                    minWidth: "6.8rem",
                                    minHeight: "2.8rem",
                                    borderRadius: 5,
                                    marginLeft: "0.625rem",
                                    marginBottom: "0.428rem",
                                }}
                                label={category}
                                color={isSelected ? "primary" : "secondary"}
                                key={category}
                                onClick={() => {
                                    props.onClick?.(category);
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default PackageFilters;
