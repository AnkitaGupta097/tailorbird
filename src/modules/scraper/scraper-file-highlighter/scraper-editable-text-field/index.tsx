import {
    ListItemIcon,
    Menu,
    ListItemText,
    MenuItem,
    MenuList,
    Stack,
    TextField,
    useTheme,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React, { FocusEvent, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IEditableTextField } from "../../interface";
import { Delete } from "@mui/icons-material";
import { editFieldConstants } from "../../constant";

const EditableTextField: React.FC<IEditableTextField> = (props) => {
    //hooks
    const theme = useTheme();
    const [editText, setEditText] = React.useState<boolean>(props?.isEditableInitially ?? false);
    const [focus, setFocus] = React.useState<boolean>(false);
    const { text, onDelete, onEdit, index, setSelected } = props;
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const textRef = React.useRef<HTMLInputElement>(null);
    // handlers and helper funcs
    const validUrl = (s: string) => {
        let url;
        try {
            url = new URL(s);
        } catch (e) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    };

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            onBlur(event);
        }
    };

    const getBackground = () => {
        return editText
            ? props?.isEditableInitially
                ? theme.background.white
                : theme.background.selectedSKU
            : focus
            ? theme.background.selectedField
            : theme.background.scrappedSKUs;
    };

    const onBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (editText && e.target.value !== text) {
            onEdit?.(index, e.target.value);
        }
        setEditText(false);
        focus && setSelected?.("");
        setFocus(false);
    };

    const onFocus = (e: FocusEvent<HTMLInputElement>) => {
        if (!editText) {
            setSelected?.(e.target.value) || setFocus(true);
            let element = document.getElementsByClassName(text?.toLowerCase() ?? "")[0];
            let headerOffset = 150;
            let elementPosition = element.getBoundingClientRect().top;
            let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    // hooks
    useEffect(() => {
        if (!editText && text === "") onDelete?.(index);
        if (editText) textRef.current?.focus();
        //eslint-disable-next-line
    }, [editText]);

    return (
        <React.Fragment>
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    defaultValue={text}
                    sx={{
                        border: `1px solid ${theme.border.focus}`,
                        borderRadius: "6px",
                        input: {
                            color: editText
                                ? props?.isEditableInitially
                                    ? theme.text.dark
                                    : theme.text.white
                                : theme.text.dark,
                            ...theme.typography.heading,
                            "&:hover": {
                                cursor: !editText ? "pointer" : "inherit",
                            },
                        },
                    }}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        readOnly: !editText,
                        style: { background: getBackground() },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme.text.dark,
                        },
                    }}
                    inputRef={textRef}
                    onBlur={onBlur}
                    //eslint-disable-next-line
                    autoFocus={editText}
                    onFocus={onFocus}
                    helperText={editText ? editFieldConstants.HELPER_TEXT : null}
                />
                {!props?.isEditableInitially ? (
                    <MoreVertIcon
                        fontSize="medium"
                        onClick={(e) => setAnchor(e.currentTarget as unknown as HTMLElement)}
                    />
                ) : (
                    <Delete
                        htmlColor={theme.background.menuButton}
                        onClick={() => {
                            onDelete?.(index);
                        }}
                    />
                )}
                <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)}>
                    <MenuList>
                        {validUrl(text ?? "") ? (
                            <MenuItem
                                onClick={() => {
                                    window.open(text);
                                    setAnchor(null);
                                }}
                            >
                                <ListItemIcon>
                                    <OpenInNewIcon
                                        fontSize="small"
                                        htmlColor={theme.background.menuButton}
                                    />
                                </ListItemIcon>
                                <ListItemText>{editFieldConstants.OPEN_URL}</ListItemText>
                            </MenuItem>
                        ) : null}
                        <MenuItem
                            onClick={() => {
                                setEditText(true);
                                setAnchor(null);
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon
                                    fontSize="small"
                                    htmlColor={theme.background.menuButton}
                                />
                            </ListItemIcon>
                            <ListItemText>{editFieldConstants.EDIT}</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                onDelete?.(index);
                                setAnchor(null);
                            }}
                        >
                            <ListItemIcon>
                                <Delete fontSize="small" htmlColor={theme.background.menuButton} />
                            </ListItemIcon>
                            <ListItemText>{editFieldConstants.DELETE}</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Stack>
        </React.Fragment>
    );
};

export default React.memo(EditableTextField);
