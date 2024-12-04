import React, { useEffect, useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import actions from "../../../../stores/actions";
import { Grid, Typography, Stack, Paper, Button, TextField, Box } from "@mui/material";
import { getUnitMixData } from "../../../projects/details/projects-floorplans/service";
import FloorplanModal from "./create-floor-plan-modal";
import BaseDataGrid from "components/data-grid-pro";
import ContentPlaceholder from "components/content-placeholder";
import { GridActionsCellItem, GridAlignment, GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "@mui/material";
import { ReactComponent as CheckIcon } from "assets/icons/check.svg";
import { ReactComponent as Download } from "assets/icons/download-outlined.svg";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECT_FILE } from "components/production/constants";
import { downloadFile } from "stores/single-project/operation";
import { isEmpty } from "lodash";
import { UPDATE_FLOOR_PLAN } from "stores/projects/details/floor-plans/floor-plans-mutations";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";

const FloorPlanTable = (props: any) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    const { unitMix, floorplans, propertyDetails } = useAppSelector((state: any) => ({
        unitMix: state.projectFloorplans.unitMix,
        floorplans: state.projectFloorplans.floorplans,
        propertyDetails: state.propertyDetails.data,
    }));
    const [openFloorplanModal, setFloorplanModal] = useState(false);
    const [floorplan, setFloorplan] = useState<any>({});
    const [unitMixDetail, setUnitMixDetail] = useState<any>(null);
    const [editedTotalUnits, setEditedTotalUnits] = useState<{
        type: string;
        edits: {
            project_id: string;
            id: string;
            value: number;
        }[];
    } | null>(null);
    useEffect(() => {
        const updatedUnitMix: any = getUnitMixData(unitMix);
        setUnitMixDetail(updatedUnitMix);
        // eslint-disable-next-line
    }, [unitMix]);
    const updateUnitMixData = () => {
        if (!isEmpty(floorplans) && !isEmpty(floorplans?.data)) {
            const { totalUnits, totalRenoUnits } = floorplans.data
                .filter((elm: any) => elm.takeOffType === props.takeOffType)
                .reduce(
                    ({ totalUnits, totalRenoUnits }: Record<string, number>, elm: any) => ({
                        totalUnits: totalUnits + (elm?.totalUnits ?? 0),
                        totalRenoUnits: totalRenoUnits + (elm?.renoUnits ?? 0),
                    }),
                    { totalRenoUnits: 0, totalUnits: 0 },
                );

            setUnitMixDetail({ totalUnits, totalRenoUnits });
        }
    };
    useEffect(() => {
        updateUnitMixData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floorplans, props.takeOffType]);

    const getTakeOffTypeName = (takeOffType: string) => {
        switch (takeOffType) {
            case "FLOORPLAN":
                return "Floorplan";
            case "BUILDING":
                return "Building";
            case "SITE":
                return "Site Details";
            default:
                return "Common Area";
        }
    };
    const handleDownload = async (
        event: { stopPropagation: () => void },
        projectFileIds: number[],
    ) => {
        event.stopPropagation();

        try {
            const downloadPromises = projectFileIds?.map(async (projectFileId: number) => {
                const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                    fileId: projectFileId,
                });
                return downloadFile(res.getProjectFile.download_link, res.getProjectFile.file_name);
            });

            await Promise.all(downloadPromises);
        } catch (error) {
            console.error("Error downloading files:", error);
        }
    };
    const onClickEditTotalUnit = ({
        id,
        value,
        project_id,
    }: {
        id: string;
        value: number;
        project_id: string;
    }) => {
        setEditedTotalUnits((prev) => {
            if (prev) {
                const existingEntryIndex = prev.edits.findIndex((entry) => entry.id === id);
                if (existingEntryIndex !== -1) {
                    const updatedEdits = [...prev.edits];
                    updatedEdits[existingEntryIndex] = { id, value, project_id };
                    return {
                        type: props.takeOffType,
                        edits: updatedEdits,
                    };
                } else {
                    return {
                        type: props.takeOffType,
                        edits: [...prev.edits, { id, value, project_id }],
                    };
                }
            } else {
                return {
                    type: props.takeOffType,
                    edits: [{ id, value, project_id }],
                };
            }
        });
    };
    const onChangeTotalUnit = ({ id, value }: { id: string; value: number }) => {
        const updatedEdits =
            (editedTotalUnits ?? {}).edits?.map((edit) => {
                if (edit.id === id) {
                    return { ...edit, value };
                }
                return edit;
            }) ?? [];

        setEditedTotalUnits({
            type: props.takeOffType,
            edits: updatedEdits,
        });
    };
    console.log({ editedTotalUnits });

    const onSave = async () => {
        try {
            const updates =
                editedTotalUnits?.edits.map((edit) => ({
                    floor_plan_id: edit.id,
                    total_units: edit.value,
                    project_id: edit.project_id,
                })) || [];

            await Promise.all(
                updates.map((update) =>
                    graphQLClient.mutate("updateFloorPlan", UPDATE_FLOOR_PLAN, {
                        input: {
                            total_units: update.total_units,
                            id: update.floor_plan_id,
                            project_id: update.project_id,
                        },
                    }),
                ),
            );
            // @ts-ignore
            setEditedTotalUnits((prev) => {
                if (prev) {
                    return {
                        type: null,
                        edits: prev.edits,
                    };
                }
                return prev;
            });
            showSnackBar("success", "Successfully Updated Property Units");
        } catch (error) {
            console.error("onSave", error);
        }
    };
    const FloorPlanColumns = useMemo(
        () =>
            props.takeOffType === "FLOORPLAN"
                ? [
                      {
                          field: "commercial_name",
                          headerName: "Comercial Floorplan Name",
                          flex: 1.25,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">
                                  {params.row.commercial_name}
                              </Typography>
                          ),
                      },
                      {
                          field: "name",
                          headerName: "Floorplan Name",
                          flex: 1.0,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">{params.row.name}</Typography>
                          ),
                      },
                      {
                          field: "unit_type",
                          headerName: "Unit Type",
                          flex: 1.0,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">
                                  {params.row.unit_type}
                              </Typography>
                          ),
                      },
                      {
                          field: "type",
                          headerName: "Floorplan Type",
                          flex: 1.0,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">{params.row.type}</Typography>
                          ),
                      },
                      {
                          field: "area",
                          headerName: "Standard Area (SQFT)",
                          flex: 1.0,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">{params.row.area}</Typography>
                          ),
                      },
                      {
                          field: "totalUnits",
                          headerName: `Total Units (${unitMixDetail?.totalUnits})`,
                          flex: 0.8,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography>
                                  <Typography variant="text_14_regular">
                                      {params.row.totalUnits}
                                  </Typography>
                              </Typography>
                          ),
                      },
                      {
                          field: "autodesk_url",
                          headerName: "Autodesk URL Added",
                          flex: 0.5,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">
                                  {params.row.autodesk_url ? "Yes" : "No"}
                              </Typography>
                          ),
                      },
                      {
                          field: "isHavingMissingInfo",
                          headerName: "More Info is Needed",
                          flex: 1,

                          align: "center",
                          renderCell: (params: GridRenderCellParams) =>
                              params.row.isHavingMissingInfo && <CheckIcon />,
                      },
                      {
                          field: "download",
                          headerName: "Img/Vid Download",
                          flex: 1,
                          align: "center",
                          renderCell: (params: GridRenderCellParams) => {
                              const projectFileIds =
                                  params.row?.missingInfo?.map(
                                      (missingInfo: { id: any }) => missingInfo.id,
                                  ) || [];

                              return projectFileIds.length ? (
                                  <Button
                                      variant="text"
                                      disabled={!projectFileIds.length}
                                      onClick={(e) => handleDownload(e, projectFileIds)}
                                      startIcon={<Download />}
                                      sx={{
                                          fontSize: "0.875rem",
                                          fontWeight: "600",
                                      }}
                                  />
                              ) : null;
                          },
                      },
                      {
                          field: "actions",
                          headerName: "Action",
                          flex: 0.5,
                          type: "actions",
                          //eslint-disable-next-line
                          getActions: (params: any): JSX.Element[] => {
                              const projectFileIds =
                                  params.row?.missingInfo?.map(
                                      (missingInfo: { id: any }) => missingInfo.id,
                                  ) || [];
                              return [
                                  <GridActionsCellItem
                                      placeholder=""
                                      key={`menu-settings-${params.row?.id}`}
                                      label={"Edit"}
                                      // icon={
                                      //     <img
                                      //         src={ArchiveIcon}
                                      //         alt="Delete Icon"
                                      //     />
                                      // }
                                      onClick={() => {
                                          setFloorplanModal(true);
                                          setFloorplan(params.row);
                                      }}
                                      showInMenu
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                  />,
                                  <GridActionsCellItem
                                      disabled={!projectFileIds.length}
                                      placeholder=""
                                      key={`menu-settings-${params.row?.id}`}
                                      label={"See Images and Videos"}
                                      onClick={() => {
                                          props.handleSetSelectedItemForMedia(
                                              params.row,
                                              props.takeOffType,
                                          );
                                      }}
                                      showInMenu
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                  />,
                                  <GridActionsCellItem
                                      placeholder=""
                                      key={`menu-settings-${params.row?.id}`}
                                      label={"Delete"}
                                      // icon={
                                      //     <img
                                      //         src={ArchiveIcon}
                                      //         alt="Delete Icon"
                                      //     />
                                      // }
                                      onClick={() => {
                                          deleteFloorPlan(params.row.id);
                                      }}
                                      showInMenu
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                  />,
                              ];
                          },
                      },
                  ]
                : [
                      {
                          field: "name",
                          headerName: `${getTakeOffTypeName(props.takeOffType)} Name`,
                          flex: 1,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">{params.row.name}</Typography>
                          ),
                      },
                      {
                          field: "area",
                          headerName: "Area",
                          flex: 1,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">{params.row.area}</Typography>
                          ),
                      },
                      {
                          field: "autodesk_url",
                          headerName: "Autodesk URL",
                          flex: 2.5,
                          renderCell: (params: GridRenderCellParams) => (
                              <Link
                                  href={params.row.autodesk_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="body2"
                                  sx={{
                                      typography: "text_14_regular",
                                      color: "inherit",
                                      textDecoration: "none",
                                  }}
                              >
                                  {params.row.autodesk_url}
                              </Link>
                          ),
                      },
                      ...(props.takeOffType === "BUILDING" || props.takeOffType === "COMMON_AREA"
                          ? [
                                {
                                    field: "totalUnits",
                                    headerName: "Total Units",
                                    flex: 1,
                                    align: "center" as GridAlignment,
                                    headerAlign: "center",
                                    renderCell: (params: GridRenderCellParams) => (
                                        <div style={{ padding: "4px" }}>
                                            <TextField
                                                className="no-spinners"
                                                onClick={() => {
                                                    onClickEditTotalUnit({
                                                        id: params.row.id,
                                                        value: params.row.totalUnits,
                                                        project_id: params.row.projectId,
                                                    });
                                                }}
                                                type="number"
                                                fullWidth
                                                value={
                                                    editedTotalUnits?.edits.find(
                                                        (edit) => edit.id === params.row.id,
                                                    )?.value ?? params.row.totalUnits
                                                }
                                                onChange={(e) => {
                                                    onChangeTotalUnit({
                                                        id: params.row.id,
                                                        value: Number(e.target.value),
                                                    });
                                                }}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </div>
                                    ),
                                },
                            ]
                          : []),
                      {
                          field: "isHavingMissingInfo",
                          headerName: "More Info is Needed",
                          flex: 1,
                          align: "center",
                          headerAlign: "center",
                          renderCell: (params: GridRenderCellParams) =>
                              params.row.isHavingMissingInfo && <CheckIcon />,
                      },
                      {
                          field: "download",
                          headerName: "Img/Vid Download",
                          flex: 1,
                          align: "center",
                          renderCell: (params: GridRenderCellParams) => {
                              const projectFileIds =
                                  params.row?.missingInfo?.map(
                                      (missingInfo: { id: any }) => missingInfo.id,
                                  ) || [];

                              return projectFileIds.length > 0 ? (
                                  <Button
                                      variant="text"
                                      onClick={(e) => handleDownload(e, projectFileIds)}
                                      startIcon={<Download />}
                                      sx={{
                                          fontSize: "0.875rem",
                                          fontWeight: "600",
                                      }}
                                  />
                              ) : null;
                          },
                      },
                      {
                          field: "actions",
                          headerName: "Action",
                          flex: 1,
                          type: "actions",
                          //eslint-disable-next-line
                          getActions: (params: any): JSX.Element[] => {
                              const projectFileIds =
                                  params.row?.missingInfo?.map(
                                      (missingInfo: { id: any }) => missingInfo.id,
                                  ) || [];
                              return [
                                  <GridActionsCellItem
                                      placeholder=""
                                      key={`menu-settings-${params.row?.id}`}
                                      label={"Edit"}
                                      // icon={
                                      //     <img
                                      //         src={ArchiveIcon}
                                      //         alt="Delete Icon"
                                      //     />
                                      // }
                                      onClick={() => {
                                          setFloorplanModal(true);
                                          setFloorplan({
                                              ...params.row,
                                              takeOffType:
                                                  props.takeOffType == "SITE"
                                                      ? "SITE"
                                                      : params.row.takeOffType,
                                          });
                                      }}
                                      showInMenu
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                  />,
                                  <GridActionsCellItem
                                      disabled={!projectFileIds.length}
                                      placeholder=""
                                      key={`menu-settings-${params.row?.id}`}
                                      label={"See Images and Videos"}
                                      onClick={() => {
                                          props.handleSetSelectedItemForMedia(
                                              params.row,
                                              props.takeOffType,
                                          );
                                      }}
                                      showInMenu
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                  />,
                                  <GridActionsCellItem
                                      placeholder=""
                                      key={`menu-settings-${params.row?.id}`}
                                      label={"Delete"}
                                      // icon={
                                      //     <img
                                      //         src={ArchiveIcon}
                                      //         alt="Delete Icon"
                                      //     />
                                      // }
                                      onClick={() => {
                                          deleteFloorPlan(params.row.id);
                                      }}
                                      showInMenu
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                  />,
                              ];
                          },
                      },
                  ], //eslint-disable-next-line
        [floorplans.data.filter((elm: any) => elm.takeOffType === props.takeOffType)],
    );

    const deleteFloorPlan = (id: string) => {
        dispatch(
            actions.projectFloorplans.deleteFloorPlanStart({
                id,
            }),
        );
    };
    const clearLoadedFPData = () => {
        setFloorplan({});
    };
    const getRows = () => {
        return props.takeOffType == "SITE"
            ? [propertyDetails]
            : floorplans?.data?.filter((elm: any) => elm.takeOffType === props.takeOffType);
    };

    return (
        <Grid container mt={4}>
            <Grid item md={12}>
                <Paper elevation={3}>
                    <BaseDataGrid
                        columns={FloorPlanColumns}
                        rows={getRows()}
                        rowsPerPageOptions={[10, 20, 30]}
                        // loading={isLoading}
                        // onRowClick={(rowData: any) => {
                        //     type == "general" ? navigate(`/projects/${rowData.id}/overview`) : null;
                        // }}
                        disableColumnMenu={false}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack sx={{ margin: "10px" }}>
                                    <ContentPlaceholder
                                        // onLinkClick={() => {
                                        //     setProjectModal(true);
                                        // }}
                                        text={`No ${getTakeOffTypeName(
                                            // eslint-disable-next-line react/prop-types
                                            props.takeOffType,
                                        )} created.`}
                                        aText=""
                                        height="90px"
                                    />
                                </Stack>
                            ),
                        }}
                        // added default sort modal commercial name A-Z
                        initialState={{
                            sorting: {
                                sortModel: [
                                    {
                                        field:
                                            props.takeOffType === "FLOORPLAN"
                                                ? "commercial_name"
                                                : "name",
                                        sort: "asc",
                                    },
                                ],
                            },
                        }}
                        hideFooter={floorplans.data?.length < 10 ? true : false}
                        getRowId={(row: any) => row.id}
                    />
                </Paper>
                {(props.takeOffType === "BUILDING" || props.takeOffType === "COMMON_AREA") && (
                    <Box display="flex" my={4}>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ height: "40px", marginRight: "15px" }}
                            onClick={() => {
                                setEditedTotalUnits(null);
                            }}
                        >
                            <Typography variant="text_16_semibold">Cancel</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            style={{ height: "40px" }}
                            onClick={onSave}
                            disabled={editedTotalUnits?.type !== props.takeOffType}
                        >
                            <Typography variant="text_16_semibold"> Save</Typography>
                        </Button>
                    </Box>
                )}
            </Grid>

            <FloorplanModal
                takeOffType={floorplan.takeOffType}
                floorplan={floorplan}
                setFloorplanModal={setFloorplanModal}
                openModal={openFloorplanModal}
                clearLoadedFPData={clearLoadedFPData}
            />
        </Grid>
    );
};

export default React.memo(FloorPlanTable);
