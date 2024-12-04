import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BaseButton from "components/button";
import BaseCheckbox from "components/checkbox";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { cloneDeep } from "lodash";
import { ADD_CONTRACTOR } from "modules/projects/constant";

interface IManageUser {
    open: {
        open: boolean;
        data: any;
        checkedIds: string[];
    };
    setOpen: any;
    projectId: string | undefined;
    existingContractors: any[];
}

const ManageUser = ({ open, setOpen, projectId, existingContractors }: IManageUser) => {
    const roles = ["CONTRACTOR_ADMIN", "ESTIMATOR"];
    let [removedUsers, setRemovedUsers] = useState<
        { contractor_id: string; organization_id: string }[]
    >([]);
    let [addAdmin, setAddAdmin] = useState<{ name: string; id: string; email: string }[]>([]);
    let [addEstimator, setAddEstimator] = useState<{ name: string; id: string; email: string }[]>(
        [],
    );
    let [addContractors, setAddContractors] = React.useState<any[]>([]);
    const [checkedIds, setcheckedIds] = useState<string[]>([]);
    const [isAdminEmpty, setIsAdminEmpty] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { projectDetails } = useAppSelector((state) => {
        return {
            projectDetails: state.projectDetails.data,
        };
    });
    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";

    const onSave = useCallback(async () => {
        let d = new Date(),
            t = d.toDateString().split(" ");

        const index = existingContractors?.findIndex(
            (item) => item?.organization_id === open?.data?.[0]?.organization_id,
        );

        let allContractors: {
            organization_id: any;
            name: any;
            date_updated: string;
            bid_status: string;
            CONTRACTOR_ADMIN: { name: string; id: string; email: string }[];
            ESTIMATOR: { name: string; id: string; email: string }[];
        }[] = [];
        let assignedContractor = cloneDeep(existingContractors);
        if (index === -1) {
            allContractors = [
                ...existingContractors,
                {
                    organization_id: open?.data?.[0]?.organization_id,
                    name: open?.data?.[0]?.name,
                    date_updated: `${t[2]} ${t[1]} ${t[3]}`,
                    bid_status: open?.data?.[0]?.bid_status,
                    CONTRACTOR_ADMIN: addAdmin,
                    ESTIMATOR: addEstimator,
                },
            ];
        } else {
            assignedContractor[index].CONTRACTOR_ADMIN = assignedContractor?.[
                index
            ].CONTRACTOR_ADMIN?.filter((admin: { id: string }) => checkedIds.includes(admin?.id));
            assignedContractor[index].ESTIMATOR = assignedContractor?.[index].ESTIMATOR?.filter(
                (estimator: { id: string }) => checkedIds.includes(estimator?.id),
            );
            if (addAdmin?.length > 0) {
                assignedContractor[index].CONTRACTOR_ADMIN = [
                    ...assignedContractor[index].CONTRACTOR_ADMIN,
                    ...addAdmin,
                ];
            }
            if (addEstimator?.length > 0) {
                assignedContractor[index].ESTIMATOR = [
                    ...assignedContractor[index].ESTIMATOR,
                    ...addEstimator,
                ];
            }

            allContractors = assignedContractor;
        }
        if (assignedContractor[index].CONTRACTOR_ADMIN?.length === 0) setIsAdminEmpty(true);
        else {
            if (addEstimator?.length > 0 || addAdmin?.length > 0) {
                dispatch(
                    actions.rfpProjectManager.assignContractorOrEstimatorStart({
                        add_organization: true,
                        contractorsList: allContractors,
                        project_id: projectId,
                        contractors: addContractors,
                        rfp_project_version: rfp_project_version,
                    }),
                );
            }

            if (removedUsers?.length > 0)
                dispatch(
                    actions.rfpProjectManager.removeUsersFromProjectStart({
                        contractors_list: removedUsers,
                        project_id: projectId,
                        rfp_project_version: rfp_project_version,
                    }),
                );
            setOpen({ open: false, data: open.data, checkedIds: open.checkedIds });
            setRemovedUsers([]);
            setAddAdmin([]);
            setAddEstimator([]);
            setAddContractors([]);
            setcheckedIds([]);
        }
        //eslint-disable-next-line
    }, [removedUsers, projectId, addContractors, existingContractors]);

    const handleChange = (
        e: any,
        input: {
            organization_id: string;
        },
    ) => {
        const { checked, id, name, value } = e.target;
        if (!checked) {
            //if unchecked and then checked
            let foundIndex =
                name === "admin"
                    ? addAdmin.findIndex((admin) => admin?.id === id)
                    : addEstimator.findIndex((admin) => admin?.id === id);
            if (foundIndex !== -1) {
                if (name === "admin") {
                    setAddAdmin((prevAdmins) => prevAdmins?.filter((admin) => admin?.id !== id));
                } else if (name === "estimator") {
                    setAddEstimator((prevEstimators) =>
                        prevEstimators?.filter((estimator) => estimator?.id !== id),
                    );
                }
                setAddContractors((prevContractor: any[]) =>
                    prevContractor?.filter((c: { contractor_id: any }) => c?.contractor_id !== id),
                );
                setcheckedIds((prevCheckedIds) => prevCheckedIds.filter((c) => c !== id));
            } else {
                let deleteContractor = {
                    contractor_id: id,
                    organization_id: input?.organization_id,
                };

                removedUsers =
                    removedUsers?.length > 0
                        ? [...removedUsers, deleteContractor]
                        : [deleteContractor];
                setcheckedIds((prevCheckedIds) => prevCheckedIds.filter((c) => c !== id));
                setRemovedUsers(removedUsers);
            }
        } else if (checked) {
            //if unchecked and then checked
            let foundIndex = removedUsers?.findIndex((user) => user.contractor_id === id);
            if (foundIndex !== -1) {
                setRemovedUsers((prevUsers) => prevUsers?.filter((u) => u.contractor_id !== id));
            } else {
                setAddContractors((prevContractors: any) => [
                    ...prevContractors,
                    { contractor_id: id, organization_id: input.organization_id },
                ]);
                if (name === "admin") {
                    setAddAdmin((prevAdmins: any) => [
                        ...prevAdmins,
                        { name: value, id: id, email: "" },
                    ]);
                }

                if (name === "estimator") {
                    setAddEstimator((prevEstimators: any) => [
                        ...prevEstimators,
                        { name: value, id: id, email: "" },
                    ]);
                }
            }
            setcheckedIds((prevCheckedIds) => [...prevCheckedIds, id]);
        }
    };

    useEffect(() => {
        setcheckedIds(open?.checkedIds);
    }, [open?.checkedIds]);

    return (
        <Dialog
            open={open.open}
            onClose={() => {
                setRemovedUsers([]);
                setOpen({ open: false, data: open.data, checkedIds: open.checkedIds });
            }}
            fullWidth
            maxWidth={"lg"}
        >
            <DialogTitle>
                <Stack direction={"row"} spacing={2}>
                    <PeopleAltOutlinedIcon />
                    <Typography variant="text_16_semibold">
                        {`${open?.data?.[0]?.name}: Manage Users`}
                    </Typography>
                </Stack>
                <Divider sx={{ marginTop: "0.5rem" }} />
            </DialogTitle>
            <DialogContent sx={{ padding: "1.2rem 1.5rem" }}>
                <Grid
                    container
                    sx={{
                        background: "#fff",
                        border: "1px solid #bcbcbb",
                        borderRadius: "5px",
                        maxHeight: "15rem",
                        overflowY: "auto",
                    }}
                >
                    <Grid
                        container
                        sx={{
                            direction: "row",
                            m: "1.2rem",
                            mt: "10px",
                        }}
                    >
                        {roles?.map((role) => {
                            return (
                                <Grid
                                    item
                                    key={role}
                                    sx={{
                                        maxHeight: "15rem",
                                    }}
                                    sm={6}
                                    md={6}
                                    xs={6}
                                >
                                    <Grid container direction={"column"}>
                                        <Grid item>
                                            <Typography variant="text_12_semibold">
                                                {role === "CONTRACTOR_ADMIN"
                                                    ? "Contractor Admins"
                                                    : "Estimators"}
                                                {isAdminEmpty && role === "CONTRACTOR_ADMIN" && (
                                                    <>
                                                        <Typography
                                                            color="#D90000"
                                                            variant="text_12_light"
                                                            sx={{ marginLeft: "5px" }}
                                                        >
                                                            {ADD_CONTRACTOR.WARNING_TEXT}
                                                        </Typography>
                                                    </>
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Grid container>
                                                <Grid item>
                                                    <Divider
                                                        sx={{
                                                            width: "26rem",
                                                            mb: "10px",
                                                            mt: "10px",
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    {role === "ESTIMATOR"
                                                        ? //@ts-ignore
                                                          open?.data?.[0]?.ESTIMATOR?.map(
                                                              (estimator: any) => {
                                                                  return (
                                                                      <Grid
                                                                          item
                                                                          sm={6}
                                                                          xs={6}
                                                                          md={6}
                                                                          key={estimator?.id}
                                                                      >
                                                                          <Stack
                                                                              key={estimator?.id}
                                                                              direction="row"
                                                                              spacing={2}
                                                                              alignItems={"center"}
                                                                          >
                                                                              <BaseCheckbox
                                                                                  onChange={(
                                                                                      e: any,
                                                                                  ) =>
                                                                                      handleChange(
                                                                                          e,
                                                                                          {
                                                                                              organization_id:
                                                                                                  open
                                                                                                      ?.data?.[0]
                                                                                                      ?.organization_id,
                                                                                          },
                                                                                      )
                                                                                  }
                                                                                  id={estimator?.id}
                                                                                  value={
                                                                                      estimator?.name
                                                                                  }
                                                                                  name={"estimator"}
                                                                                  checked={checkedIds?.includes(
                                                                                      estimator?.id,
                                                                                  )}
                                                                              />
                                                                              <Stack>
                                                                                  <Typography variant="text_12_regular">
                                                                                      {
                                                                                          estimator?.name
                                                                                      }
                                                                                  </Typography>
                                                                                  <Typography
                                                                                      variant="text_10_regular"
                                                                                      color="#757575"
                                                                                  >
                                                                                      {
                                                                                          estimator?.email
                                                                                      }
                                                                                  </Typography>
                                                                              </Stack>
                                                                          </Stack>
                                                                      </Grid>
                                                                  );
                                                              },
                                                          )
                                                        : //@ts-ignore
                                                          open?.data?.[0]?.CONTRACTOR_ADMIN?.map(
                                                              (admin: {
                                                                  selected: any;
                                                                  id: React.Key | null | undefined;
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
                                                                          key={admin?.id}
                                                                          sm={6}
                                                                          md={6}
                                                                          xs={6}
                                                                      >
                                                                          <Stack
                                                                              key={admin?.id}
                                                                              direction="row"
                                                                              spacing={2}
                                                                              alignItems={"center"}
                                                                          >
                                                                              <BaseCheckbox
                                                                                  key={admin?.id}
                                                                                  onChange={(
                                                                                      e: any,
                                                                                  ) =>
                                                                                      handleChange(
                                                                                          e,
                                                                                          {
                                                                                              organization_id:
                                                                                                  open
                                                                                                      ?.data?.[0]
                                                                                                      ?.organization_id,
                                                                                          },
                                                                                      )
                                                                                  }
                                                                                  id={admin?.id}
                                                                                  value={
                                                                                      admin?.name
                                                                                  }
                                                                                  name={"admin"}
                                                                                  checked={checkedIds?.includes(
                                                                                      //@ts-ignore
                                                                                      admin?.id,
                                                                                  )}
                                                                              />
                                                                              <Stack>
                                                                                  <Typography variant="text_12_regular">
                                                                                      {admin?.name}
                                                                                  </Typography>
                                                                                  <Typography
                                                                                      variant="text_10_regular"
                                                                                      color="#757575"
                                                                                  >
                                                                                      {admin?.email}
                                                                                  </Typography>
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
            </DialogContent>
            <DialogActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: "1.2rem  1.5rem",
                    paddingTop: 0,
                }}
            >
                <BaseButton
                    onClick={() => {
                        setRemovedUsers([]);
                        setOpen({ open: false, data: open.data, checkedIds: open.checkedIds });
                    }}
                    label={"Cancel"}
                    classes="grey default spaced"
                    variant={"text_14_regular"}
                    sx={{ mr: "5px" }}
                />
                <BaseButton
                    onClick={onSave}
                    label={"Save"}
                    classes="primary default spaced"
                    variant={"text_16_semibold"}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ManageUser;
