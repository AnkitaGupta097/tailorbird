import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Grid, GridProps, styled, Typography } from "@mui/material";

interface IRenoDetails {
    renoItem: any;
    hasBorder?: boolean;
    workId?: string;
}

const RenoDetailsContainer = styled(Grid)<GridProps>(() => ({
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "10px",
    textAlign: "center",
    wordWrap: "normal",
    overflowY: "auto",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    maxHeight: "405px",
}));

const RenoDetails = ({ renoItem, hasBorder = false, workId }: IRenoDetails) => {
    const hoverBorder = hasBorder
        ? { "&:hover": { border: "1px solid #004D71" }, cursor: "pointer" }
        : {};
    return renoItem ? (
        <RenoDetailsContainer
            className="Reno-details-container"
            sx={hoverBorder}
            style={{
                border:
                    workId && (workId === renoItem.materialId || workId === renoItem.laborId)
                        ? "1px solid #004D71"
                        : "initial",
            }}
        >
            <Typography variant="heading" className="Reno-details-item">
                {renoItem.category || null}
            </Typography>
            <Typography>
                {renoItem.imageUrl ? (
                    <img
                        src={renoItem.imageUrl}
                        width={"90%"}
                        alt={`${renoItem.subcategory} product`}
                        height={80}
                        style={{
                            border: "0.5px solid #DEDEDE",
                            padding: "2px",
                            borderRadius: "5px",
                            margin: "5px auto",
                        }}
                        className="Reno-details-image"
                    />
                ) : (
                    <HelpOutlineIcon
                        className="Reno-details-image"
                        style={{
                            border: "0.5px solid #DEDEDE",
                            color: "#757575",
                            padding: "4px",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            margin: "5px auto",
                            height: "80px",
                            width: "90%",
                        }}
                    />
                )}
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Location:</Grid>{" "}
                <Typography>{renoItem.qualifier || renoItem.location || "-"}</Typography>
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Manufacturer:</Grid> <Typography>{renoItem?.manufacturer || "-"}</Typography>
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Model no:</Grid> <Typography>{renoItem?.modelNo || "-"}</Typography>
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Description:</Grid> <Typography>{renoItem.description || "-"}</Typography>
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Supplier:</Grid>{" "}
                <Typography>
                    {renoItem.supplier ||
                        (renoItem?.suppliers &&
                            renoItem.suppliers.length &&
                            renoItem.suppliers[0].supplier_name) ||
                        "-"}
                </Typography>
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Item No:</Grid>{" "}
                <Typography>
                    {renoItem.itemNo ||
                        (renoItem?.suppliers &&
                            renoItem.suppliers.length &&
                            renoItem.suppliers[0].sku_id) ||
                        "-"}
                </Typography>
            </Typography>
            <Typography variant="summaryText" className="Reno-details-item">
                <Grid>Cost:</Grid> <Typography>${renoItem.unitCost || "-"}</Typography>
            </Typography>
        </RenoDetailsContainer>
    ) : null;
};

export default React.memo(RenoDetails);
