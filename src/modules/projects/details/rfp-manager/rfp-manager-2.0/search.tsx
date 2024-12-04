import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { TextField } from "@mui/material";

interface IContractorSearch {
    setSearchValue: any;
}

const ContractorSearch = ({ setSearchValue }: IContractorSearch) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder={"Search for contractors"}
            InputProps={{ endAdornment: <SearchIcon htmlColor="#757575" fontSize="medium" /> }}
            onChange={(e: any) => setSearchValue(e.target.value.toLowerCase())}
            size="small"
        />
    );
};

export default ContractorSearch;
