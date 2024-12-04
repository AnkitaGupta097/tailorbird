import {
    IconButton,
    InputAdornment,
    OutlinedInputProps,
    SxProps,
    TextField,
    Theme,
    SvgIcon,
} from "@mui/material";
// import BaseTextField from "components/text-field";
import React from "react";

const SearchIcon = ({ stroke }: { stroke: string }) => {
    return (
        <SvgIcon>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z"
                    stroke={stroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </SvgIcon>
    );
};
interface ISearch {
    open: boolean;
    //eslint-disable-next-line no-unused-vars
    onSearch?: (value: string) => void | Function;
    onClick: Function;
    onClose: Function;
    placeholder?: string;
    fullWidth?: boolean;
    size?: "medium" | "small";
    textFieldSx?: SxProps<Theme> | undefined;
    InputProps?: Partial<OutlinedInputProps>;
    focused?: boolean;
}

const SearchField: React.FC<ISearch> = ({
    open,
    onSearch,
    onClick,
    onClose,
    placeholder,
    fullWidth,
    size,
    textFieldSx,
    InputProps,
    focused,
}) => {
    return (
        <>
            {open ? (
                <TextField
                    focused={focused}
                    size={size}
                    variant="outlined"
                    fullWidth={fullWidth}
                    sx={textFieldSx}
                    placeholder={placeholder}
                    onChange={function (
                        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                    ) {
                        onSearch?.(event.target.value);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon stroke="#00344D" />
                            </InputAdornment>
                        ),
                        ...InputProps,
                    }}
                    onBlur={function () {
                        onClose?.();
                    }}
                />
            ) : (
                <IconButton
                    onClick={function () {
                        onClick?.();
                    }}
                >
                    <SearchIcon stroke="#757575" />
                </IconButton>
            )}
        </>
    );
};

export default SearchField;
