import { TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { isEmpty } from "lodash";

type ISearchBar = {
    agreementList: any[];
    setFilteredList: React.Dispatch<React.SetStateAction<any[]>>;
};

const SearchBar = ({ agreementList, setFilteredList }: ISearchBar) => {
    const handleSearch = (value: string) => {
        let filteredList = isEmpty(value)
            ? agreementList
            : agreementList?.filter((agreement) => agreement?.contractor_name?.includes(value));
        setFilteredList(filteredList);
    };
    return (
        <TextField
            sx={{
                display: "flex",
                padding: "6px 8px",
                borderRadius: "5px",
                background: "#F0F0F0",
            }}
            variant="standard"
            InputProps={{
                startAdornment: <SearchIcon htmlColor={"#5C5F62"} />,
                disableUnderline: true,
            }}
            placeholder="Search by contractor"
            fullWidth
            onChange={(e) => {
                handleSearch(e.target.value);
            }}
        />
    );
};

export default SearchBar;
