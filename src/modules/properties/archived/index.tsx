import React, { useState } from "react";
import { Box } from "@mui/material";
import ProjectsHeader from "../active/project-header";
// import ProjectFilters from "../active/project-filters";
// import ArchiveTable from "./archive-table";
import ArchiveTable from "../common/project-list-table";
import { PROJECTS_TABS } from "../constant";
// import { isEmpty, filter, mapValues } from "lodash";
import BaseLoader from "../../../components/base-loading";
import { useAppSelector } from "../../../stores/hooks";

export interface IFilter {
    INTERIOR: boolean;
    COMMON_AREA: boolean;
}

const ArchivedProjects = () => {
    const { archiveProjects, isLoading } = useAppSelector((state) => {
        return {
            archiveProjects: state.property.archive_properties.data,
            isLoading: state.property?.loading,
        };
    });
    // const [yourProjects, setYourProjects] = useState([]);
    const [searchText, setSearchText] = useState("");

    // const [searchedProject, setSearchedProject] = useState([]);
    // const [filterList, setFilter] = useState<IFilter>({ INTERIOR: false, COMMON_AREA: false });

    // useEffect(() => {
    //     setYourProjects(archiveProjects);
    // }, [archiveProjects]);

    // const handleSearch = (value: string) => {
    //     if (isEmpty(value)) {
    //         // setSearchedProject([]);
    //         setYourProjects(archiveProjects);
    //     } else {
    //         const searchedProjects: any = filter(
    //             archiveProjects,
    //             (row) =>
    //                 row.address?.toLowerCase().includes(value) ||
    //                 row.name?.toLowerCase().includes(value), //||
    //             // find(organization, {
    //             //     id: row.ownershipGroupId,
    //             // })
    //             //     ?.name?.toLowerCase()
    //             //     .includes(value),
    //         );
    //         // setSearchedProject(searchedProjects);
    //         setYourProjects(searchedProjects);
    //     }
    // };

    // useEffect(() => {
    //     let finalProject = isEmpty(searchedProject) ? archiveProjects : searchedProject;
    //     let filterValue: any = [];
    //     mapValues(filterList, (value, type) => {
    //         if (value) {
    //             filterValue.push(type);
    //         }
    //     });
    //     if (filterValue.length > 0) {
    //         finalProject = finalProject.filter((project: any) =>
    //             filterValue.includes(project.projectType),
    //         );
    //     }
    //     setYourProjects(finalProject);
    //     // eslint-disable-next-line
    // }, [filterList]);

    // const setFilters = (type: string, bool: boolean) => {
    //     setFilter({ ...filterList, [type]: bool });
    // };

    if (archiveProjects == null || isLoading) {
        return <BaseLoader />;
    }
    return (
        <Box mx={6} my={3} className="Active-projects-container">
            <ProjectsHeader setSearchValue={setSearchText} projectTab={PROJECTS_TABS[1].value} />
            {/* <ProjectFilters setFilters={setFilters} /> */}
            <ArchiveTable
                properties={archiveProjects || []}
                searchText={searchText}
                type={"archive"}
            />
            {/* <ArchiveTable yourProperties={yourProjects} /> */}
            {/* <CreateProject setProjectModal={setProjectModal} openModal={openProjectModal} /> */}
        </Box>
    );
};

export default ArchivedProjects;
