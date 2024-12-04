/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { cloneDeep, map } from "lodash";
import ProjectCard from "./project-card";
import { StyledGrid } from "./style";
import { useAppSelector } from "stores/hooks";
import { PROJECT_STATE_ORDER } from "./constants";
import { ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import BaseLoader from "components/base-loading";

const MAX_PROJECTS_TO_SHOW = 6;

type AllProjectCardsProp = {
    projects: any[];
    showAll: boolean;
};

const AllProjectCards = React.memo(function allProjectCards({
    projects,
    showAll,
}: AllProjectCardsProp) {
    let projectsToShow = cloneDeep(projects);
    if (!showAll) projectsToShow = projectsToShow.slice(0, MAX_PROJECTS_TO_SHOW);
    return (
        <Grid container>
            {map(projectsToShow, (project) => {
                return <ProjectCard key={project.id} project={project} />;
            })}
        </Grid>
    );
});

const ProjectList = () => {
    const { projects_state_map, loading } = useAppSelector((state) => ({
        projects_state_map: state.projectsDemand.projects_state_map,
        loading: state.projectsDemand.loading,
    }));
    const [filterText, setFilterText] = useState<string>("");
    const [filteredProjectsStateMap, setFilteredProjectsStateMap] = useState(projects_state_map);
    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setFilteredProjectsStateMap(projects_state_map);
    }, [projects_state_map]);

    const [isActive, setIsActive]: [{ [key: string]: boolean }, Dispatch<SetStateAction<{}>>] =
        useState(
            PROJECT_STATE_ORDER.reduce(
                (map: { [key: string]: boolean }, key: string) => ({ ...map, [key]: false }),
                {},
            ),
        );
    const handleSeeAll = (state: string) => {
        let isActiveClone: { [key: string]: boolean } = cloneDeep(isActive);
        isActiveClone[state] = !isActiveClone[state];
        setIsActive(isActiveClone);
    };

    useEffect(() => {
        const filteredProjectsStateMap: any = {};
        map(projects_state_map, (value: any[], key: string) => {
            filteredProjectsStateMap[key] = value.filter((p: any) => {
                if (filterText) {
                    return p.name?.toLowerCase()?.includes(filterText.toLowerCase());
                }
                return true;
            });
        });
        setFilteredProjectsStateMap(filteredProjectsStateMap);
    }, [filterText]);

    if (loading) {
        return <BaseLoader />;
    }
    return (
        <StyledGrid item marginBottom="10px" flexGrow={1} width={1}>
            <Box display="flex" justifyContent="end">
                <Box width={{ md: "25%", lg: "20%" }} mr={10}>
                    <Box>Search for a project</Box>
                    <FormControl sx={{ m: 1, width: 1 }} variant="outlined">
                        <OutlinedInput
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="Search projects" edge="end">
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={filterText}
                            onChange={({ target }) => setFilterText(target.value)}
                            size="small"
                        />
                    </FormControl>
                </Box>
            </Box>
            {map(PROJECT_STATE_ORDER, (state) => {
                const filteredProjects = filteredProjectsStateMap[state];
                const filteredProjectsLength = filteredProjects?.length || 0;
                return (
                    filteredProjects && (
                        <StyledGrid className="projectListGrid">
                            <Typography variant="text_16_semibold">
                                {state} ({filteredProjectsLength} total)
                            </Typography>
                            <AllProjectCards
                                projects={filteredProjects}
                                showAll={isActive[state]}
                            />
                            {filteredProjectsLength > MAX_PROJECTS_TO_SHOW && (
                                <Box>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleSeeAll(state)}
                                        startIcon={
                                            !isActive[state] ? <ExpandMore /> : <ExpandLess />
                                        }
                                        fullWidth
                                        sx={{ textTransform: "none" }}
                                    >
                                        {!isActive[state]
                                            ? `Show all ${filteredProjectsLength} projects`
                                            : "Show minimum projects"}
                                    </Button>
                                </Box>
                            )}
                        </StyledGrid>
                    )
                );
            })}
        </StyledGrid>
    );
};

export default ProjectList;
