import React, { FC, useState } from "react";
import { useTheme, Typography, Grid, Stack, Divider, Container, IconButton } from "@mui/material";
import { textHighlighterConstants } from "../../constant";
import EditableTextField from "../scraper-editable-text-field";
import TextHighlight from "../scraper-text-highlighter";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { ITextHighlightGridProps } from "../../interface";

const TextHighlightGrid: FC<ITextHighlightGridProps> = ({
    highlightedText,
    setHighlightedText,
    fileContent,
}) => {
    //hooks
    const theme = useTheme();
    const [selectedText, setSelectedText] = useState<string>("");

    // handlers
    const onDelete = (index: number) => {
        setHighlightedText?.((prev) => prev.filter((ele, i) => i !== index));
    };
    const onEdit = (index: number, value: string) => {
        if (highlightedText.indexOf(value) > -1) {
            setHighlightedText?.((prev) => {
                let temp = [...prev];
                temp.splice(index, 1);
                return temp;
            });
        } else
            setHighlightedText?.((prev) => {
                let temp = [...prev];
                temp[index] = value;
                return temp;
            });
    };
    const addToHighlighted = (value: string) => {
        setHighlightedText?.((prev) => {
            let temp = [...prev];
            temp.splice(0, 0, value);
            return temp;
        });
    };
    const add = () => {
        addToHighlighted?.("");
    };

    return (
        <React.Fragment>
            <Grid container direction="column" width="100%">
                <Grid item sx={{ background: theme.background.cardHeader }}>
                    <Stack
                        direction="row"
                        sx={{ margin: "1.5rem 3rem" }}
                        justifyContent="space-between"
                    >
                        <Typography variant="subtitle1">{textHighlighterConstants.DATA}</Typography>
                        <Typography variant="subtitle1" sx={{ marginRight: "12rem" }}>
                            {textHighlighterConstants.MODEL_NUMBER}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid container direction="row" height="100%" width="100%">
                    <Grid
                        item
                        xs
                        sx={{
                            margin: "2rem 3rem",
                        }}
                    >
                        <TextHighlight
                            text={fileContent}
                            highlightedTexts={highlightedText}
                            selectedValue={selectedText}
                            addToHighlighted={addToHighlighted}
                        />
                    </Grid>
                    <Divider
                        flexItem
                        orientation="vertical"
                        sx={{ minHeight: "inherit", margin: "2.2rem 3rem 4rem 0rem" }}
                    />
                    <Grid item mt="2rem" mr="2rem" xs={2.5}>
                        <Stack direction="column" spacing={2} mb="2rem">
                            <Typography variant="heading">
                                {highlightedText?.length}
                                {textHighlighterConstants.ITEMS_FOUND}
                            </Typography>
                            <Stack direction="row" alignItems="center">
                                <IconButton onClick={add}>
                                    <AddBoxIcon
                                        fontSize="large"
                                        htmlColor={theme.background.selectedSKU}
                                    />
                                </IconButton>
                                <Stack direction="column">
                                    <Typography variant="subtitle1">
                                        {textHighlighterConstants.ADD_NEW_ITEMS}
                                    </Typography>
                                    <Typography variant="body2">
                                        {textHighlighterConstants.ADD_MODEL_URL}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Container sx={{ paddingBottom: "1rem" }} />
                            {highlightedText?.map((text, index) => (
                                <EditableTextField
                                    text={text}
                                    key={text === "" ? `${text}${index}` : text ?? index}
                                    index={index}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    setSelected={setSelectedText}
                                    isEditableInitially={text === "" && index === 0}
                                />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
export default TextHighlightGrid;
