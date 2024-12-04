import { Box } from "@mui/material";
import React, { useState } from "react";
import ScopesTable from "./scopes-list-table";
import ScopesHeader from "./scopes-list-header";
import CreateScope from "./scopes-list-create";

interface IScopeContainer {
    scopeData: {
        type: string;
        ownership: string;
        name: string;
        description: string;
        scopeList: any;
        ownershipGroupId: any;
        projectType?: any;
        containerVersion?: string;
    };
    setScopeData: any;
}

const ScopeContainer = ({ scopeData, setScopeData }: IScopeContainer) => {
    const [open, setOpen] = useState(false);
    const [scopeFilter, setScopeFilter] = useState([]);
    const [searchText, setSearchText] = useState("");

    return (
        <Box component="div" style={{ width: "100%" }}>
            <ScopesHeader
                open={open}
                setOpen={setOpen}
                scopeData={scopeData}
                setScopeData={setScopeData}
                scopeFilter={scopeFilter}
                setScopeFilter={setScopeFilter}
                setSearchText={setSearchText}
            />
            <ScopesTable
                open={open}
                setOpen={setOpen}
                scopeData={scopeData}
                setScopeData={setScopeData}
                createScopeData={scopeData}
                setCreateScopeData={setScopeData}
                scopeFilter={scopeFilter}
                searchText={searchText}
            />
            <CreateScope
                open={open}
                setOpen={setOpen}
                scopeData={scopeData}
                setScopeData={setScopeData}
            />
        </Box>
    );
};

export default ScopeContainer;
