import {
    Box,
    Grid,
    Dialog,
    Typography,
    DialogContent,
    Button,
    // InputLabel,
    // FormControl,
    // MenuItem,
    // Select,
    DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import BaseTextField from "components/text-field";
import { CONTAINER_CONFIGURATION_GROUP_SUBGROUP_DATA } from "./constants";
import { cloneDeep } from "lodash";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";

// import {
//     Button,
//     Select,
//     TextField,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
// } from "@mui/material";

interface IGroupSubgroupModal {
    /* eslint-disable-next-line */
    setGroupSubgroupModal: (val: boolean) => void;
    openModal: boolean;
    actionType: any;
    treeKey: string;
    externalNodes: any;
    setExternalNodes: any;
    selectedItem?: any;
    groupSubgroupData: any;
    setGroupSubgroupData: any;
}

const AddGroupSubGroup = ({
    openModal,
    //eslint-disable-next-line
    treeKey,
    actionType,
    setGroupSubgroupModal,
    // openGroupSubGroup,
    // closeGroupSubGroup,
    externalNodes,
    setExternalNodes,
    selectedItem,
    groupSubgroupData,
    setGroupSubgroupData,
}: IGroupSubgroupModal) => {
    // let externalNodes: any = localStorage.getItem("externalNodes");

    // if (externalNodes !== null) {
    //     externalNodes = JSON.parse(externalNodes);
    // }

    const { enqueueSnackbar } = useSnackbar();

    const [validateField, setValidation] = useState({
        name: false,
        cost_code: false,
        name_exists: false,
        cost_code_exists: false,
    });

    // useEffect(() => {
    //     if (actionType === "edit" && !groupSubgroupData.name && openModal) {
    //         let node_list = cloneDeep(externalNodes);
    //         let treeKey = selectedItems[0];
    //         console.log(node_list[treeKey], treeKey);
    //         let splitData = node_list[treeKey].data.split("~");
    //         let obj = {
    //             name: splitData[0],
    //             cost_code: splitData[1],
    //         };
    //         setGroupSubgroupData({ ...groupSubgroupData, ...obj });
    //     }
    //     //eslint-disable-next-line
    // }, [selectedItems, actionType, groupSubgroupData]);

    // const [folderNodes, setFolderNodes] = useState([{}]);

    // useEffect(() => {
    //     const tempFolderNodes = [];
    //     tempFolderNodes.push({ index: "root-2", data: "root" });

    //     let childrenFunction = (treeKey: any) => {
    //         console.log(treeKey, externalNodes[treeKey]);
    //         externalNodes[treeKey]?.children.forEach((elm: any) => {
    //             if (externalNodes[elm]?.isFolder && !externalNodes[elm]?.mergedFolder)
    //                 tempFolderNodes.push({
    //                     index: externalNodes[elm]?.index,
    //                     data: externalNodes[elm]?.data,
    //                 });
    //             childrenFunction(elm);
    //         });
    //     };

    //     childrenFunction("root-2");

    //     setFolderNodes(tempFolderNodes);
    // }, [externalNodes]);

    const updateGroupSubgroupData = (key: string, data: any) => {
        let val = data;
        let obj = {};
        console.log(key, data);

        if (key === "name") {
            setValidation({ ...validateField, name_exists: false, name: false });
        }
        if (key === "cost_code") {
            setValidation({ ...validateField, cost_code_exists: false, cost_code: false });
        }

        if (key === "tree_key" && actionType === "edit") {
            obj = {
                name: externalNodes[val].index,
                cost_code: Number(externalNodes[val].data.split("~")[1]),
            };
            if (val === "root-2") {
                obj = { name: "", cost_code: "" };
            }
        }
        // if (key === "tree_key") {
        //     console.log(val);
        //     val = val.index;
        //     console.log(val);

        // setValidation({ ...validateField, cost_code_exists: false, cost_code: false });
        // }

        setGroupSubgroupData({ ...groupSubgroupData, [key]: val, ...obj });
    };

    const createNewGroupSubGroup = () => {
        let treeKey = selectedItem;

        // if (!treeKey) {
        //     showSnackBar(
        //         "warning",
        //         "Only selecting group/subgroup. is allowed. Select at most one group/subgroup.",
        //     );
        //     return;
        // }

        // if (
        //     treeKey !== "root-2" &&
        //     (!externalNodes[treeKey]?.isFolder || externalNodes[treeKey]?.mergedFolder)
        // ) {
        //     showSnackBar(
        //         "warning",
        //         "Only selecting group/subgroup. is allowed. Select at most one group/subgroup.",
        //     );
        //     return;
        // }

        if (actionType === "add" && !selectedItem) {
            treeKey = "root-2";
        }

        if (actionType === "edit" && treeKey === "root-2") {
            showSnackBar("warning", "Editing root is not allowed.");
            return;
        }
        console.log(selectedItem);
        let node_list = cloneDeep(externalNodes);
        let validationFailed = false;
        const newValidationValues: any = {
            // name: false,
            // cost_code: false,
            // name_exists: false,
            // cost_code_exists: false,
        };

        if (!groupSubgroupData.name) {
            newValidationValues.name = true;
            validationFailed = true;
        }

        // if (!groupSubgroupData.cost_code) {
        //     newValidationValues.cost_code = true;
        //     validationFailed = true;
        // }

        let checks = { checkDuplicateName: true, checkDuplicateCostCode: true };

        if (!groupSubgroupData.cost_code) {
            checks.checkDuplicateCostCode = false;
        }
        if (actionType === "edit") {
            if (groupSubgroupData.name === treeKey) {
                console.log("here", groupSubgroupData.name, treeKey);
                checks.checkDuplicateName = false;
            }
            if (groupSubgroupData.cost_code.toString() === node_list[treeKey]?.data.split("~")[1]) {
                console.log("here");
                checks.checkDuplicateCostCode = false;
            }
        }

        let childrenFunction = (treeKey: any) => {
            node_list[treeKey]?.children.forEach((elm: any) => {
                if (checks.checkDuplicateName && groupSubgroupData.name === elm) {
                    newValidationValues.name_exists = true;
                    validationFailed = true;
                }

                if (
                    checks.checkDuplicateCostCode &&
                    groupSubgroupData.cost_code.toString() === node_list[elm]?.data.split("~")[1]
                ) {
                    newValidationValues.cost_code_exists = true;
                    validationFailed = true;
                }

                if (validationFailed) {
                    return;
                }
                childrenFunction(elm);
            });
        };

        if (checks.checkDuplicateCostCode || checks.checkDuplicateName) {
            childrenFunction("root-2");
        }

        setValidation({ ...validateField, ...newValidationValues });

        if (validationFailed) {
            return;
        }

        console.log(groupSubgroupData.name, "here?ADD EIDT");

        //eslint-disable-next-line
        let indexAddEdit = groupSubgroupData.name + `~${groupSubgroupData.cost_code}`;

        if (actionType === "add") {
            node_list[indexAddEdit] = {
                index: indexAddEdit,
                isFolder: true,
                canMove: true,
                tree: "tree-2",
                category: treeKey, //treeKey,
                data: `${groupSubgroupData.name}~${groupSubgroupData.cost_code}`,
                children: [],
            };
            // remove tree_key and add treeKey being sent from parent component when button is added beside each component
            node_list[treeKey /*treeKey*/].children.push(indexAddEdit);
        } else if (
            actionType === "edit" &&
            (checks.checkDuplicateName || checks.checkDuplicateCostCode)
        ) {
            const tempData: any = node_list[treeKey];
            const parent = node_list[treeKey].category;
            if (checks.checkDuplicateCostCode || checks.checkDuplicateName) {
                tempData.data = `${groupSubgroupData.name}~${groupSubgroupData.cost_code}`;
            }
            if (checks.checkDuplicateName) {
                tempData.index = indexAddEdit;

                // update parent aka category in children
                node_list[treeKey]?.children?.forEach((key: any) => {
                    node_list[key].category = indexAddEdit;
                });

                delete node_list[treeKey];
                node_list[indexAddEdit] = tempData;
                node_list[parent].children = node_list[parent].children.filter(
                    (elm: any) => elm !== treeKey,
                );
                node_list[parent].children.push(indexAddEdit);
            }
        }

        setExternalNodes(cloneDeep(node_list));
        setGroupSubgroupModal(false);
        resetValues();
    };

    const resetValues = () => {
        setGroupSubgroupData(CONTAINER_CONFIGURATION_GROUP_SUBGROUP_DATA);
    };

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    // whether the item on which action is being performed is subgroup or not
    const isSubGroup = () => {
        const parentKey = selectedItem ? externalNodes[selectedItem]?.category : "root-2";
        const isSubFolder = parentKey !== "root-2" && externalNodes[parentKey]?.isFolder;
        return actionType === "edit" ? isSubFolder : !!selectedItem;
    };

    const dialogTiteType = () => {
        return isSubGroup() ? "Subgroup" : "Group";
    };

    return (
        <Dialog
            open={openModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => setGroupSubgroupModal(false)}
            className="create-project-modal"
        >
            <DialogTitle
                style={{
                    border: "1px solid #DEDEDE",
                    paddingTop: "20px",
                    fontFamily: "IBM Plex Sans",
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "16px",
                    lineHeight: "21px",
                    color: "#000000",
                }}
            >
                {actionType === "add" ? "Create " : "Edit "}
                {dialogTiteType()}
            </DialogTitle>

            <DialogContent sx={{ "align-self": "center" }}>
                <Box mb={1} className="Projects-overview Projects-create-container">
                    <Grid container style={{ padding: "25px" }}>
                        <Grid container style={{ justifyContent: "start" }}>
                            {["add", "edit"].includes(actionType) ? (
                                <>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            {`Name of ${dialogTiteType()}`}
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            error={validateField.name || validateField.name_exists}
                                            id="filled-error-helper-text"
                                            helperText={
                                                validateField.name
                                                    ? "Group/SubGroup required*"
                                                    : "Group/SubGroup with this name already exists"
                                            }
                                            value={groupSubgroupData.name}
                                            onChange={(e: any) =>
                                                updateGroupSubgroupData("name", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            {"Cost code"}
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            error={
                                                // validateField.cost_code ||
                                                validateField.cost_code_exists
                                            }
                                            id="filled-error-helper-text"
                                            helperText={"Duplicate cost code"}
                                            value={groupSubgroupData.cost_code}
                                            onChange={(e: any) =>
                                                updateGroupSubgroupData("cost_code", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>

                                    {/* {actionType === "add" && (
                                        <Grid item md={4} pr={4}>
                                            <Typography variant="text_14_regular">
                                                {"Create at Root"}
                                            </Typography>
                                            <StyledCheckbox
                                                color="primary"
                                                checked={groupSubgroupData.is_root_selected}
                                                onChange={(e: any) =>
                                                    updateGroupSubgroupData(
                                                        "is_root_selected",
                                                        e.target.checked,
                                                    )
                                                }
                                                inputProps={{
                                                    "aria-labelledby": `enhanced-table-checkbox`,
                                                }}
                                            />
                                        </Grid>
                                    )} */}
                                </>
                            ) : (
                                <></>
                            )}
                            {/* <Grid item md={4} pr={4}>
                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel>Parent</InputLabel>
                                    <Select
                                        label="Parent"
                                        onChange={(e: any) =>
                                            updateGroupSubgroupData("tree_key", e.target.value)
                                        }
                                        value={groupSubgroupData.tree_key}
                                    >
                                        {folderNodes.map((node: any) => (
                                            <MenuItem key={node.index} value={node.index}>
                                                {node.data}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid> */}
                        </Grid>
                        <Grid container style={{ justifyContent: "end" }}>
                            <Grid item md={4.3} style={{ paddingTop: "30px" }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                        width: "146px",
                                        height: "50px",
                                        left: "0px",
                                        bottom: "0px",
                                        background: "#EEEEEE",
                                        borderRadius: "5px",
                                    }}
                                    onClick={() => {
                                        resetValues();
                                        setGroupSubgroupModal(false);
                                    }}
                                >
                                    <Typography
                                        style={{
                                            position: "absolute",
                                            width: "44px",
                                            height: "18px",
                                            left: "57px",
                                            bottom: "17px",
                                            fontFamily: "IBM Plex Sans",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            lineHeight: "18px",
                                        }}
                                    >
                                        {" "}
                                        Cancel
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={createNewGroupSubGroup}
                                    style={{
                                        marginLeft: "10px",
                                        height: "50px",
                                        // position: "absolute",
                                        width: "146px",
                                        // height: "50px",
                                        // left: "162px",
                                        bottom: "0px",
                                        background: "#004D71",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <Typography
                                        style={{
                                            width: "31px",
                                            height: "18px",
                                            left: "220px",
                                            bottom: "18px",
                                            fontFamily: "'IBM Plex Sans'",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            lineHeight: "18px",
                                            textAlign: "center",

                                            color: "#FFFFFF",
                                        }}
                                    >
                                        Save
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AddGroupSubGroup;
