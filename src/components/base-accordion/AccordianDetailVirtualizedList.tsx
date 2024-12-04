import { SxProps, Typography, TypographyPropsVariantOverrides } from "@mui/material";
import React, { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { OverridableStringUnion } from "@mui/types";
import { Variant } from "@mui/material/styles/createTypography";
import { VariableSizeList as List } from "react-window";

interface IAccordionDetailVirtualizedList {
    detailsStyling?: SxProps;
    detailsVariant?: OverridableStringUnion<"inherit" | Variant, TypographyPropsVariantOverrides>;
    components: ReactElement<any>[] | string[];
}

const AccordianDetailVirtualizedList: React.FC<IAccordionDetailVirtualizedList> = ({
    detailsStyling,
    detailsVariant,
    components,
}) => {
    const listRef: any = useRef(null);
    const sizeMap: any = useRef({});
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const setSize = useCallback((index: number, size: number) => {
        sizeMap.current = { ...sizeMap.current, [index]: size };
        listRef?.current?.resetAfterIndex(index);
    }, []);
    const getSize = (index: number) => sizeMap.current[index] || 50;

    useEffect(() => {
        let totalItemsHeight = 0;
        Object.keys(sizeMap?.current || {})?.forEach((key) => {
            totalItemsHeight = totalItemsHeight + sizeMap.current?.[key];
        });
        setContainerHeight(Math.min(window.innerHeight, totalItemsHeight));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sizeMap?.current]);

    return (
        <List
            ref={listRef}
            height={containerHeight}
            width="100%"
            itemCount={components.length}
            itemSize={getSize}
            itemData={components}
        >
            {({ data, index, style }) => (
                <div style={style}>
                    <Row
                        data={data}
                        index={index}
                        setSize={setSize}
                        detailsVariant={detailsVariant}
                        detailsStyling={detailsStyling}
                    />
                </div>
            )}
        </List>
    );
};

interface IBaseAccordionRow {
    data: Array<ReactNode>;
    index: number;
    // eslint-disable-next-line no-unused-vars
    setSize: (arg1: number, arg2: number) => void;
    detailsVariant?: OverridableStringUnion<"inherit" | Variant, TypographyPropsVariantOverrides>;
    detailsStyling?: SxProps;
}

const Row = ({ data, index, setSize, detailsVariant, detailsStyling }: IBaseAccordionRow) => {
    const rowRef: any = useRef<HTMLDivElement>(null);

    React.useEffect(
        () => {
            const resizeObserver = new ResizeObserver((entries) => {
                const entryObject = entries[0];
                setSize(index, entryObject?.contentRect?.height);
            });

            // Start observing the target element (the div)
            resizeObserver.observe(rowRef.current);

            setSize(index, rowRef?.current?.getBoundingClientRect()?.height);

            // Cleanup the observer on component unmount
            return () => {
                resizeObserver.disconnect();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <div ref={rowRef}>
            <Typography
                key={index}
                variant={detailsVariant}
                sx={{
                    ...detailsStyling,
                    ...(typeof data[index] === "string" && {
                        display: "block",
                        wordWrap: "break-word",
                    }),
                }}
            >
                {data[index]}
            </Typography>
        </div>
    );
};

export default AccordianDetailVirtualizedList;
