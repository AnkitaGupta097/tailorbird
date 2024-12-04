// DropdownMapping.tsx
import React, { useEffect, useState } from "react";
import { compact, omit, values } from "lodash";
import { Autocomplete, TextField, Button } from "@mui/material";
import "./dropdown-mapping.css";

interface Mapping {
    [key: string]: string;
}

interface IDropdownPackage {
    leftList: Array<any>;
    leftHeading: string;
    rightList: Array<any>;
    rightHeading: string;
    onSave: any;
    initialMapping?: any;
}

const DropdownMapping: React.FC<IDropdownPackage> = ({
    leftList,
    leftHeading,
    rightList,
    rightHeading,
    onSave,
    initialMapping,
}) => {
    const [mapping, setMapping] = useState<Mapping>(initialMapping ?? {});

    useEffect(() => {
        setMapping(initialMapping ?? {});
    }, [initialMapping]);

    const handleMapping = (leftItemId: string, rightItemId: string) => {
        if (compact(values(mapping))?.includes(rightItemId)) {
            alert(`The item "${rightItemId}" is already mapped.`);
            return;
        }

        let updatedMapping = { ...mapping };
        if (rightItemId) {
            updatedMapping[leftItemId] = rightItemId;
        } else {
            updatedMapping = omit(mapping, leftItemId);
        }
        setMapping(updatedMapping);
    };

    const handleSave = () => {
        onSave(mapping);
    };

    return (
        <div className="mapping-container">
            <table className="table-container">
                <thead>
                    <tr>
                        <th>{leftHeading}</th>
                        <th>{rightHeading}</th>
                    </tr>
                </thead>
                <tbody>
                    {leftList?.map((leftItem) => {
                        const leftItemId = leftItem.id;

                        return (
                            <tr key={leftItemId}>
                                <td>{leftItem.name}</td>
                                <td className="select-container">
                                    <Autocomplete
                                        size="small"
                                        options={
                                            rightList?.filter(
                                                (rl) => !values(mapping).includes(rl.id),
                                            ) ?? []
                                        }
                                        value={
                                            rightList.find(
                                                (item) => item.id === mapping[leftItemId],
                                            ) ?? null
                                        }
                                        getOptionLabel={(option) => option.name}
                                        sx={{ width: "100%" }}
                                        renderInput={(params) => (
                                            <TextField {...params} placeholder="Select" />
                                        )}
                                        onChange={(_e, value: any) => {
                                            handleMapping(leftItemId, value?.id);
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default DropdownMapping;
