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
import ContractorSearch from "./search";
import BaseButton from "components/button";
import BaseDataGrid from "components/data-grid";
import { GridRenderCellParams, GridSelectionModel } from "@mui/x-data-grid";
import BaseCheckbox from "components/checkbox";
import ContentPlaceholder from "components/content-placeholder";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import CommonDialog from "modules/admin-portal/common/dialog";
import { filter, isEmpty } from "lodash";
import { ADD_CONTRACTOR } from "modules/projects/constant";

interface IAddContractors {
    openModal: boolean;
    setOpenModal: any;
    setContractors: any;
    contractorsList: any[];
    project_id: string | undefined;
    contractors: any;
    maxBidders: number | undefined;
    isRestrictedMaxBidders: boolean | undefined;
}

const AddContractors = ({
    openModal,
    setOpenModal,
    contractorsList,
    project_id,
    contractors,
    maxBidders,
    isRestrictedMaxBidders,
}: IAddContractors) => {
    const columns = [
        {
            field: "name",
            headerName: "Contractors",
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
    let [selectedContractors, setSelectedContractors] = React.useState<any[]>([]);
    let [assignedContractors, setAssignedContractors] = React.useState<any>([]);
    let [loader, setLoader] = React.useState<boolean>(false);
    //eslint-disable-next-line
    const [searchedContractors, setSearchedContractors] = React.useState([]);
    //eslint-disable-next-line
    const [searchVal, setSearchVal] = React.useState("");
    const [yourContractors, setYourContractors] = React.useState<any[]>([]);
    const dispatch = useAppDispatch();
    const [orgWithoutAdmin, setOrgWithoutAdmin] = React.useState<string[]>([]);
    const [contractorsAcceptedBid, setContractorsAcceptedBid] = React.useState<number>();
    const [handleError, setHandleError] = React.useState<boolean>();

    const { loading, error, projectDetails } = useAppSelector((state) => {
        return {
            loading: project_id ? state.rfpProjectManager.details?.[project_id]?.loading : false,
            error: project_id ? state.rfpProjectManager.details?.[project_id]?.error : false,
            projectDetails: state.projectDetails.data,
        };
    });

    const roles = ADD_CONTRACTOR.roles;

    const onSave = useCallback(() => {
        //Show max biders error
        if (
            isRestrictedMaxBidders &&
            maxBidders &&
            contractorsAcceptedBid &&
            maxBidders <= contractorsAcceptedBid
        ) {
            setLoader(true);
            setOpenModal(false);
            setSelectedIds([]);
            setSelectedContractors([]);
            setHandleError(true);
            return false;
        }
        //check if no contractor admin selected
        const organizationIds: string[] = selectedContractors
            .map((obj) => {
                if (obj.CONTRACTOR_ADMIN.length === 0) {
                    return obj.organization_id;
                }
            })
            .filter((index) => index !== undefined);
        //@ts-ignore
        let ids = selectedIds.filter(
            //@ts-ignore
            (id: string) =>
                selectedContractors.findIndex((item) => item?.organization_id === id) === -1,
        );

        if (organizationIds.length > 0 || ids.length > 0) {
            //@ts-ignore
            setOrgWithoutAdmin([...organizationIds, ...ids]);
        } else {
            const rfpProjectVersion =
                parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
                    .toFixed(1)
                    .toString() ?? "1.0";
            dispatch(
                actions.rfpProjectManager.assignContractorOrEstimatorStart({
                    add_organization: true,
                    contractors: assignedContractors,
                    project_id: project_id,
                    contractorsList: selectedContractors,
                    rfp_project_version: rfpProjectVersion,
                }),
            );
            setOpenModal(false);
            setSelectedIds([]);
            setSelectedContractors([]);
            setAssignedContractors([]);
            setSearchedContractors([]);
            setYourContractors([]);
            setLoader(true);
        }
        //eslint-disable-next-line
    }, [assignedContractors, contractorsList, project_id, selectedContractors, selectedIds]);

    const handleChange = (e: any, input: any) => {
        const { checked, value, name, id } = e.target;
        let selectedContractorIndex = selectedContractors?.findIndex((item) => item.name === id);

        let updatedSelectedContractors: any = [];

        if (name === "admin") {
            if (checked) {
                assignedContractors = [
                    ...assignedContractors,
                    { contractor_id: input.contractor_id, organization_id: input.organization_id },
                ];
                if (selectedContractorIndex > -1) {
                    selectedContractors[selectedContractorIndex].CONTRACTOR_ADMIN = [
                        //eslint-disable-next-line  no-unsafe-optional-chaining
                        ...selectedContractors?.[selectedContractorIndex]?.CONTRACTOR_ADMIN,
                        { name: value, id: input.contractor_id, email: "" },
                    ];
                    updatedSelectedContractors = selectedContractors;
                } else {
                    selectedContractors = [
                        ...selectedContractors,
                        {
                            organization_id: input.organization_id,
                            name: id,
                            CONTRACTOR_ADMIN: [{ name: value, id: input.contractor_id, email: "" }],
                            ESTIMATOR: [],
                            bid_status: ADD_CONTRACTOR.NOT_INVITED,
                        },
                    ];
                    updatedSelectedContractors = selectedContractors;
                }
            } else {
                let index = selectedContractors[
                    selectedContractorIndex
                ]?.CONTRACTOR_ADMIN?.findIndex((item: { name: any }) => item.name === value);
                let assignedIndex = assignedContractors?.findIndex(
                    (item: { contractor_id: any }) => item.contractor_id === input.contractor_id,
                );
                if (index > -1) {
                    selectedContractors[selectedContractorIndex]?.CONTRACTOR_ADMIN?.splice(
                        index,
                        1,
                    );
                    if (assignedIndex > -1) assignedContractors?.splice(assignedIndex, 1);
                    // check if no contractors assigned in organization, remove from list
                    if (
                        selectedContractors[selectedContractorIndex]?.CONTRACTOR_ADMIN?.length ===
                            0 &&
                        selectedContractors[selectedContractorIndex]?.ESTIMATOR?.length === 0
                    ) {
                        selectedContractors?.splice(selectedContractorIndex, 1);
                    }
                }
                updatedSelectedContractors = selectedContractors;
            }
        } else if (name === "estimator") {
            if (checked) {
                assignedContractors = [
                    ...assignedContractors,
                    { contractor_id: input.contractor_id, organization_id: input.organization_id },
                ];
                if (selectedContractorIndex > -1) {
                    selectedContractors[selectedContractorIndex].ESTIMATOR = [
                        //eslint-disable-next-line  no-unsafe-optional-chaining
                        ...selectedContractors?.[selectedContractorIndex]?.ESTIMATOR,
                        { name: value, id: input.contractor_id, email: "" },
                    ];
                    updatedSelectedContractors = selectedContractors;
                } else {
                    selectedContractors = [
                        ...selectedContractors,
                        {
                            organization_id: input.organization_id,
                            name: id,
                            CONTRACTOR_ADMIN: [],
                            ESTIMATOR: [{ name: value, id: input.contractor_id, email: "" }],
                            bid_status: ADD_CONTRACTOR.NOT_INVITED,
                        },
                    ];
                    updatedSelectedContractors = selectedContractors;
                }
            } else {
                let index = selectedContractors[selectedContractorIndex]?.ESTIMATOR?.findIndex(
                    (item: { name: any }) => item.name === value,
                );
                let assignedIndex = assignedContractors?.findIndex(
                    (item: any) => item.contractor_id === input.contractor_id,
                );

                if (index > -1) {
                    selectedContractors[selectedContractorIndex]?.ESTIMATOR?.splice(index, 1);
                    if (assignedIndex > -1) {
                        assignedContractors?.splice(assignedIndex, 1);
                    }
                    // check if no contractors assigned in organization, remove from list
                    if (
                        selectedContractors[selectedContractorIndex]?.CONTRACTOR_ADMIN?.length ===
                            0 &&
                        selectedContractors[selectedContractorIndex]?.ESTIMATOR?.length === 0
                    ) {
                        selectedContractors?.splice(selectedContractorIndex, 1);
                    }
                    updatedSelectedContractors = selectedContractors;
                }
            }
        }
        setSelectedContractors(() =>
            updatedSelectedContractors.length > 0 ? updatedSelectedContractors : [],
        );
        setAssignedContractors(assignedContractors);
    };
    const bidStatusIfContractorAccepted = [
        "submitted",
        "pending_submission",
        "requested_revised_pricing",
    ];
    useEffect(() => {
        if (contractors) {
            setContractorsAcceptedBid(
                () =>
                    contractors.filter((contractor: any) =>
                        bidStatusIfContractorAccepted.includes(contractor?.bid_status),
                    )?.length,
            );
        }
        //eslint-disable-next-line
    }, [contractors]);

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

    useEffect(() => {
        // Reset org without admin if contractors are re-selected
        // The verification of organization without admin only happens on save
        setOrgWithoutAdmin([]);
    }, [selectedContractors]);

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
    if (loader) {
        return (
            <CommonDialog
                open={loader}
                onClose={() => {
                    setLoader(false);
                    setHandleError(false);
                }}
                loading={loading}
                //@ts-ignore
                error={error || handleError}
                loaderText={ADD_CONTRACTOR.CONTRACTOR_LOADING}
                errorText={
                    !handleError
                        ? ADD_CONTRACTOR.CONTRACTOR_FAILURE
                        : `Can not add contractor (s)! All ${maxBidders} bid opportunities have been taken. To add contractors either increase/disable maximum bidders or delete a contractor from the list, who already accepted to bid.`
                }
                saved={!loading && !error && !handleError}
                savedText={ADD_CONTRACTOR.CONTRACTOR_SAVED}
                width="40rem"
                minHeight="26rem"
            />
        );
    }
    return (
        <>
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
                                {ADD_CONTRACTOR.ADD}
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
                                    <ContractorSearch setSearchValue={handleSearch} />
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
                                        keepNonExistentRowsSelected
                                        selectionModel={selectedIds}
                                        components={{
                                            BaseCheckbox: BaseCheckbox,
                                        }}
                                        onSelectionModelChange={(ids: GridSelectionModel) =>
                                            setSelectedIds(ids)
                                        }
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
                                            text={ADD_CONTRACTOR.CONTENT_PLACEHOLDER_TEXT}
                                            aText={ADD_CONTRACTOR.CONTENT_PLACEHOLDER_ATEXT}
                                            height="300px"
                                        />
                                    ) : (
                                        selectedIds?.map((id) => {
                                            const data = contractorsList?.filter(
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
                                                        {orgWithoutAdmin.includes(
                                                            data?.[0]?.organization_id,
                                                        ) && (
                                                            <>
                                                                <ErrorOutlineIcon htmlColor="#D90000" />
                                                                <Typography
                                                                    color="#D90000"
                                                                    variant="text_12_light"
                                                                >
                                                                    {ADD_CONTRACTOR.WARNING_TEXT}
                                                                </Typography>
                                                            </>
                                                        )}
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
                                                                                    {role ===
                                                                                    "CONTRACTOR_ADMIN"
                                                                                        ? "Contractor Admins"
                                                                                        : "Estimators"}
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
                                                                                        {role ===
                                                                                        ADD_CONTRACTOR
                                                                                            .roles[1]
                                                                                            ? data?.[0]?.ESTIMATOR?.map(
                                                                                                  (
                                                                                                      estimator: any,
                                                                                                  ) => {
                                                                                                      return (
                                                                                                          <Grid
                                                                                                              item
                                                                                                              sm={
                                                                                                                  6
                                                                                                              }
                                                                                                              xs={
                                                                                                                  6
                                                                                                              }
                                                                                                              md={
                                                                                                                  6
                                                                                                              }
                                                                                                              key={
                                                                                                                  estimator?.id
                                                                                                              }
                                                                                                          >
                                                                                                              <Stack
                                                                                                                  key={
                                                                                                                      estimator?.id
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
                                                                                                                      onChange={(
                                                                                                                          e: any,
                                                                                                                      ) =>
                                                                                                                          handleChange(
                                                                                                                              e,
                                                                                                                              {
                                                                                                                                  contractor_id:
                                                                                                                                      estimator?.id,
                                                                                                                                  organization_id:
                                                                                                                                      data?.[0]
                                                                                                                                          ?.organization_id,
                                                                                                                              },
                                                                                                                          )
                                                                                                                      }
                                                                                                                      id={
                                                                                                                          data?.[0]
                                                                                                                              ?.name
                                                                                                                      }
                                                                                                                      value={
                                                                                                                          estimator?.name
                                                                                                                      }
                                                                                                                      name={
                                                                                                                          ADD_CONTRACTOR.ESTIMATOR_TEXT
                                                                                                                      }
                                                                                                                  />
                                                                                                                  <Stack>
                                                                                                                      <Typography variant="text_12_regular">
                                                                                                                          {
                                                                                                                              estimator?.name
                                                                                                                          }
                                                                                                                      </Typography>
                                                                                                                      <Tooltip
                                                                                                                          title={`${estimator?.email}`}
                                                                                                                      >
                                                                                                                          <Typography
                                                                                                                              variant="text_10_regular"
                                                                                                                              color="#757575"
                                                                                                                          >
                                                                                                                              {
                                                                                                                                  estimator?.email
                                                                                                                              }
                                                                                                                          </Typography>
                                                                                                                      </Tooltip>
                                                                                                                  </Stack>
                                                                                                              </Stack>
                                                                                                          </Grid>
                                                                                                      );
                                                                                                  },
                                                                                              )
                                                                                            : //@ts-ignore
                                                                                              data?.[0]?.CONTRACTOR_ADMIN?.map(
                                                                                                  (admin: {
                                                                                                      selected: any;
                                                                                                      id:
                                                                                                          | React.Key
                                                                                                          | null
                                                                                                          | undefined;
                                                                                                      name:
                                                                                                          | string
                                                                                                          | number
                                                                                                          | boolean
                                                                                                          | React.ReactElement<
                                                                                                                any,
                                                                                                                | string
                                                                                                                | React.JSXElementConstructor<any>
                                                                                                            >
                                                                                                          | React.ReactFragment
                                                                                                          | React.ReactPortal
                                                                                                          | null
                                                                                                          | undefined;
                                                                                                      email:
                                                                                                          | string
                                                                                                          | number
                                                                                                          | boolean
                                                                                                          | React.ReactElement<
                                                                                                                any,
                                                                                                                | string
                                                                                                                | React.JSXElementConstructor<any>
                                                                                                            >
                                                                                                          | React.ReactFragment
                                                                                                          | React.ReactPortal
                                                                                                          | null
                                                                                                          | undefined;
                                                                                                  }) => {
                                                                                                      return (
                                                                                                          <Grid
                                                                                                              item
                                                                                                              key={
                                                                                                                  admin?.id
                                                                                                              }
                                                                                                              sm={
                                                                                                                  6
                                                                                                              }
                                                                                                              md={
                                                                                                                  6
                                                                                                              }
                                                                                                              xs={
                                                                                                                  6
                                                                                                              }
                                                                                                          >
                                                                                                              <Stack
                                                                                                                  key={
                                                                                                                      admin?.id
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
                                                                                                                      key={
                                                                                                                          admin?.id
                                                                                                                      }
                                                                                                                      onChange={(
                                                                                                                          e: any,
                                                                                                                      ) =>
                                                                                                                          handleChange(
                                                                                                                              e,
                                                                                                                              {
                                                                                                                                  contractor_id:
                                                                                                                                      admin?.id,
                                                                                                                                  organization_id:
                                                                                                                                      data?.[0]
                                                                                                                                          ?.organization_id,
                                                                                                                              },
                                                                                                                          )
                                                                                                                      }
                                                                                                                      id={
                                                                                                                          data?.[0]
                                                                                                                              ?.name
                                                                                                                      }
                                                                                                                      value={
                                                                                                                          admin?.name
                                                                                                                      }
                                                                                                                      name={
                                                                                                                          ADD_CONTRACTOR.ADMIN_TEXT
                                                                                                                      }
                                                                                                                  />
                                                                                                                  <Stack>
                                                                                                                      <Typography variant="text_12_regular">
                                                                                                                          {
                                                                                                                              admin?.name
                                                                                                                          }
                                                                                                                      </Typography>
                                                                                                                      <Tooltip
                                                                                                                          title={`${admin?.email}`}
                                                                                                                      >
                                                                                                                          <Typography
                                                                                                                              variant="text_10_regular"
                                                                                                                              color="#757575"
                                                                                                                          >
                                                                                                                              {
                                                                                                                                  admin?.email
                                                                                                                              }
                                                                                                                          </Typography>
                                                                                                                      </Tooltip>
                                                                                                                  </Stack>
                                                                                                              </Stack>
                                                                                                          </Grid>
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

export default AddContractors;
