import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Chip, Grid, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import { useAppSelector } from "stores/hooks";
import { uomConverter } from "../constants";

type HistoricalPricingMenuProps = {
    anchor: null | {
        element: HTMLElement;
        pc_item_id: string;
        params: { row: IItem; field: string };
    };
    setAnchor: React.Dispatch<
        React.SetStateAction<null | {
            element: HTMLElement;
            pc_item_id: string;
            params: { row: IItem; field: string };
        }>
    >;
    handleItemClick: Function;
};

const goToProject = (projectId: string, role: string, userID: string) => {
    if (localStorage.getItem("role") !== "admin") {
        const projectDetailsPageBaseUrl = `/rfp/${role}/${userID}/projects/${projectId}`;
        window.open(`${window.location.origin}${projectDetailsPageBaseUrl}`, "_blank");
    }
};

const HistoricalPricingMenu: FC<HistoricalPricingMenuProps> = ({
    anchor,
    setAnchor,
    handleItemClick,
}) => {
    const { role, userID } = useParams();
    const { historicalPricingData } = useAppSelector((state) => ({
        historicalPricingData: state.biddingPortal.historicalPricingData,
    }));

    return (
        <Paper>
            <Menu
                anchorEl={anchor?.element}
                open={!!anchor}
                onClose={() => setAnchor(null)}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {anchor?.pc_item_id
                    ? historicalPricingData[anchor!.pc_item_id].historical_prices.map(
                          (item, index) => (
                              <MenuItem
                                  key={`item?.price-${index}`}
                                  sx={{
                                      "&:hover": {
                                          cursor: "default",
                                      },
                                  }}
                              >
                                  <Grid
                                      container
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      gap={3}
                                  >
                                      <Grid item xs>
                                          <Stack direction="column">
                                              <Typography
                                                  variant="text_12_semibold"
                                                  sx={{
                                                      textDecorationLine: "underline",
                                                      display: "inline-flex",
                                                      "&:hover": {
                                                          cursor:
                                                              localStorage.getItem("role") !=
                                                              "admin"
                                                                  ? "pointer"
                                                                  : "default",
                                                      },
                                                  }}
                                                  onClick={() =>
                                                      goToProject(item.project_id, role!, userID!)
                                                  }
                                              >
                                                  {item.project_name} &nbsp;
                                                  <EmojiEventsIcon
                                                      sx={{
                                                          display: item?.is_finalist
                                                              ? "inline-block"
                                                              : "none",
                                                          fontSize: "16px",
                                                      }}
                                                      htmlColor="#00B779"
                                                  />
                                              </Typography>
                                              <Typography variant="text_12_regular">
                                                  {`${item?.city ? `${item.city} | ` : ""} `}
                                                  {moment(item.submitted_on).format("MM/DD/YYYY")}
                                              </Typography>
                                              <Typography variant="text_12_regular">
                                                  {item?.ownership_org_name}
                                              </Typography>
                                          </Stack>
                                      </Grid>
                                      <Grid item xs justifySelf="flex-end">
                                          <Chip
                                              label={
                                                  <Typography variant="text_14_regular">{`${
                                                      item.uom === "percentage" ? "" : "$"
                                                  }${item.unit_price.toLocaleString("en-US")} ${`${
                                                      item.uom === "percentage"
                                                          ? "%"
                                                          : `/ ${item?.uom ?? "None"}`
                                                  }`}`}</Typography>
                                              }
                                              sx={{
                                                  borderRadius: "5px",
                                                  backgroundColor: "#DDCBFB",
                                              }}
                                              onClick={
                                                  item.uom
                                                      ? () => {
                                                            let multipler = 1.0;
                                                            let row_uom =
                                                                anchor.params.row.specific_uom ??
                                                                anchor.params.row.uom;
                                                            if (
                                                                item.uom.trim().toLowerCase() !==
                                                                row_uom.trim().toLowerCase()
                                                            ) {
                                                                multipler = uomConverter(
                                                                    item.uom,
                                                                    row_uom,
                                                                );
                                                            }
                                                            handleItemClick(
                                                                item.unit_price * multipler,
                                                            );
                                                        }
                                                      : undefined
                                              }
                                          />
                                      </Grid>
                                  </Grid>
                              </MenuItem>
                          ),
                      )
                    : null}
            </Menu>
        </Paper>
    );
};

export default React.memo(HistoricalPricingMenu);
