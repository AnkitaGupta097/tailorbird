/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import { useAppSelector } from "../../stores/hooks";
import { cloneDeep, map } from "lodash";
import PropertyCard from "./property-card";
import { StyledGrid } from "./style";
import Search from "@mui/icons-material/Search";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ExpandLess } from "@mui/icons-material";
import BaseLoader from "components/base-loading";

const MAX_PROPERTIES_TO_SHOW = 10;

type AllPropertyCardsProp = {
    filteredProperties: any;
    showAll?: boolean;
};

const AllPropertyCards = React.memo(function allPropertyCards({
    filteredProperties,
    showAll = false,
}: AllPropertyCardsProp) {
    let propertiesToShow = cloneDeep(filteredProperties);
    if (!showAll) propertiesToShow = propertiesToShow.slice(0, MAX_PROPERTIES_TO_SHOW);
    return (
        <Grid container>
            {map(propertiesToShow, (property, index) => {
                return <PropertyCard key={index} property={property} />;
            })}
        </Grid>
    );
});

const PropertyList = () => {
    const [showAllProperties, setShowAllProperties] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>("");
    const { loading, properties } = useAppSelector((state) => ({
        loading: state.propertiesConsumer.loading,
        properties: state.propertiesConsumer.properties,
    }));
    const [filteredProperties, setFilteredProperties] = useState(properties);
    // This block of code uses the useEffect hook to scroll the window to the top with a smooth behavior whenever the 'properties' state changes.
    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setFilteredProperties(properties);
    }, [properties]);

    useEffect(() => {
        setFilteredProperties(
            properties.filter((p: any) => {
                if (filterText) {
                    return p.name?.toLowerCase()?.includes(filterText.toLowerCase());
                }
                return true;
            }),
        );
    }, [filterText]);

    const toggleShowAllProperties = () => {
        setShowAllProperties(!showAllProperties);
    };

    if (loading) {
        return <BaseLoader />;
    }
    return (
        <StyledGrid item flexGrow={1} width={1} marginBottom="20px">
            <Box display="flex" justifyContent="end">
                <Box width={{ md: "25%", lg: "20%" }} mr={10}>
                    <Box>Search for a property</Box>
                    <FormControl sx={{ m: 1, width: 1 }} variant="outlined">
                        <OutlinedInput
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="Search properties" edge="end">
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
            <Box pl="20px">
                <Typography variant="text_16_medium">
                    Properties ({filteredProperties.length} total)
                </Typography>
            </Box>
            <AllPropertyCards filteredProperties={filteredProperties} showAll={showAllProperties} />
            {filteredProperties.length > MAX_PROPERTIES_TO_SHOW && (
                <Box px="20px">
                    <Button
                        variant="outlined"
                        onClick={toggleShowAllProperties}
                        startIcon={!showAllProperties ? <ExpandMore /> : <ExpandLess />}
                        fullWidth
                    >
                        {!showAllProperties
                            ? `Show all ${filteredProperties.length} properties`
                            : "Show minimum properties"}
                    </Button>
                </Box>
            )}
        </StyledGrid>
    );
};

export default PropertyList;
