import { Box, Button, ClickAwayListener, IconButton, Popper } from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import actions from "../../../stores/actions";
import { shallowEqual } from "react-redux";
import AppTheme from "../../../styles/theme";

interface IImagePopper {
    id?: number;
    onChange: Function;
    handleClick: Function;
    value?: any;
    imageStyle?: React.CSSProperties | undefined;
    anchorEl: {
        id: any;
        value: null | HTMLElement;
    };
    setAnchorEl: React.Dispatch<
        React.SetStateAction<{
            id: number;
            value: null | HTMLElement;
        }>
    >;
    alt: string | number | boolean | undefined;
}

const ImagePopper = (props: IImagePopper) => {
    //Redux
    const { s3UploadLink } = useAppSelector((state) => {
        return {
            s3UploadLink: state.scraperService.scraper.s3UploadLink,
            loading: state.scraperService.scraper.loading,
        };
    }, shallowEqual);
    const dispatch = useAppDispatch();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const onButtonClick = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            actions.scraperService.uploadNewImageFileStart({
                fileName: e?.target?.files?.[0]?.name,
                filePath: `images`,
                file: e?.target?.files?.[0],
                id: props?.id,
            }),
        );
    };

    useEffect(() => {
        if (
            (s3UploadLink.s3Link !== null || s3UploadLink.s3Link !== undefined) &&
            s3UploadLink.id === props?.id
        ) {
            props?.onChange("product_thumbnail_url", s3UploadLink.s3Link.split("?")[0], props?.id);
            if (props?.setAnchorEl) {
                props?.setAnchorEl({ id: 0, value: null });
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [s3UploadLink]);

    const handleClickAway = () => {
        //@ts-ignore
        props?.setAnchorEl({ id: props?.id, value: null });
    };

    return (
        <React.Fragment>
            <IconButton
                onClick={(event) => {
                    props?.handleClick(props?.id, event);
                }}
            >
                <img
                    src={props?.value as string}
                    style={props?.imageStyle}
                    alt={props?.alt as string}
                />
            </IconButton>
            <Popper
                id={props?.anchorEl?.id ? "simple-popper" : "undefined"}
                open={Boolean(props?.anchorEl?.value)}
                anchorEl={props?.anchorEl?.value}
                sx={{ width: "19.6rem", height: "19.6rem" }}
                nonce={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                placement="auto"
                disablePortal={false}
                modifiers={[
                    {
                        name: "flip",
                        enabled: false,
                        options: {
                            altBoundary: false,
                            rootBoundary: "document",
                            padding: 8,
                        },
                    },
                    {
                        name: "preventOverflow",
                        enabled: true,
                        options: {
                            altAxis: true,
                            altBoundary: true,
                            tether: true,
                            rootBoundary: "document",
                            padding: 8,
                        },
                    },
                ]}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Box>
                        <img
                            src={props?.value as string}
                            style={{
                                background: AppTheme.common.white,
                                border: `0.5px solid ${AppTheme.border.divider}`,
                                borderRadius: "5px",
                                width: "19.6rem",
                                height: "19.6rem",
                            }}
                            alt={props?.value as string}
                        />
                        <label htmlFor="scraper_upload">
                            <Button
                                sx={{
                                    width: "19.6rem",
                                    height: "4.6rem",
                                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                                    color: AppTheme.common.white,
                                }}
                                disabled={false}
                                component={"span"}
                            >
                                <input
                                    hidden
                                    id={"scraper_upload"}
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={(event) => {
                                        if (event && event.target && event.target.files) {
                                            onButtonClick(event);
                                        }
                                    }}
                                    ref={inputRef}
                                />
                                {"Change Image"}
                            </Button>
                        </label>
                    </Box>
                </ClickAwayListener>
            </Popper>
        </React.Fragment>
    );
};

export default ImagePopper;
