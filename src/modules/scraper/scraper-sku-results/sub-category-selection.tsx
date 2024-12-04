import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppTheme from "../../../styles/theme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ISubcategorySelectionComponentProps } from "./common/interfaces";
import { CustomPopper } from "../../../components/base-auto-complete";
import { isKnownSubcategory } from "./common/helper";

const SubcategorySelectionComponent = (props: ISubcategorySelectionComponentProps) => {
    //States
    const { allSubCats, currentVal, onChange, item, _id } = props;
    const [autoCompleteVal, setAutoCompleteVal] = useState("N/A");
    const [showError, setShowError] = useState(false);

    //Hooks
    useEffect(() => {
        const isKnown = isKnownSubcategory({ allSubCats: allSubCats, value: currentVal });
        setShowError(!isKnown);
        if (isKnown && currentVal != autoCompleteVal) {
            setAutoCompleteVal(currentVal);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVal, allSubCats]);

    return (
        <Autocomplete
            PopperComponent={CustomPopper}
            id="tags-standard"
            key={`table-cell-auto-complete-${_id}-${currentVal}`}
            options={allSubCats}
            value={autoCompleteVal ?? "N/A"}
            popupIcon={<KeyboardArrowDownIcon />}
            disableClearable={true}
            getOptionLabel={(option: any) => option}
            onChange={(e, value) => {
                value = value ?? "N/A";
                setAutoCompleteVal(value);
                onChange(currentVal, value);
            }}
            renderInput={(params) => (
                <TextField
                    variant={"standard"}
                    {...params}
                    sx={{
                        input: {
                            color: props?.isError ? AppTheme.error.not_found : AppTheme.text.light,
                        },
                    }}
                    error={showError}
                    FormHelperTextProps={{ style: { lineHeight: "12px", fontSize: "10px" } }}
                    helperText={
                        item.status === "not_implemented"
                            ? ""
                            : `System identified as ${item.vendor_subcategory}`
                    }
                />
            )}
        />
    );
};

export default SubcategorySelectionComponent;
