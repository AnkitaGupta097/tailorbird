/* eslint-disable no-unused-vars */
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BaseAutoComplete from "components/auto-complete";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Grid,
    AccordionProps,
    styled,
    Divider,
} from "@mui/material";
import BaseCheckbox from "components/checkbox";
import DoneIcon from "@mui/icons-material/Done";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import ScopeRules from "utils/scopes.json";

interface IRollupConfigContentHelper {
    rollUpItems: any;
    setRollUpItems: any;
    allRollUps?: any;
}

const StyledAccordion: any = styled(Accordion)<AccordionProps>(() => ({
    border: " 1px solid #BCBCBB",
    borderRadius: "5px",
    background: "#FFFFFF",
    rowGap: "6px",
    display: "grid",
    gridAutoFlow: "row",
    marginBottom: "10px",
    marginLeft: "5px",
    "&.Mui-expanded": {
        marginLeft: "5px",
        // background: "#EEEEEE",
    },

    "&.MuiCollapse-wrapper": {
        marginLeft: "-5px !important",
        background: "#FFFFFF !important",
    },
}));

const RollupConfigContentHelper = ({
    rollUpItems,
    setRollUpItems,
    allRollUps,
}: IRollupConfigContentHelper) => {
    const LabourRollupRules: any = {
        "Demo Existing": "Install New",
        "Remove and Store": "Reinstall Existing",
        "Install New": "Demo Existing",
        "Reinstall Existing": "Remove and Store",
    };
    const [expanded, setExpanded] = React.useState<any>([]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded((state: any) => {
            if (isExpanded) {
                return [...state, panel];
            } else {
                return state.filter((item: any) => item != panel);
            }
        });
    };

    const handleChangeLabourMerges = (option: any, rollUpItem: any, labourRollUpItemIndex: any) => {
        // Toggle the isSelected flag
        const isSelected = !option.isSelected;

        // Find the index of rollUpItem in allRollUps
        const indexfound = allRollUps.findIndex((x: any) => x.name === rollUpItem.name);

        // Update the isSelected flag for the specific labourRollUpItem
        allRollUps[indexfound].labourRollUps[labourRollUpItemIndex].isSelected = isSelected;

        // Get the dependent rollup item name based on the selected option
        const dependantRollupItem = LabourRollupRules[option.name];

        // Check if a dependent rollup item exists
        if (dependantRollupItem) {
            // Get the names of selected scope rollups
            const selectedScopeRollupNames = allRollUps[indexfound].scopeRollUps
                .filter((scopeElement: any) => scopeElement.isSelected)
                .map((scopeElement: any) =>
                    scopeElement.name.split("&").map((item: any) => item.trim()),
                )
                .flat();

            // Iterate through the labourRollUps and update isSelected for matching criteria
            allRollUps[indexfound].labourRollUps.forEach((labourElement: any, index: any) => {
                if (
                    dependantRollupItem === labourElement.name &&
                    selectedScopeRollupNames.includes(labourElement.name)
                ) {
                    allRollUps[indexfound].labourRollUps[index].isSelected = isSelected;
                }
            });
        }

        // Update the state with the modified allRollUps array
        setRollUpItems([...allRollUps]);
    };

    const handleChangeScopeMerges = (option: any, rollUpItem: any, scopeRollUpItemIndex: any) => {
        // Toggle the isSelected flag
        const isSelected = !option.isSelected;

        // Find the index of rollUpItem in allRollUps
        const indexfound = allRollUps.findIndex((x: any) => x.name === rollUpItem.name);

        // Update the isSelected flag for the scopeRollUpItem
        allRollUps[indexfound].scopeRollUps[scopeRollUpItemIndex].isSelected = isSelected;

        // Get the selected labour merges
        const selectedLabourMerges = allRollUps[indexfound].labourRollUps.filter(
            (item: any) => item.isSelected,
        );

        // Check if there are selected labour merges and the option is selected
        if (selectedLabourMerges.length && isSelected) {
            // Extract the names from the selected option
            const selectedScopeOptionNames = option.name
                .split("&")
                .map((item: any) => item.trim())
                .flat();

            // Find the labour merge that matches the selected scope option names
            const selectedDepLabourMerges = selectedLabourMerges.find((LM: any) =>
                selectedScopeOptionNames.includes(LM.name),
            );

            // Get the dependent merge item from LabourRollupRules
            const dependantMergeItem = LabourRollupRules[selectedDepLabourMerges?.name];

            // Update the isSelected flag for matching labour merges
            allRollUps[indexfound].labourRollUps.forEach((labourElement: any, index: any) => {
                if (
                    dependantMergeItem === labourElement.name &&
                    selectedScopeOptionNames.includes(labourElement.name)
                ) {
                    allRollUps[indexfound].labourRollUps[index].isSelected = isSelected;
                }
            });
        }

        // Update the state with the modified allRollUps array
        setRollUpItems([...allRollUps]);
    };

    return (
        <div style={{ width: "100%" }}>
            {rollUpItems?.map((rollUpItem: any, index: number) => (
                <StyledAccordion
                    key={`${rollUpItem.name}-${index}`}
                    onChange={handleChange(`${rollUpItem.name}-${index}`)}
                    expanded={expanded.includes(`${rollUpItem.name}-${index}`)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-label={`${rollUpItem.name}-${index}-expand`}
                        aria-controls={`${rollUpItem.name}-${index}-content`}
                        id={`${rollUpItem.name}-${index}-header`}
                        sx={{
                            background: expanded.includes(`${rollUpItem.name}-${index}`)
                                ? "#EEEEEE"
                                : "#FFFF",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    flex: 1,
                                }}
                            >
                                <img
                                    src={getCategoryIcon(rollUpItem.name)}
                                    width={20}
                                    height={20}
                                    alt={`${rollUpItem.name} icon`}
                                    className="Scope-table-reno-category-image"
                                    style={{ marginRight: "1rem" }}
                                />
                                <Typography variant="text_14_semibold">
                                    {rollUpItem.name}
                                </Typography>
                            </div>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails
                        id={`${rollUpItem.name}-${index}-detail`}
                        key={`scope-items-box-`}
                        sx={{ padding: "4px 15px 0px" }}
                    >
                        <div
                            style={{
                                marginBottom: "13px",
                                lineHeight: "18.2px",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="text_14_medium">{"Scope merges"}</Typography>
                        </div>
                        <Grid
                            sx={{
                                display: "grid",
                                gridGap: "1rem",
                            }}
                        >
                            {rollUpItem?.scopeRollUps?.map(
                                (option: any, scopeRollUpItemIndex: any) => (
                                    <div
                                        key={`${option.name}-${option.id}`}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "max-content",
                                            columnGap: "11px",
                                        }}
                                    >
                                        <BaseCheckbox
                                            onChange={() =>
                                                handleChangeScopeMerges(
                                                    option,
                                                    rollUpItem,
                                                    scopeRollUpItemIndex,
                                                )
                                            }
                                            id={option?.id}
                                            value={option?.name}
                                            name={option?.name}
                                            defaultChecked={option?.isSelected}
                                        />
                                        <Typography variant="text_14_regular">
                                            {" "}
                                            {option?.name}
                                        </Typography>
                                    </div>
                                ),
                            )}
                        </Grid>
                        <Divider sx={{ margin: "20px 0px" }} />
                        <div
                            style={{
                                marginBottom: "13px",
                                lineHeight: "18.2px",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="text_14_medium">{"Labor merges"}</Typography>
                        </div>
                        <Grid
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                gridGap: "1rem",
                                marginBottom: "24px",
                            }}
                        >
                            {rollUpItem?.labourRollUps?.map(
                                (option: any, labourRollUpItemIndex: any) => (
                                    <div
                                        key={`${option.name}-${option.id}`}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "max-content",
                                            columnGap: "11px",
                                        }}
                                    >
                                        <BaseCheckbox
                                            id={option?.id}
                                            value={option?.name}
                                            name={option?.name}
                                            defaultChecked={option?.isSelected}
                                            onChange={() =>
                                                handleChangeLabourMerges(
                                                    option,
                                                    rollUpItem,
                                                    labourRollUpItemIndex,
                                                )
                                            }
                                            checked={option?.isSelected}
                                        />
                                        <Typography variant="text_14_regular">
                                            {" "}
                                            {option?.name}
                                        </Typography>
                                    </div>
                                ),
                            )}
                        </Grid>
                    </AccordionDetails>
                    {/* ))} */}
                </StyledAccordion>
            ))}
        </div>
    );
};
export default RollupConfigContentHelper;
