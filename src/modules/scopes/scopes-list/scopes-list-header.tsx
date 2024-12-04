/* eslint-disable no-unused-vars */
import {
    Box,
    InputAdornment,
    TextField,
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    Divider,
} from "@mui/material";
import AddIcon from "../../../assets/icons/icon-add.svg";
import { ReactComponent as SearchIcon } from "../../../assets/icons/icon-search.svg";
import React, { useEffect, useState } from "react";

interface IContainerProps {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (args: boolean) => void;
    scopeData: any;
    setScopeData: any;
    scopeFilter: any;
    setScopeFilter: any;
    // eslint-disable-next-line no-unused-vars
    setSearchText: (args: string) => void;
}

const CustomCheckBox = ({
    label,
    scopeFilter,
    setScopeFilter,
    type,
}: {
    label: string;
    scopeFilter: string[];
    setScopeFilter: any;
    type: string;
}) => {
    const [checked, setChecked] = useState(scopeFilter.includes(type.toLowerCase()));

    useEffect(() => {
        if (checked) {
            setScopeFilter([...scopeFilter, type.toLowerCase()]);
        } else {
            setScopeFilter(scopeFilter.filter((scope) => scope !== type.toLowerCase()));
        }
        // eslint-disable-next-line
    }, [checked]);

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    sx={{ color: "#004D71" }}
                />
            }
            label={<Typography variant="scopeFilterText">{label}</Typography>}
            labelPlacement="end"
        />
    );
};

const ScopesHeader = (props: IContainerProps) => {
    const [localSearchText, setLocalSearchText] = useState("");
    const anchorRef = React.useRef(null);

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            props.setSearchText(localSearchText);
        }
    };

    return (
        <React.Fragment>
            <Box
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                }}
            >
                <Typography
                    style={{
                        margin: "40px auto 0 40px",
                        borderBottom: "3px solid #004D71",
                    }}
                    variant="heading"
                >
                    Scope Library
                </Typography>
                <TextField
                    placeholder={"Search by scope name and ownership"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(event) => setLocalSearchText(event.target.value)}
                    style={{
                        margin: "0 10px 10px auto",
                        minWidth: "50%",
                    }}
                    size="small"
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="contained"
                    style={{
                        height: "40px",
                        marginRight: "10px",
                        marginBottom: "10px",
                        fontWeight: "500",
                        fontSize: "16px",
                    }}
                    onClick={() => props.setSearchText(localSearchText)}
                >
                    Search
                </Button>

                <Box>
                    <Button
                        variant="contained"
                        startIcon={<img src={AddIcon} alt="add new scope" />}
                        style={{
                            height: "40px",
                            marginRight: "35px",
                            marginBottom: "10px",
                            fontWeight: "400",
                            fontSize: "16px",
                        }}
                        ref={anchorRef}
                        onClick={() => {
                            props.setOpen(!props.open);
                            props.setScopeData({
                                id: "",
                                type: "STANDARD", // setting new scope to by default standard type ("" is causing issue to enable create button)
                                ownership: "",
                                name: "",
                                description: "",
                                scopeList: [],
                                isSettingsFlow: false,
                                projectType: "INTERIOR",
                                containerVersion: "2.0",
                            });
                        }}
                    >
                        New Scope
                    </Button>
                </Box>
            </Box>
            <Divider style={{ width: "100%", marginTop: "-2px" }} />
            <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    rowGap: "10px",
                    marginLeft: "40px",
                    marginTop: "15px",
                }}
            >
                <CustomCheckBox
                    label="Ownership Scopes"
                    type={"Ownership"}
                    scopeFilter={props.scopeFilter}
                    setScopeFilter={props.setScopeFilter}
                />
                <CustomCheckBox
                    label="Standard Scopes"
                    type={"Standard"}
                    scopeFilter={props.scopeFilter}
                    setScopeFilter={props.setScopeFilter}
                />
            </Box>
        </React.Fragment>
    );
};

export default ScopesHeader;
