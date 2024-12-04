import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import {
    Grid,
    // Button,
    // Select,
    // MenuItem,
    // InputLabel,
    // Box /*SelectChangeEvent*/,
} from "@mui/material";
import CommonTable from "./common_table";
import { isEmpty } from "lodash";
import actions from "stores/actions";
import FloorplanModal from "./create-floor-plan-modal";
// import { ReactComponent as MessageEmpty } from "../../../../../assets/icons/message-empty-icon.svg";
import NewFloorplanButton from "./new-floorplan-button";
import UnitMixTable from "components/unit-mix-table";

interface Map {
    [x: string]: any;
}
const PropertyFloorplans = () => {
    // const { propertyId } = useParams();
    // const { pathname } = useLocation();
    // const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [openFloorplanModal, setFloorplanModal] = useState(false);
    const [floorPlanType, setFloorPlanType] = useState("FLOORPLAN");
    const [selectedItemForImageVideoMode, setSelectedItemForImageVideoMode] = useState<Map>({});

    const availableTypes: any = ["FLOORPLAN", "BUILDING", "COMMON_AREA", "SITE"];
    const { floorplans, propertyDetails } = useAppSelector((state) => {
        return {
            floorplans: state.projectFloorplans.floorplans,
            propertyDetails: state.propertyDetails.data,
        };
    });
    // const [age, setAge] = React.useState("");

    // const handleChange = (event: SelectChangeEvent) => {
    //     setAge(event.target.value);
    // };

    useEffect(() => {
        if (isEmpty(floorplans?.data)) {
            dispatch(
                actions.projectFloorplans.fetchFloorplanDataStart({
                    id: propertyDetails.projects?.find((elm: any) => elm.type === "DEFAULT").id,
                }),
            );
        }
        // eslint-disable-next-line
    }, []);

    const handleSetSelectedItemForMedia = (item: any, type: string) => {
        setSelectedItemForImageVideoMode((prev) => {
            return {
                ...prev,
                [type]: item,
            };
        });
    };
    return (
        <Grid container marginBottom={4}>
            {/* <Stack direction={"row"}> */}
            <Grid item margin={4} marginLeft={"auto"}>
                <NewFloorplanButton
                    onAddNewFloorplan={(takeOffType: any) => {
                        setFloorPlanType(takeOffType);
                        setFloorplanModal(true);
                    }}
                />
            </Grid>
            {/* <Box
                sx={{
                    justifyContent: "flex-end",
                    width: "100%",
                    display: "flex",
                    paddingRight: "45px",
                }}
            >
                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                {/* <label id="select-label"></label> 
                <Select
                    id="select"
                    labelId="select-label"
                    label="Action"
                    inputProps={{ "aria-label": "Without label" }}
                >
                    <MenuItem value="">
                        <Button
                            variant="outlined"
                            // startIcon={<MessageEmpty />}
                            onClick={() => {
                                setFloorPlanType("FLOORPLAN");
                                setFloorplanModal(true);
                            }}
                        >
                            + Add Floorplan
                        </Button>
                    </MenuItem>
                    <MenuItem value="">
                        <Button
                            variant="outlined"
                            // startIcon={<MessageEmpty />}
                            onClick={() => {
                                setFloorPlanType("BUILDING");
                                setFloorplanModal(true);
                            }}
                        >
                            + Add Building
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button
                            variant="outlined"
                            // startIcon={<MessageEmpty />}
                            onClick={() => {
                                setFloorPlanType("COMMON_AREA");
                                setFloorplanModal(true);
                            }}
                        >
                            + Add Common Area
                        </Button>
                    </MenuItem>
                </Select>
            </Box> */}
            {/* </Stack> */}

            {/* <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={age}
                label="Age"
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select> */}

            <FloorplanModal
                takeOffType={floorPlanType}
                floorplan={{}}
                setFloorplanModal={setFloorplanModal}
                openModal={openFloorplanModal}
            />

            {availableTypes.map((type: any) => (
                <CommonTable
                    handleSetSelectedItemForMedia={handleSetSelectedItemForMedia}
                    selectedItemForImageVideoMode={selectedItemForImageVideoMode[type]}
                    takeOffType={type}
                    key={type}
                />
            ))}
            <UnitMixTable
                project_id={propertyDetails.id}
                style={{ margin: "36px", width: "100%", overflowX: "hidden" }}
            />
        </Grid>
    );
};
export default PropertyFloorplans /*React.memo(PropertyFloorplans)*/;
