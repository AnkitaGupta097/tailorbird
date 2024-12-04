import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from "@mui/material";
import actions from "stores/actions";
import { getCategoryIcon } from "../../category-icons";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import appTheme from "styles/theme";
import { isEmpty, map } from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateNewItemModal from "../../modal/create-new-item-modal";
import Icon from "assets/icons/icon-exclamation.svg";
import CreateItem from "./create-item";
import loaderProgress from "assets/icons/blink-loader.gif";
import { mapRenoWithNewItem } from "../../../helper";

const NewItemList = () => {
    const dispatch = useAppDispatch();
    const { newItems, loading, renovationItems } = useAppSelector((state) => {
        return {
            newItems: state.budgeting.details.newItemList,
            loading: state.budgeting.details.newItemStatus.loading,
            renovationItems: state.budgeting.details.baseScope.renovations.data,
        };
    });
    const [openItemModal, setItemModal] = useState<any>(false);
    const [expanded, setExpanded] = useState<string[]>(["panel-0"]);

    useEffect(() => {
        if (!isEmpty(newItems) && !isEmpty(renovationItems)) {
            const newItemWithSubCategory = mapRenoWithNewItem(renovationItems, newItems);
            dispatch(
                actions.budgeting.fetchDataSourceNewItemsSuccess({
                    getDataSourceNewItems: newItemWithSubCategory,
                }),
            );
        }
        // eslint-disable-next-line
    }, [renovationItems]);

    const changeExpanded = (e: any, panel: string, newExpanded: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (newExpanded) {
            setExpanded([...expanded, panel]);
        } else {
            setExpanded([...expanded.filter((e: any) => e !== panel)]);
        }
    };

    const getNewItem = () => {
        return map(newItems, (item, index) => {
            return (
                <Accordion
                    expanded={expanded.includes(`panel-${index}`)}
                    disableGutters={true}
                    key={`panel-${index}`}
                    className="Scope-table-section-cat-table"
                    style={{
                        marginTop: `${index == "0" ? "0px" : "1px"}`,
                        border: "1px solid #EEEEEE",
                    }}
                >
                    <AccordionSummary
                        onClick={(e) =>
                            changeExpanded(
                                e,
                                `panel-${index}`,
                                !expanded.includes(`panel-${index}`),
                            )
                        }
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${index}d-content`}
                        id={`panel-${index}d-header`}
                        className="Scope-table-category-title-group"
                        style={{ paddingLeft: "16px" }}
                    >
                        <Typography variant="text_14_medium">{item.item_name}</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                        {loading == index ? (
                            <Box
                                display="flex"
                                justifyContent="center"
                                width="100%"
                                height="100%"
                                alignItems="center"
                                mt={5}
                            >
                                <div>
                                    <img
                                        src={loaderProgress}
                                        alt="loading"
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            paddingTop: "20px",
                                        }}
                                    />
                                </div>
                            </Box>
                        ) : (
                            <CreateItem
                                isModal={false}
                                newItem={{ ...item, scopes: item.scopes ? item.scopes : [] }}
                                itemIndex={index}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            );
        });
    };
    return (
        <Box
            mb={1}
            display="flex"
            flexDirection="column"
            sx={{
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
        >
            <Box
                p={4}
                display="flex"
                justifyContent="space-between"
                style={{ background: appTheme.background.header }}
            >
                <Box>
                    <Typography
                        className="Scope-table-reno-category-label-group"
                        variant="text_14_semibold"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <img
                            src={getCategoryIcon("New Items")}
                            width={30}
                            height={30}
                            alt="New Items icon"
                            className="Scope-table-reno-category-image"
                        />
                        New Items
                    </Typography>
                </Box>
                {!isEmpty(newItems) && (
                    <Box>
                        <Button
                            variant="outlined"
                            sx={{
                                height: "32px",
                                width: "108px",
                            }}
                            onClick={() => setItemModal(true)}
                        >
                            <Typography variant="text_16_medium">Add Item</Typography>
                        </Button>
                    </Box>
                )}
            </Box>
            {isEmpty(newItems) ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    flexGrow={1}
                    height="320px"
                >
                    <Box mb={2}>
                        <img src={Icon} alt="exclamation icon" />
                    </Box>
                    <Box mb={7}>
                        <Typography variant="text_18_regular" color={appTheme.error.scraper}>
                            No new items found in take off files.
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            sx={{
                                border: `1px solid ${appTheme.error.scraper}`,
                                height: "48px",
                                width: "147px",
                            }}
                            onClick={() => setItemModal(true)}
                        >
                            <Typography variant="text_16_medium" color={appTheme.error.scraper}>
                                Add Item
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box>{getNewItem()}</Box>
            )}
            {openItemModal && (
                <CreateNewItemModal openModal={openItemModal} modalHandler={setItemModal} />
            )}
        </Box>
    );
};

export default NewItemList;
