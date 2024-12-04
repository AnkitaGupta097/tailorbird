import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import React, { useCallback, useEffect } from "react";
import BaseSvgIcon from "components/svg-icon";
import { ReactComponent as OrganizationIcon } from "../../../../../assets/icons/organization.svg";
import DemandUserSearch from "./search-demand-users";
import BaseButton from "components/button";
import BaseDataGrid from "components/data-grid";
import { GridRenderCellParams, GridSelectionModel } from "@mui/x-data-grid";
import BaseCheckbox from "components/checkbox";
import ContentPlaceholder from "components/content-placeholder";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import CommonDialog from "modules/admin-portal/common/dialog";
import { filter, isEmpty, keys } from "lodash";
import { DEMAND_USERS_CONSTANTS, OWNERSHIP_ROLES_MAP } from "modules/projects/constant";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

interface IAddContractors {
    openModal: boolean;
    setOpenModal: any;
    contractorsList: any[];
    project_id: string | undefined;
    allDemandUsers: any;
}

const AddDemandUsers = ({
    openModal,
    setOpenModal,
    contractorsList,
    project_id,
    allDemandUsers,
}: IAddContractors) => {
    const columns = [
        {
            field: "name",
            headerName: "Organization",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Stack sx={{ mt: "21px", mb: "21px" }}>
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                </Stack>
            ),
        },
    ];

    const [selectedIds, setSelectedIds] = React.useState<GridSelectionModel>([]);
    let [selectedContractors, setSelectedContractors] = React.useState<any>([]);
    let [assignedContractors, setAssignedContractors] = React.useState<any>([]);
    let [loader, setLoader] = React.useState<boolean>(false);
    //eslint-disable-next-line
    const [searchedContractors, setSearchedContractors] = React.useState([]);
    const [searchVal, setSearchVal] = React.useState("");
    const [yourContractors, setYourContractors] = React.useState<any[]>([]);
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector((state) => {
        return {
            loading: project_id ? state.rfpProjectManager.details?.[project_id]?.loading : false,
            error: project_id ? state.rfpProjectManager.details?.[project_id]?.error : false,
        };
    });

    const roles = DEMAND_USERS_CONSTANTS.roles;

    const onSave = useCallback(() => {
        dispatch(
            actions.rfpProjectManager.assignContractorOrEstimatorStart({
                add_organization: false,
                contractors: assignedContractors,
                project_id: project_id,
                contractorsList: selectedContractors,
                rfp_project_version: "2.0",
                is_demand_side: true,
            }),
        );
        setOpenModal(false);
        setSelectedIds([]);
        setSelectedContractors([]);
        setAssignedContractors([]);
        setSearchedContractors([]);
        setYourContractors([]);
        setTimeout(() => {
            dispatch(
                actions.rfpProjectManager.fetchAssignedUsersListStart({
                    project_id: project_id,
                    rfp_project_version: "2.0",
                    is_demand_side: true,
                }),
            );
        }, 1000);

        //eslint-disable-next-line
    }, [assignedContractors, contractorsList, project_id, selectedContractors, selectedIds]);

    const handleChange = (e: any, input: any) => {
        const { checked, value, name, id } = e.target;
        let selectedContractorIndex = selectedContractors?.findIndex(
            (item: any) => item.name === id,
        );
        let { role } = input;
        let updatedSelectedContractors: any = [];
        if (name === DEMAND_USERS_CONSTANTS.ADMIN_TEXT) {
            if (checked) {
                assignedContractors = [
                    ...assignedContractors,
                    { contractor_id: input.contractor_id, organization_id: input.organization_id },
                ];
                if (selectedContractorIndex > -1) {
                    selectedContractors[selectedContractorIndex].ADMIN = [
                        //eslint-disable-next-line  no-unsafe-optional-chaining
                        ...selectedContractors?.[selectedContractorIndex]?.ADMIN,
                        { name: value, id: input.contractor_id, email: "" },
                    ];
                    updatedSelectedContractors = selectedContractors;
                } else {
                    selectedContractors = [
                        ...selectedContractors,
                        {
                            organization_id: input.organization_id,
                            name: id,
                            ADMIN: [{ name: value, id: input.contractor_id, email: "" }],
                            [role]: [],
                            bid_status: DEMAND_USERS_CONSTANTS.NOT_INVITED,
                        },
                    ];
                    updatedSelectedContractors = selectedContractors;
                }
            } else {
                let index = selectedContractors[selectedContractorIndex]?.ADMIN?.findIndex(
                    (item: { name: any }) => item.name === value,
                );
                let assignedIndex = assignedContractors?.findIndex(
                    (item: { contractor_id: any }) => item.contractor_id === input.contractor_id,
                );
                if (index > -1) {
                    selectedContractors[selectedContractorIndex]?.ADMIN?.splice(index, 1);
                    if (assignedIndex > -1) assignedContractors?.splice(assignedIndex, 1);
                    // check if no user assigned in organization, remove from list
                    if (
                        selectedContractors[selectedContractorIndex]?.ADMIN &&
                        selectedContractors[selectedContractorIndex]?.role
                    ) {
                        if (
                            selectedContractors[selectedContractorIndex]?.ADMIN?.length === 0 &&
                            selectedContractors[selectedContractorIndex][role]?.length === 0
                        ) {
                            selectedContractors?.splice(selectedContractorIndex, 1);
                        }
                    }
                }
                updatedSelectedContractors = selectedContractors;
            }
        } else if (name === DEMAND_USERS_CONSTANTS.NOT_ADMIN) {
            if (checked) {
                assignedContractors = [
                    ...assignedContractors,
                    { contractor_id: input.contractor_id, organization_id: input.organization_id },
                ];
                if (selectedContractorIndex > -1) {
                    selectedContractors[selectedContractorIndex][role] = [
                        //eslint-disable-next-line  no-unsafe-optional-chaining
                        ...(selectedContractors?.[selectedContractorIndex]?.[role] || []),
                        { name: value, id: input.contractor_id, email: "" },
                    ];
                    updatedSelectedContractors = selectedContractors;
                } else {
                    selectedContractors = [
                        ...selectedContractors,
                        {
                            organization_id: input.organization_id,
                            name: id,
                            ADMIN: [],
                            [role]: [{ name: value, id: input.contractor_id }],
                        },
                    ];
                    updatedSelectedContractors = selectedContractors;
                }
            } else {
                let index = selectedContractors[selectedContractorIndex][role]?.findIndex(
                    (item: { name: any }) => item.name === value,
                );
                let assignedIndex = assignedContractors?.findIndex(
                    (item: any) => item.contractor_id === input.contractor_id,
                );

                if (index > -1) {
                    selectedContractors[selectedContractorIndex]?.[role]?.splice(index, 1);
                    if (assignedIndex > -1) {
                        assignedContractors?.splice(assignedIndex, 1);
                    }
                    // check if no contractors assigned in organization, remove from list
                    if (
                        selectedContractors[selectedContractorIndex]?.ADMIN &&
                        selectedContractors[selectedContractorIndex][role]
                    ) {
                        if (
                            selectedContractors[selectedContractorIndex]?.ADMIN?.length === 0 &&
                            selectedContractors[selectedContractorIndex][role]?.length === 0
                        ) {
                            selectedContractors?.splice(selectedContractorIndex, 1);
                        }
                    }
                    updatedSelectedContractors = selectedContractors;
                }
            }
        }
        setSelectedContractors(updatedSelectedContractors);
        setAssignedContractors(assignedContractors);
    };

    useEffect(() => {
        if (!loading || error) {
            setTimeout(() => {
                setLoader(false);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error]);

    useEffect(() => {
        setYourContractors(contractorsList); // eslint-disable-next-line
    }, [contractorsList]);

    const handleSearch = (value: string) => {
        setSearchVal(value);
        if (isEmpty(value)) {
            setSearchedContractors([]);

            setYourContractors(contractorsList);
        } else {
            const searchedContractors: any = filter(contractorsList, (row) =>
                row?.name?.toLowerCase().includes(value),
            );
            setSearchedContractors(searchedContractors);
            setYourContractors(searchedContractors);
        }
    };

    return (
        <>
            <CommonDialog
                open={loader}
                onClose={() => {
                    setLoader(false);
                }}
                loading={loading}
                //@ts-ignore
                error={error}
                loaderText={DEMAND_USERS_CONSTANTS.CONTRACTOR_LOADING}
                errorText={DEMAND_USERS_CONSTANTS.CONTRACTOR_FAILURE}
                saved={!loading && !error}
                savedText={DEMAND_USERS_CONSTANTS.CONTRACTOR_SAVED}
                width="40rem"
                minHeight="26rem"
            />
            <Dialog
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedIds([]);
                    handleSearch("");
                    setAssignedContractors([]);
                    setSearchedContractors([]);
                    setSelectedContractors([]);
                }}
                fullWidth
                maxWidth={"lg"}
            >
                <DialogTitle>
                    <Grid container>
                        <Grid item sx={{ display: "flex", alignItems: "center" }} xs={11}>
                            {<BaseSvgIcon svgPath={<OrganizationIcon />} />}
                            <Typography variant="text_16_semibold" marginLeft={"13px"}>
                                {DEMAND_USERS_CONSTANTS.ADD}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} xs>
                            <IconButton
                                sx={{ padding: 0 }}
                                onClick={() => {
                                    setOpenModal(false);
                                    setSelectedIds([]);
                                    handleSearch("");
                                    setAssignedContractors([]);
                                    setSearchedContractors([]);
                                    setSelectedContractors([]);
                                }}
                            >
                                <DisabledByDefaultRoundedIcon
                                    htmlColor="#004D71"
                                    fontSize="large"
                                />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "0.5rem" }} />
                </DialogTitle>
                <DialogContent
                    sx={{
                        overflowY: "hidden",
                        maxHeight: "500px",
                        display: "flex",
                        alignItems: "stretch",
                    }}
                >
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <DemandUserSearch setSearchValue={handleSearch} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} sx={{ maxHeight: "300px" }}>
                            <Grid container md={12} sx={{ mt: "15px", maxHeight: "300px" }}>
                                <Grid
                                    item
                                    md={3}
                                    sx={{
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <BaseDataGrid
                                        columns={columns}
                                        rows={yourContractors ?? []}
                                        rowsPerPageOptions={[]}
                                        hideFooter={true}
                                        getRowId={(row: any) => row?.organization_id}
                                        checkboxSelection
                                        selectionModel={selectedIds}
                                        components={{
                                            BaseCheckbox: BaseCheckbox,
                                        }}
                                        initialState={{
                                            sorting: {
                                                sortModel: [{ field: "name", sort: "asc" }],
                                            },
                                        }}
                                        onSelectionModelChange={(ids: GridSelectionModel) => {
                                            //@ts-ignore
                                            setSelectedIds((prevIds: string[]) => {
                                                let currentIds = [];
                                                if (
                                                    ids.length > 0 &&
                                                    prevIds.length > 0 &&
                                                    prevIds.length > ids.length &&
                                                    searchVal.trim() === ""
                                                ) {
                                                    currentIds = prevIds.filter((item) => {
                                                        ids.forEach((id) => {
                                                            if (id !== item) {
                                                                return item;
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    currentIds = prevIds;
                                                }
                                                //@ts-ignore
                                                const filteredIds: string[] = Array.from(
                                                    new Set([...currentIds, ...ids]),
                                                );
                                                return [...filteredIds];
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md
                                    sx={{
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                        border:
                                            selectedIds?.length !== 0
                                                ? "1px solid #bcbcbb"
                                                : "none",
                                        borderRadius: selectedIds?.length !== 0 ? "5px" : "0",
                                        ml: "1rem",
                                        padding: selectedIds?.length !== 0 ? "15px" : "0",
                                    }}
                                >
                                    {selectedIds?.length === 0 ? (
                                        <ContentPlaceholder
                                            onLinkClick={() => {}}
                                            text={DEMAND_USERS_CONSTANTS.CONTENT_PLACEHOLDER_TEXT}
                                            aText={DEMAND_USERS_CONSTANTS.CONTENT_PLACEHOLDER_ATEXT}
                                            height="300px"
                                        />
                                    ) : (
                                        selectedIds?.map((id) => {
                                            const data: any = contractorsList?.filter(
                                                (row) => row?.organization_id === id,
                                            );
                                            return (
                                                <Grid
                                                    container
                                                    key={id}
                                                    sx={{ paddingBottom: "20px" }}
                                                >
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                        columnGap={2}
                                                    >
                                                        <Typography
                                                            color="#004D71"
                                                            variant="text_10_light"
                                                        >
                                                            {data?.[0]?.name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider
                                                            sx={{
                                                                marginTop: "0.5rem",
                                                                border: "1px solid #004D71",
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container>
                                                            {roles?.map((role) => {
                                                                return (
                                                                    <Grid
                                                                        item
                                                                        key={role}
                                                                        sx={{
                                                                            mt: "10px",
                                                                        }}
                                                                        sm={6}
                                                                        md={6}
                                                                        xs={6}
                                                                    >
                                                                        <Grid
                                                                            container
                                                                            direction={"column"}
                                                                        >
                                                                            <Grid item>
                                                                                <Typography variant="text_12_semibold">
                                                                                    {
                                                                                        OWNERSHIP_ROLES_MAP[
                                                                                            role as keyof typeof OWNERSHIP_ROLES_MAP
                                                                                        ]
                                                                                    }
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <Grid container>
                                                                                    <Grid item>
                                                                                        <Divider
                                                                                            sx={{
                                                                                                width: "20rem",
                                                                                                mb: "10px",
                                                                                                mt: "10px",
                                                                                            }}
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid
                                                                                        container
                                                                                        spacing={2}
                                                                                    >
                                                                                        {data?.map(
                                                                                            (
                                                                                                estimator: any,
                                                                                            ) => {
                                                                                                return Object.keys(
                                                                                                    estimator,
                                                                                                ).map(
                                                                                                    (
                                                                                                        key: any,
                                                                                                    ) => {
                                                                                                        if (
                                                                                                            DEMAND_USERS_CONSTANTS.roles.includes(
                                                                                                                key,
                                                                                                            ) &&
                                                                                                            key ==
                                                                                                                role
                                                                                                        ) {
                                                                                                            return estimator[
                                                                                                                key
                                                                                                            ].map(
                                                                                                                (
                                                                                                                    user_category: any,
                                                                                                                ) => {
                                                                                                                    const user_array =
                                                                                                                        keys(
                                                                                                                            user_category,
                                                                                                                        );
                                                                                                                    return (
                                                                                                                        <Grid
                                                                                                                            item
                                                                                                                            sm={
                                                                                                                                5
                                                                                                                            }
                                                                                                                            xs={
                                                                                                                                5
                                                                                                                            }
                                                                                                                            md={
                                                                                                                                5
                                                                                                                            }
                                                                                                                            key={
                                                                                                                                user_category?.id
                                                                                                                            }
                                                                                                                        >
                                                                                                                            <Stack
                                                                                                                                key={
                                                                                                                                    user_category?.id
                                                                                                                                }
                                                                                                                                direction="row"
                                                                                                                                spacing={
                                                                                                                                    2
                                                                                                                                }
                                                                                                                                alignItems={
                                                                                                                                    "center"
                                                                                                                                }
                                                                                                                            >
                                                                                                                                <BaseCheckbox
                                                                                                                                    icon={
                                                                                                                                        allDemandUsers
                                                                                                                                            .map(
                                                                                                                                                (
                                                                                                                                                    user: any,
                                                                                                                                                ): any =>
                                                                                                                                                    user?.id,
                                                                                                                                            )
                                                                                                                                            .includes(
                                                                                                                                                user_category?.id,
                                                                                                                                            ) ? (
                                                                                                                                            <CheckBoxOutlinedIcon htmlColor="#808080" />
                                                                                                                                        ) : undefined
                                                                                                                                    }
                                                                                                                                    onChange={(
                                                                                                                                        e: any,
                                                                                                                                    ) =>
                                                                                                                                        handleChange(
                                                                                                                                            e,
                                                                                                                                            {
                                                                                                                                                contractor_id:
                                                                                                                                                    user_category?.id,
                                                                                                                                                organization_id:
                                                                                                                                                    data[0]
                                                                                                                                                        ?.organization_id,
                                                                                                                                                role: key,
                                                                                                                                            },
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    id={
                                                                                                                                        data[0]
                                                                                                                                            ?.name
                                                                                                                                    }
                                                                                                                                    disabled={allDemandUsers
                                                                                                                                        .map(
                                                                                                                                            (
                                                                                                                                                user: any,
                                                                                                                                            ): any =>
                                                                                                                                                user?.id,
                                                                                                                                        )
                                                                                                                                        .includes(
                                                                                                                                            user_category?.id,
                                                                                                                                        )}
                                                                                                                                    value={
                                                                                                                                        user_category?.name
                                                                                                                                    }
                                                                                                                                    name={
                                                                                                                                        user_array?.includes(
                                                                                                                                            "ADMIN",
                                                                                                                                        )
                                                                                                                                            ? DEMAND_USERS_CONSTANTS.ADMIN_TEXT
                                                                                                                                            : DEMAND_USERS_CONSTANTS.NOT_ADMIN
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                <Stack>
                                                                                                                                    <Typography variant="text_12_regular">
                                                                                                                                        {
                                                                                                                                            user_category?.name
                                                                                                                                        }
                                                                                                                                    </Typography>
                                                                                                                                    <Tooltip
                                                                                                                                        title={`${user_category?.email}`}
                                                                                                                                    >
                                                                                                                                        <Typography
                                                                                                                                            variant="text_10_regular"
                                                                                                                                            color="#757575"
                                                                                                                                        >
                                                                                                                                            {
                                                                                                                                                user_category?.email
                                                                                                                                            }
                                                                                                                                        </Typography>
                                                                                                                                    </Tooltip>
                                                                                                                                </Stack>
                                                                                                                            </Stack>
                                                                                                                        </Grid>
                                                                                                                    );
                                                                                                                },
                                                                                                            );
                                                                                                        }
                                                                                                    },
                                                                                                );
                                                                                            },
                                                                                        )}
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                );
                                                            })}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <Grid container sx={{ marginLeft: "1rem" }}>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-start" }} xs>
                            <BaseButton
                                onClick={() => {
                                    setOpenModal(false);
                                    setSelectedIds([]);
                                    handleSearch("");
                                    setAssignedContractors([]);
                                    setSearchedContractors([]);
                                    setSelectedContractors([]);
                                }}
                                label={"Cancel"}
                                classes="grey default spaced"
                                variant={"text_14_regular"}
                                sx={{ marginRight: "10px" }}
                            />
                            <BaseButton
                                onClick={
                                    selectedIds?.length === 0 || selectedContractors?.length === 0
                                        ? () => {}
                                        : onSave
                                }
                                label={"Save"}
                                classes={
                                    selectedIds?.length === 0 || selectedContractors?.length === 0
                                        ? "primary disabled spaced"
                                        : "primary default spaced"
                                }
                                variant={"text_16_semibold"}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddDemandUsers;
