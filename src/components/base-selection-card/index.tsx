import React, { useState } from "react";
import BaseDialog from "../base-dialog";
import BaseIconMenu from "../base-icon-menu";
import BaseIconButton from "../base-icon-button";
import {
    Card,
    Radio,
    Grid,
    MenuItem,
    styled,
    CardProps,
    Typography,
    RadioProps,
    GridProps,
    CircularProgress as Loader,
    TypographyProps,
} from "@mui/material";
import AddIcon from "../../assets/icons/icon-add.svg";
import ExclamationIcon from "../../assets/icons/icon-exclamation.svg";

interface IBaseSelectionCard {
    label: string;
    content: any;
    actions: any;
    header: any;
    selections: any;
    menuActions: any;
    open: any;
    // eslint-disable-next-line
    setOpen: (v: boolean) => void;
    parentClassName: string;
    setSelectedScopeInventory?: any;
    selectedItem?: any;
    icon: any;
    isLoading?: boolean;
    showWavg?: boolean;
    dialogSx?: any;
    overallWAVG?: any;
}

const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "0.5rem 1.875rem",
    background: theme.palette.secondary.light,
    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.11)",
    minHeight: "3.75rem",
    borderRadius: "0.5rem",
    gap: "0.625rem",
}));

const StyledCardInventories = styled(Grid)<GridProps>(() => ({
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
}));

const StyledCardInventoriesContainer = styled(Grid)<GridProps>(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.313rem",
}));

const StyledCardSelectionContainer = styled(Grid)<GridProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: theme.palette.primary.main,
    color: "#fff",
    borderRadius: "3.125rem",
    gap: "0.438rem",
    padding: "0.188rem 0.875rem",
    "&.disabled": {
        background: theme.palette.secondary.main,
        color: "#000",
        button: {
            filter: "invert(1)",
        },
    },
    button: {
        display: "flex",
        alignItems: "center",
        background: "transparent !important",
        margin: 0,
    },
    ".Base-selection-card-selection-takeoff": {
        height: "1.25rem",
        width: "1.25rem",
        filter: "brightness(0) invert(1)",
    },
}));

const StyledRadio = styled(Radio)<RadioProps>(({ theme }) => ({
    padding: 0,
    color: theme.palette.primary.main,
}));

const StyledSpan = styled(Typography)<TypographyProps>(() => ({
    fontFamily: "Inter : Medium : 16",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "1rem",
    lineHeight: "1.75rem",
}));

const BaseSelectionCard = ({
    label,
    content,
    actions,
    header,
    selections,
    menuActions,
    open,
    setOpen,
    parentClassName,
    setSelectedScopeInventory,
    selectedItem,
    icon,
    isLoading,
    showWavg = true,
    dialogSx,
    overallWAVG,
}: IBaseSelectionCard) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuAction = (e: any, menu: string, item: any) => {
        setIsMenuOpen(false);
        menuActions[menu].action(item.id);
    };

    const menuContent = (item: number) => {
        return Object.keys(menuActions).map((menu: any, idx: any) => (
            <MenuItem onClick={(e) => handleMenuAction(e, menu, item)} key={`${menu}-${idx}`}>
                {menu}
            </MenuItem>
        ));
    };

    const defineMenuContent = (item: number, isDefined: boolean) => {
        const menuItems = { ...(isDefined ? menuActions.defined : menuActions.toDefine) };
        return Object.keys(menuItems).map((menu: any, idx: any) => (
            <MenuItem
                onClick={(e) => handleDefineMenuAction(e, menu, item, isDefined)}
                key={`${menu}-${idx}`}
            >
                {menu}
            </MenuItem>
        ));
    };

    const handleDefineMenuAction = (e: any, menu: string, item: any, isDefined: boolean) => {
        setIsMenuOpen(false);
        const menuItems = { ...(isDefined ? menuActions.defined : menuActions.toDefine) };
        menuItems[menu].action(item.id);
    };

    return isLoading ? (
        <StyledCard
            className={`Base-selection-card ${
                label.toLowerCase() === "inventories" ? "" : "selections"
            }`}
            sx={{ display: "flex", justifyContent: "space-around" }}
        >
            <Loader />
        </StyledCard>
    ) : (
        <StyledCard
            className={`Base-selection-card ${
                label.toLowerCase() === "inventories" ? "" : "selections"
            }`}
        >
            <Grid>
                <Typography variant="heading">{label}</Typography>
                <BaseDialog
                    button={
                        icon.show ? (
                            <BaseIconButton
                                icon={AddIcon}
                                classes={`Base-selection-card-icon-button`}
                            />
                        ) : null
                    }
                    content={content}
                    actions={actions}
                    header={header}
                    open={open}
                    setOpen={setOpen}
                    sx={dialogSx}
                />
            </Grid>
            {selections?.length ? (
                label.toLowerCase() === "inventories" ? (
                    <StyledCardInventories className="Base-selection-card-inventories">
                        <StyledCardInventoriesContainer
                            className="Base-selection-card-inventories-container"
                            style={{ gap: "0.616rem" }}
                        >
                            {selections.map((item: any, idx: number) => (
                                <StyledCardInventoriesContainer
                                    key={`${item.name}-${idx}`}
                                    className={`Base-selection-card-inventories-container`}
                                >
                                    <StyledRadio
                                        checked={selectedItem?.name === item.name}
                                        onChange={() => setSelectedScopeInventory(item)}
                                        value={item.name}
                                        name={`${parentClassName}-inventories`}
                                        inputProps={{ "aria-label": "A" }}
                                        className={`Base-selection-card-radio`}
                                    />
                                    <StyledCardSelectionContainer
                                        className={`Base-selection-card-inventory-selection-container ${
                                            selectedItem?.name === item.name ? "" : "disabled"
                                        }`}
                                    >
                                        <StyledSpan
                                            className="Base-selection-card-selection-label"
                                            onClick={() => setSelectedScopeInventory(item)}
                                            role="presentation"
                                            data-item={item.id}
                                        >
                                            {item?.name}
                                        </StyledSpan>
                                        {selectedItem?.name === item.name && (
                                            <BaseIconMenu
                                                content={
                                                    menuActions?.defined
                                                        ? defineMenuContent(item, item?.isDefined)
                                                        : menuContent(item)
                                                }
                                                icon={icon.menuIcon}
                                                parentClassName={`${parentClassName} Base-selection-card-icon-container`}
                                                isMenuOpen={isMenuOpen}
                                                setIsMenuOpen={setIsMenuOpen}
                                            />
                                        )}
                                    </StyledCardSelectionContainer>
                                    {!item?.isDefined ? (
                                        <img
                                            src={ExclamationIcon}
                                            alt="Inventory not defined"
                                            title="Inventory not defined"
                                        />
                                    ) : null}
                                </StyledCardInventoriesContainer>
                            ))}
                        </StyledCardInventoriesContainer>

                        {selections.length && showWavg ? (
                            <StyledSpan className={`${parentClassName}-inventories-avg`}>
                                Overall WAVG: $ {overallWAVG}
                            </StyledSpan>
                        ) : null}
                    </StyledCardInventories>
                ) : (
                    <Grid
                        container
                        className="Base-selections-container"
                        sx={{
                            display: "flex",
                            gap: "0.63rem",
                            width: "max-content",
                        }}
                    >
                        {selections.map((item: any, idx: number) => (
                            <StyledCardSelectionContainer
                                className="Base-selection-card-selection-container"
                                key={`${label}-selection-${idx}`}
                            >
                                <StyledSpan className="Base-selection-card-selection-label">
                                    {item?.name}
                                    {item?.variationCount ? ` (${item.variationCount})` : ""}
                                </StyledSpan>
                                <BaseIconMenu
                                    content={menuContent(item)}
                                    icon={icon.menuIcon}
                                    parentClassName={parentClassName}
                                    isMenuOpen={isMenuOpen}
                                    setIsMenuOpen={setIsMenuOpen}
                                />
                                {item?.takeOffsInSync !== undefined && !item?.takeOffsInSync ? (
                                    <span className="Base-selection-card-selection-takeoff">
                                        <img src={ExclamationIcon} alt="takeoff not in sync" />
                                    </span>
                                ) : null}
                            </StyledCardSelectionContainer>
                        ))}
                    </Grid>
                )
            ) : null}
        </StyledCard>
    );
};

export default BaseSelectionCard;
