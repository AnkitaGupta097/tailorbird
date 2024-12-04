import React, { useState } from "react";
import { Box } from "@mui/material";
import ProjectsHeader from "../active/project-header";
import ProjectFilters from "../active/project-filters";
import ArchiveTable from "../common/project-list-table";
import { PROJECTS_TABS } from "../constant";
import { useAppSelector } from "../../../stores/hooks";

export interface IFilter {
    INTERIOR: boolean;
    COMMON_AREA: boolean;
    EXTERIOR: boolean;
}

const ArchivedProjects = () => {
    const { archiveProjects } = useAppSelector((state) => {
        return {
            archiveProjects: state.tpsm.archive_projects.data,
        };
    });
    const [searchText, setSearchText] = useState("");

    const [filterList, setFilter] = useState<IFilter>({
        INTERIOR: false,
        COMMON_AREA: false,
        EXTERIOR: false,
    });
    const setFilters = (type: string, bool: boolean) => {
        setFilter({ ...filterList, [type]: bool });
    };

    return (
        <Box mx={6} my={3} className="Active-projects-container">
            <ProjectsHeader setSearchValue={setSearchText} projectTab={PROJECTS_TABS[1].value} />
            <ProjectFilters setFilters={setFilters} />
            <ArchiveTable
                projects={archiveProjects || []}
                searchText={searchText}
                filterList={filterList}
                type={"archive"}
            />
        </Box>
    );
};

export default ArchivedProjects;
