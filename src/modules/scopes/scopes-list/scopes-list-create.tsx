/* eslint-disable no-unused-vars */
import {
    Box,
    FormControlLabel,
    Radio,
    RadioGroup,
    styled,
    TextField,
    Typography,
    TypographyProps,
    FormControl,
    Select,
    MenuItem,
    Grid,
} from "@mui/material";
import React from "react";
import BaseDialog from "../../../components/base-dialog";
import BaseIconButton from "../../../components/base-icon-button";
import CloseIcon from "../../../assets/icons/icon-close.svg";
import BaseButton from "../../../components/base-button";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import actions from "../../../stores/actions";
import AppTheme from "../../../styles/theme";
import "../scopes.css";
import OwnerShip from "../../../components/ownership-dropdown";
import { IOrg } from "../../package-manager/interfaces";
import { find } from "lodash";
import { useNavigate } from "react-router-dom";
import { FETCH_USER_DETAILS } from "modules/projects/constant";
import { ArrowDropDown } from "@mui/icons-material";
import { CONTAINER_VERSION } from "modules/properties/details/property-projects/new-project-modal";

interface ICreateProps {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (args: boolean) => void;
    scopeData: {
        id?: string;
        type: string;
        ownership: string;
        name: string;
        description: string;
        scopeList: any;
        isSettingsFlow?: boolean;
        containerItemIds?: any[];
        ownershipGroupId: string;
        projectType?: any;
        containerVersion?: string;
    };
    setScopeData: any;
}

const StyledTextField = styled(TextField)({
    width: "610px",
    marginTop: "10px",
    "& .MuiInputBase-input": {
        height: "15px",
    },
});

const StyledFormLabel = styled(Typography)({
    color: AppTheme.text.light,
});

const StyledRadioLabel = styled(Typography)<TypographyProps>(() => ({
    background: "#EEEEEE",
    color: "#000000",
    padding: "5px 12px",
    borderRadius: "50px",

    "&.active": {
        background: "#004D71",
        color: "#FFFFFF",
    },
}));

const Content = ({
    scopeData,
    setScopeData,
}: {
    scopeData: {
        type: string;
        ownership: string;
        name: string;
        description: string;
        scopeList: any;
        isSettingsFlow?: boolean;
        containerItemIds?: any[];
        ownershipGroupId: any;
        projectType?: any;
        containerVersion?: string;
    };
    setScopeData: any;
}) => {
    // const [value, setValue] = useState("Ownership");

    const scopeTypes = [
        { label: "Ownership", value: "OWNERSHIP" },
        { label: "Standard", value: "STANDARD" },
    ];

    const { organization } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
        };
    });

    const onChange = (e: any) => {
        // Since using of common onchange event handles added a conditional block for ownership change
        if (e.target.name == "ownership") {
            setScopeData({
                ...scopeData,
                ownership: e.target.label,
                ownershipGroupId: e.target.value,
            });
        } else if (e.target.name === "Container version") {
            setScopeData({
                ...scopeData,
                containerVersion: e.target.value,
            });
        } else {
            setScopeData({ ...scopeData, [e.target.name]: e.target.value });
        }
    };
    const protypes = [
        { label: "Interior", value: "INTERIOR", container_one: true },
        { label: "Common Area", value: "COMMON_AREA", container_one: true },
        { label: "Exterior", value: "EXTERIOR", container_one: false },
    ];

    return (
        <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <FormControl fullWidth={true}>
                <Typography variant="labelText" className="Scope-definition-project-type-label">
                    Project Type
                </Typography>
                <Box style={{ marginRight: ".5rem" }}>
                    <Select
                        labelId="project-type-label"
                        id="project-type"
                        fullWidth
                        value={scopeData.projectType}
                        name="projectType"
                        onChange={onChange}
                        placeholder="Project-type"
                        disabled={scopeData.isSettingsFlow}
                        sx={{
                            height: "44px",
                            marginTop: ".7rem",
                            ".css-1kn7y0p-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                {
                                    "-webkitTextFillColor": "#000000!important",
                                },
                            ".MuiSelect-icon": {
                                display: scopeData.isSettingsFlow ? "none" : "initial",
                            },
                        }}
                    >
                        {protypes
                            .map((ptype, index) => {
                                return Number(scopeData.containerVersion) >= 2.0 ||
                                    ptype.container_one ? (
                                    <MenuItem value={ptype.value} key={index}>
                                        {ptype.label}
                                    </MenuItem>
                                ) : null;
                            })
                            .filter((value) => value != null)}
                    </Select>
                </Box>
            </FormControl>
            <StyledFormLabel variant="tableData" style={{ marginTop: "5px" }}>
                Type
            </StyledFormLabel>
            <RadioGroup
                row
                aria-labelledby="scope-row-radio-buttons-group-label"
                name="scope-row-radio-buttons-group"
                defaultValue="STANDARD"
            >
                {scopeTypes.map((option) => {
                    return (
                        <FormControlLabel
                            name="type"
                            value={option.value}
                            control={
                                <Radio
                                    style={{
                                        color: "#004D71",
                                        fontSize: "12px",
                                        fontWeight: "300",
                                    }}
                                    checked={option.value === (scopeData.type || "STANDARD")}
                                    onChange={(e) => onChange(e)}
                                />
                            }
                            label={
                                <StyledRadioLabel
                                    className={option.value === scopeData.type ? "active" : ""}
                                    variant="footerText"
                                    style={{ fontSize: "12px", fontWeight: "300" }}
                                >
                                    {option.label}
                                </StyledRadioLabel>
                            }
                            key={option.label}
                        />
                    );
                })}
            </RadioGroup>
            {scopeData.type === "OWNERSHIP" && (
                <React.Fragment>
                    <FormControl fullWidth={true}>
                        <Typography variant="labelText" className="Scope-definition-search-label">
                            Ownership
                        </Typography>
                        {/* <StyledTextField
                            name="ownership"
                            value={scopeData.ownership}
                            onChange={onChange}
                            size="small"
                        /> */}
                        <OwnerShip
                            exceptContractors={true}
                            setState={(val: IOrg) => {
                                let e = {
                                    target: { name: "ownership", value: val.id, label: val.name },
                                };
                                onChange(e);
                            }}
                            size="small"
                            value={
                                find(organization, {
                                    id: scopeData.ownershipGroupId,
                                }) ?? null
                            }
                        />
                    </FormControl>
                </React.Fragment>
            )}
            <React.Fragment>
                <FormControl fullWidth={true}>
                    <Typography variant="labelText" className="Scope-definition-search-label">
                        Name
                    </Typography>
                    <StyledTextField
                        name="name"
                        value={scopeData.name}
                        onChange={onChange}
                        size="small"
                    />
                </FormControl>
            </React.Fragment>
            <React.Fragment>
                <FormControl fullWidth={true}>
                    <Typography variant="labelText" className="Scope-definition-search-label">
                        Summary (Optional)
                    </Typography>
                    <StyledTextField
                        name="description"
                        value={scopeData.description}
                        onChange={onChange}
                        size="small"
                    />
                </FormControl>
            </React.Fragment>
            <Grid>
                <Typography>Container version</Typography>
                <Select
                    defaultValue={scopeData.containerVersion}
                    onChange={onChange}
                    title="Container version"
                    label="Container version"
                    name="Container version"
                    value={scopeData.containerVersion}
                    placeholder="Select Container Version"
                    style={{ minWidth: "12em" }}
                >
                    {CONTAINER_VERSION.map((pType) => (
                        <MenuItem
                            value={pType.value}
                            key={pType.value}
                            selected={pType.value == scopeData.containerVersion}
                        >
                            {pType.label}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Box>
    );
};

const CreateScope = ({ open, setOpen, scopeData, setScopeData }: ICreateProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const header = (
        <Box component="div" style={{ display: "flex", alignItems: "space-between" }}>
            <Typography variant="heading">
                {scopeData.isSettingsFlow ? "Edit" : "Create"} Scope - Version -{" "}
                {scopeData.containerVersion}
            </Typography>
            <BaseIconButton
                icon={CloseIcon}
                onClick={() => {
                    setOpen(!open);
                }}
                style={{ marginLeft: "auto", marginRight: "0px" }}
            />
        </Box>
    );

    const Action = (props: { isUpdate: boolean }) => {
        const isProceedDisabled =
            scopeData.name?.trim() === "" ||
            scopeData.type.trim() === "" ||
            (scopeData.type.trim() === "OWNERSHIP" &&
                (scopeData.ownership === null ||
                    scopeData.ownership === undefined ||
                    scopeData.ownership.trim() === ""));

        return (
            <Box style={{ marginBottom: "10px", marginLeft: "12px" }}>
                {props.isUpdate && (
                    <BaseButton
                        style={{
                            backgroundColor: "#eee",
                            color: "#000",
                        }}
                        label="Cancel"
                        onClick={() => {
                            setOpen(!open);
                        }}
                        classes="Base-scope-create-button active"
                    />
                )}
                <BaseButton
                    style={{
                        backgroundColor: isProceedDisabled ? "#eee" : "#004D71",
                        color: isProceedDisabled ? "#000" : "#fff",
                    }}
                    label={props.isUpdate ? "Update" : "Create"}
                    onClick={() => {
                        if (!props.isUpdate) {
                            navigate(`/scopes/${scopeData.containerVersion}/new`, {
                                replace: true,
                                state: { tempProjectType: scopeData.projectType },
                            });
                            dispatch(
                                actions.scopes.fetchMDMContainerTreeStart({
                                    projectType: scopeData.projectType,
                                    containerVersion: scopeData.containerVersion,
                                }),
                            );
                            setOpen(!open);
                        } else {
                            dispatch(
                                actions.scopes.upsertScopeLibraryStart({
                                    id: scopeData.id,
                                    name: scopeData.name,
                                    description: scopeData.description,
                                    type: scopeData.type.toUpperCase(),
                                    ownership: scopeData.ownershipGroupId ?? "",
                                    data: scopeData.containerItemIds,
                                    createdBy: FETCH_USER_DETAILS().id || "user",
                                    projectType: scopeData.projectType,
                                    containerVersion: scopeData.containerVersion,
                                }),
                            );
                            // dispatch(actions.scopes.fetchScopeLibrariesListStart({}));
                            setOpen(!open);
                        }
                    }}
                    disabled={isProceedDisabled}
                    classes="Base-scope-create-button active"
                />
            </Box>
        );
    };

    return (
        <BaseDialog
            button={undefined}
            content={<Content scopeData={scopeData} setScopeData={setScopeData} />}
            header={header}
            actions={<Action isUpdate={scopeData.isSettingsFlow || false} />}
            open={open}
            setOpen={setOpen}
            sx={{ width: "100%" }}
        />
    );
};

export default CreateScope;
