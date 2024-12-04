import { Typography, useTheme, Button, styled } from "@mui/material";
import { escapeRegExp } from "lodash";
import React, { useState } from "react";
import { textHighlighterConstants } from "../../constant";
import { ITextHighlight, IPoint } from "../../interface";

const PillButton = styled(Button)(({ theme }) => ({
    background: theme.background.black,
    borderRadius: "3.125rem",
    color: theme.background.white,
    position: "absolute",
    zIndex: 1,
    "&:hover": {
        background: theme.background.black,
        color: theme.background.white,
    },
}));

const TextHighlight: React.FC<ITextHighlight> = (props) => {
    // States
    const theme = useTheme();
    const [showButton, setShowButton] = useState<boolean>(false);
    const [buttonPosition, setButtonPositon] = useState<IPoint | null>(null);
    const [selectedText, setSelectedText] = useState<string>("");

    React.useEffect(() => {
        const listner = () => {
            setShowButton(false);
            setSelectedText("");
        };
        window.addEventListener("click", listner);
        return () => window.removeEventListener("click", listner);
        //eslint-disable-next-line
    }, []);

    // Regular Expression
    let restr = props.highlightedTexts
        ?.filter((ele) => ele.trim() !== "" && ele.length !== 0)
        .map((ele) => `(${escapeRegExp(ele)})`)
        .join("|");
    const regex = new RegExp(restr ?? "", "gi");
    const parts =
        restr === "" ? ([props.text] as Array<string> | undefined) : props.text?.split(regex);
    // Handlers
    const onClick = () => props?.addToHighlighted?.(selectedText.trim());
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        let selection = window.getSelection()?.toString();
        if (
            selection !== "" &&
            selection !== undefined &&
            selection !== null &&
            selection.length > 4
        ) {
            setShowButton(true);
            setSelectedText(selection);
            setButtonPositon({
                x: e.pageX,
                y: e.pageY,
            });
        }
    };
    const onTypographyClick = () => {
        if (showButton) {
            setShowButton(false);
        }
    };

    return (
        <React.Fragment>
            <PillButton
                sx={{
                    display: showButton ? "initial" : "none",
                    top: `${buttonPosition?.y}px`,
                    left: `${buttonPosition?.x}px`,
                }}
                onClick={onClick}
            >
                {textHighlighterConstants.CLICK_TO_ADD_TO_MODAL}
            </PillButton>
            <Typography
                variant="body"
                sx={{
                    "&::selection ": {
                        backgroundColor: theme.background.scrappedSKUs,
                    },
                }}
                onClick={onTypographyClick}
                onContextMenu={onContextMenu}
            >
                {parts?.filter(String).map((part, index) => {
                    return regex.test(part) && restr !== "" ? (
                        <span
                            style={{
                                background:
                                    props.selectedValue?.toLocaleLowerCase() !==
                                    part?.toLocaleLowerCase()
                                        ? theme.background.scrappedSKUs
                                        : theme.background.selectedSKU,
                                borderRadius: "3.125rem",
                                padding: ".25rem",
                                color:
                                    props.selectedValue?.toLocaleLowerCase() !==
                                    part?.toLocaleLowerCase()
                                        ? theme.text.dark
                                        : theme.text.white,
                                zIndex: props.selectedValue !== part ? "initial" : "1",
                            }}
                            key={`${part}${index}`}
                            className={part?.toLowerCase() ?? ""}
                        >
                            {part}
                        </span>
                    ) : (
                        part
                    );
                })}
            </Typography>
        </React.Fragment>
    );
};

export default TextHighlight;
