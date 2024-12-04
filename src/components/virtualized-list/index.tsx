import { Grid } from "@mui/material";
import React, { ReactElement, ReactNode, useCallback, useRef } from "react";
import { VariableSizeList as List } from "react-window";

interface IVirtualizedList {
    components: ReactElement<any>[] | string[];
    fixedContainerHeight?: number;
    gap: number;
}

const VirtualizedList: React.FC<IVirtualizedList> = ({ components, fixedContainerHeight, gap }) => {
    const listRef: any = useRef(null);
    const sizeMap: any = useRef({});

    const setSize = useCallback((index: number, size: number) => {
        if (index == 0) {
            sizeMap.current = {};
        }
        sizeMap.current = { ...sizeMap.current, [index]: size };

        listRef?.current?.resetAfterIndex(index);
    }, []);

    const getSize = (index: number) => {
        return (sizeMap.current[index] || 50) + gap * 4;
    };

    return (
        <List
            ref={listRef}
            height={fixedContainerHeight as number}
            width="100%"
            itemCount={components.length}
            itemSize={getSize}
            itemData={components}
            style={{ display: "flex", flexDirection: "column" }}
        >
            {({ data, index, style }) => (
                <Grid item style={style} marginBottom={gap}>
                    <Row data={data} index={index} setSize={setSize} />
                </Grid>
            )}
        </List>
    );
};

interface IRow {
    data: Array<ReactNode>;
    index: number;
    // eslint-disable-next-line no-unused-vars
    setSize: (arg1: number, arg2: number) => void;
}

const Row = ({ data, index, setSize }: IRow) => {
    const rowRef: any = useRef<HTMLDivElement>(null);

    React.useEffect(
        () => {
            setSize(index, rowRef.current?.getBoundingClientRect().height);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return <div ref={rowRef}>{data[index]}</div>;
};

export default VirtualizedList;
