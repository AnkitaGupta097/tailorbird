import { Card, CardContent, CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import { ReactComponent as CheckListIcon } from "../../../assets/icons/checklist.svg";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { ReactComponent as EventIcon } from "../../../assets/icons/event.svg";
import { ReactComponent as ChangeHistory } from "../../../assets/icons/change_history.svg";
import BaseChip from "components/chip";
import { useNavigate } from "react-router-dom";
import { productionTabUrl } from "../constants";
import { getRoundedOffAndFormattedAmount } from "../helper";
import { useProductionContext } from "context/production-context";
import TrackerUtil from "utils/tracker";

type IAgreementCard = {
    contractorId: string;
    contractorName: string;
    isSavedAgreement: boolean;
    savedAt?: string;
    contractorEmail: string;
    contractorContact: string;
    agreementAmount: string;
    categories?: string;
    projectId?: string;
    projectName?: string;
    agreementId: string;
    onClick?: any;
    isLiveAgreementLoading?: boolean;
};

const AgreementCard = ({
    contractorId,
    contractorName,
    isSavedAgreement,
    savedAt,
    contractorContact,
    contractorEmail,
    agreementAmount,
    categories,
    projectId,
    agreementId,
    onClick,
    isLiveAgreementLoading,
    projectName,
}: IAgreementCard) => {
    const navigate = useNavigate();
    const { isRFPProject } = useProductionContext();

    return (
        <Card
            sx={{
                display: "flex",
                padding: "12px 12px 12px 12px",
                alignItems: "center",
                gap: "20px",
                alignSelf: "stretch",
                borderRadius: "5px",
                background: "#FFF",
                width: "1125px",
                boxShadow:
                    "0px 2px 8px 0px rgba(0, 0, 0, 0.15), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
            }}
            onClick={
                isLiveAgreementLoading
                    ? undefined
                    : onClick
                    ? onClick
                    : () => {
                          TrackerUtil.event("CLICKED_AGREEMENT", {
                              projectName,
                              agreementId,
                              contractorId,
                          });
                          navigate(
                              `${productionTabUrl(
                                  projectId,
                                  isRFPProject,
                              )}/agreements/${agreementId}/${contractorId}/${contractorName}`,
                          );
                      }
            }
        >
            <CardContent>
                <Stack direction={"row"} gap={"16px"} sx={{ alignItems: "center" }}>
                    <HandshakeOutlinedIcon
                        sx={{ color: isSavedAgreement ? "#004D71" : "#B98900" }}
                    />
                    <Stack direction={"column"} sx={{ width: "553px" }}>
                        <Typography variant="text_16_semibold" color="#232323">
                            {contractorName}
                        </Typography>
                        {(savedAt &&
                            savedAt !== null &&
                            agreementAmount &&
                            agreementAmount !== null) ||
                        !isSavedAgreement ? (
                            <Typography variant="text_14_regular" color="#757575">
                                {`Agreement Amount: ${
                                    agreementAmount &&
                                    !isNaN(parseFloat(agreementAmount)) &&
                                    !isLiveAgreementLoading
                                        ? `$${getRoundedOffAndFormattedAmount(
                                              parseFloat(agreementAmount),
                                          )}`
                                        : "-"
                                }`}
                                {isLiveAgreementLoading && (
                                    <CircularProgress
                                        size={20}
                                        sx={{ marginBottom: "-5px", marginLeft: "5px" }}
                                    />
                                )}
                            </Typography>
                        ) : null}
                    </Stack>
                    <Tooltip title={categories}>
                        <CheckListIcon />
                    </Tooltip>
                    <Tooltip title={contractorContact}>
                        <PhoneIcon htmlColor="#8C9196" />
                    </Tooltip>
                    <Tooltip title={contractorEmail}>
                        <MailOutlineIcon htmlColor="#8C9196" />
                    </Tooltip>
                    {savedAt && savedAt !== null ? (
                        isSavedAgreement ? (
                            <BaseChip
                                avatar={<EventIcon />}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    borderRadius: "4px",
                                }}
                                textColor="#00344D"
                                bgcolor="#BCDFEF"
                                label={`Agreement Saved on ${savedAt}`}
                            />
                        ) : (
                            <BaseChip
                                avatar={<ChangeHistory />}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    borderRadius: "4px",
                                }}
                                textColor="#916A00"
                                bgcolor="#FFD79D"
                                label={`Live Agreement`}
                            />
                        )
                    ) : null}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default AgreementCard;
