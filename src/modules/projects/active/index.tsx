/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ProjectsHeader from "./project-header";
import ProjectsTable from "../common/project-list-table";
import "./active-projects.css";
import { useAppSelector } from "../../../stores/hooks";
import CreateProject from "./modal/create-project-modal";
import ProjectFilters from "./project-filters";
import { PROJECTS_TABS } from "../constant";

export interface IFilter {
    INTERIOR: boolean;
    COMMON_AREA: boolean;
    EXTERIOR: boolean;
}

const ActiveProjects = () => {
    const { projects, organization } = useAppSelector((state) => {
        return { projects: state.tpsm.projects, organization: state.tpsm.organization };
    });

    const [openProjectModal, setProjectModal] = useState(false);
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
            <ProjectsHeader
                setSearchValue={setSearchText}
                setProjectModal={setProjectModal}
                projectTab={PROJECTS_TABS[0].value}
            />
            <ProjectFilters setFilters={setFilters} />
            <ProjectsTable
                projects={projects || []}
                setProjectModal={setProjectModal}
                searchText={searchText}
                filterList={filterList}
                type={"general"}
            />
            <CreateProject setProjectModal={setProjectModal} openModal={openProjectModal} />
        </Box>
    );
};

export default ActiveProjects;
