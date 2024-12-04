import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { TextField } from "@mui/material";
import { ProjectListText } from "../constant";

interface IProjectSearch {
    setSearchValue: any;
}

const ProjectSearch = ({ setSearchValue }: IProjectSearch) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder={ProjectListText.SEARCH_PLACEHOLDER}
            InputProps={{ endAdornment: <SearchIcon htmlColor="#757575" /> }}
            onChange={(e: any) => setSearchValue(e.target.value.toLowerCase())}
        />
    );
};

export default ProjectSearch;
