import React from "react";
import BaseAutoComplete from "../base-auto-complete";

interface IRenderTableCellProps {
    value: string | number | boolean;
    showImage?: boolean;
    isAutoComplete?: boolean;
    options?: any[];
    id?: number;
    onChangeHandler?: Function;
    name?: string;
}

export const RenderTableCell = ({
    value,
    showImage,
    isAutoComplete,
    options,
    id,
    onChangeHandler,
    name,
}: IRenderTableCellProps) => {
    return (
        <div>
            {isAutoComplete ? (
                <BaseAutoComplete
                    value={value === "" || value === null ? "N/A" : value}
                    options={options}
                    onChangeHandler={onChangeHandler}
                    id={id}
                    name={name}
                    variant="standard"
                />
            ) : showImage ? (
                <img
                    //@ts-ignore
                    src={value ?? `${process.env.PUBLIC_URL}/image-placeholder.png`}
                    style={{
                        height: "3rem",
                        width: "3rem",
                        display: "block",
                        border: `0.5px solid black`,
                    }}
                    alt="productImage"
                />
            ) : (
                value
            )}
        </div>
    );
};
