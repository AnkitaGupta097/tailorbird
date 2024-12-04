import React, { useState } from "react";
import { Box } from "@mui/material";
import ProjectsHeader from "./project-header";
// import PropertiesTable from "./projects-table";
import PropertiesTable from "../common/project-list-table";
import "./active-projects.css";
import { useAppSelector } from "../../../stores/hooks";
// import { isEmpty, filter, mapValues } from "lodash";
import CreateProject from "./modal/create-project-modal";
// import ProjectFilters from "./project-filters";
import { PROJECTS_TABS } from "../constant";

export interface IFilter {
    INTERIOR: boolean;
    COMMON_AREA: boolean;
    EXTERIOR: boolean;
}

const ActiveProperties = () => {
    const { properties } = useAppSelector((state) => {
        console.log(state.property.properties, "!!!!!!!");
        return { properties: state.property.properties };
    });

    // const [yourProperties, setYourProperties] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [openProjectModal, setProjectModal] = useState(false);
    // const [searchedProject, setSearchedProject] = useState([]);
    // const [filterList, setFilter] = useState<IFilter>({
    //     INTERIOR: false,
    //     COMMON_AREA: false,
    //     EXTERIOR: false,
    // });
    // console.log("!!m!!m!!", projects, filterList);
    // useEffect(() => {
    //     setYourProperties(properties); // eslint-disable-next-line
    // }, [properties]);

    // const handleSearch = (value: string) => {
    //     if (isEmpty(value)) {
    //         // setSearchedProject([]);
    //         setYourProperties(properties);
    //     } else {
    //         const searchedProjects: any = filter(
    //             properties,
    //             (row) =>
    //                 row.address?.toLowerCase().includes(value) ||
    //                 row.name?.toLowerCase().includes(value), //||
    //             // find(organization, {
    //             //     id: row.ownershipGroupId,
    //             // })
    //             // ?.name?.toLowerCase()
    //             // .includes(value),
    //         );
    //         // setSearchedProject(searchedProjects);
    //         setYourProperties(searchedProjects);
    //     }
    // };

    // useEffect(() => {
    // let finalProject = isEmpty(searchedProject) ? projects : searchedProject;
    // let filterValue: any = [];
    // mapValues(filterList, (value, type) => {
    //     if (value) {
    //         filterValue.push(type);
    //     }
    // });
    // if (filterValue.length > 0) {
    //     finalProject = finalProject.filter((project: any) =>
    //         filterValue.includes(project.projectType),
    //     );
    // }
    // setYourProjects(finalProject);
    // eslint-disable-next-line
    // }, [filterList]);

    // const setFilters = (type: string, bool: boolean) => {
    //     setFilter({ ...filterList, [type]: bool });
    // };
    return (
        <Box mx={6} my={3} className="Active-projects-container">
            <ProjectsHeader
                setSearchValue={setSearchText}
                setProjectModal={setProjectModal}
                projectTab={PROJECTS_TABS[0].value}
            />
            {/* <ProjectFilters setFilters={setFilters} /> */}
            <PropertiesTable
                properties={properties || []}
                setPropertyModal={setProjectModal}
                searchText={searchText}
                type={"general"}
            />
            <CreateProject setProjectModal={setProjectModal} openModal={openProjectModal} />
        </Box>
    );
};

export default ActiveProperties;
