import { Box, Typography, Button, Divider } from "@mui/material";
import React from "react";
import { useAppDispatch } from "../../../stores/hooks";
import actions from "../../../stores/actions";
import { getContainerIds } from "./service";
import { useNavigate } from "react-router-dom";
import { FETCH_USER_DETAILS } from "modules/projects/constant";
const ScopeEditorHeader = ({
    setIsReset,
    scopeList,
    scopeData,
}: {
    setIsReset: any;
    scopeList: any;
    scopeData: any;
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const containerIds = getContainerIds(scopeList);

    return (
        <React.Fragment>
            <Box
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                }}
            >
                <Typography
                    style={{
                        margin: "20px auto 0 38px",
                        borderBottom: "3px solid #004D71",
                    }}
                    variant="heading"
                >
                    Spec Options
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{
                        height: "40px",
                        marginRight: "10px",
                        marginBottom: "10px",
                        fontWeight: 600,
                        fontSize: "16px",
                        marginTop: "20px",
                    }}
                    onClick={() => setIsReset(true)}
                >
                    Reset
                </Button>
                <Button
                    variant="contained"
                    style={{
                        height: "40px",
                        marginRight: "40px",
                        marginBottom: "10px",
                        fontWeight: 600,
                        fontSize: "16px",
                    }}
                    onClick={() => {
                        dispatch(
                            actions.scopes.upsertScopeLibraryStart({
                                ...(scopeData.id && scopeData.id.length && { id: scopeData.id }),
                                name: scopeData.name,
                                description: scopeData.description,
                                type: scopeData.scopeType || scopeData.type.toUpperCase(),
                                ownership: scopeData.ownershipGroupId ?? "",
                                createdBy: FETCH_USER_DETAILS().id || "user",
                                data: containerIds,
                                projectType: scopeData.projectType?.toUpperCase(),
                                containerVersion: scopeData.containerVersion,
                            }),
                        );
                        navigate("/scopes", { replace: true });
                        // dispatch(actions.scopes.fetchScopeLibrariesListStart({}));
                    }}
                >
                    {scopeData?.isEdit ? "Update" : "Save"}
                </Button>
            </Box>
            <Divider style={{ width: "100%", marginTop: "-2px" }} />
        </React.Fragment>
    );
};

export default ScopeEditorHeader;
