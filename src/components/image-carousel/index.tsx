import React, { ReactElement, useState } from "react";
import Carousel from "react-material-ui-carousel";
import AppTheme from "styles/theme";
import nextArrow from "../../assets/icons/next-arrow.svg";
import prevArrow from "../../assets/icons/prev-arrow.svg";
import { CarouselNavProps } from "react-material-ui-carousel/dist/components/types";
import { Grid, SxProps } from "@mui/material";

interface ICarouselItems {
    items: { imgPath: string; altText: string }[];
    autoPlay?: boolean;
    animation?: "fade" | "slide";
    wrapperStyle?: SxProps;
    navButtonAlwaysVisible?: boolean;
    navButtonProps?: CarouselNavProps;
    carouselStyle?: SxProps;
    imgStyle?: React.CSSProperties;
    carouselNavIcons?: { nextIcon: ReactElement<any>; prevIcon: ReactElement<any> };
    showThumbnails?: boolean;
    thumbnailItems?: { imgPath: string; altText: string }[];
    thumbnailStyle?: React.CSSProperties;
    thumbnailWrapperStyling?: SxProps;
    // CarouselProps.onChange?: ((now?: number | undefined, previous?: number | undefined) => any) | undefined
    //eslint-disable-next-line
    onImageChange?: (now?: number, previous?: number) => any;
}

const ImageCarousel: React.FC<ICarouselItems> = ({
    items,
    autoPlay,
    animation,
    wrapperStyle,
    navButtonAlwaysVisible,
    navButtonProps,
    carouselNavIcons,
    carouselStyle,
    imgStyle,
    showThumbnails,
    thumbnailItems,
    thumbnailStyle,
    thumbnailWrapperStyling,
    onImageChange,
}) => {
    const [imgIdx, setImgIdx] = useState<number>(0);

    return (
        <Grid container sx={wrapperStyle}>
            <Grid item>
                <Carousel
                    sx={carouselStyle}
                    autoPlay={autoPlay}
                    onChange={onImageChange}
                    animation={animation}
                    navButtonsAlwaysVisible={navButtonAlwaysVisible}
                    navButtonsProps={navButtonProps}
                    NextIcon={carouselNavIcons?.nextIcon}
                    PrevIcon={carouselNavIcons?.prevIcon}
                    swipe={true}
                    index={imgIdx}
                >
                    {items?.map(({ imgPath, altText }, idx) => (
                        <img
                            key={`${idx}-${altText}`}
                            src={imgPath}
                            alt={altText}
                            style={imgStyle}
                        />
                    ))}
                </Carousel>
            </Grid>
            {showThumbnails && (
                <Grid container sx={thumbnailWrapperStyling} id="thumbnails" spacing={"8px"}>
                    {thumbnailItems?.map(({ imgPath, altText }, idx) => (
                        <Grid
                            item
                            sx={{
                                "&:hover": {
                                    opacity: 0.5,
                                },
                            }}
                            key={idx}
                            onClick={() => setImgIdx(idx)}
                        >
                            <img style={thumbnailStyle} src={imgPath} alt={altText} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Grid>
    );
};

ImageCarousel.defaultProps = {
    autoPlay: false,
    animation: "slide",
    navButtonAlwaysVisible: true,
    carouselStyle: {
        width: "680px",
        height: "324px",
        paddingBottom: "8px",
    },
    carouselNavIcons: {
        nextIcon: <img src={nextArrow} color="#5c5f62" alt="next" />,
        prevIcon: <img src={prevArrow} color="#5c5f62" alt="prev" />,
    },
    imgStyle: {
        width: "576px",
        height: "324px",
        marginLeft: "52px",
        marginRight: "52px",
        borderRadius: "4px",
    },
    navButtonProps: {
        style: {
            backgroundColor: AppTheme.background.header,
            width: "36px",
            height: "36px",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
        },
    },
    wrapperStyle: { display: "flex", flexDirection: "column", alignItems: "center" },
    showThumbnails: true,
    thumbnailStyle: {
        height: "56px",
        width: "56px",
        borderRadius: "4px",
    },
    thumbnailWrapperStyling: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
        maxWidth: "192px",
        maxHeight: "70px",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
};

export default ImageCarousel;
