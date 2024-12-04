import React from "react";
import { isEmpty } from "lodash";
import { ViewMode, Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { getTasksFromUnits } from "./helper";
import ViewSwitcher from "./view-switcher";

interface IUnitGantt {
    units: any;
}
const UnitGantt = (props: IUnitGantt) => {
    const { units } = props;
    const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
    let columnWidth = 65;
    if (view === ViewMode.Year) {
        columnWidth = 350;
    } else if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    const tasks = getTasksFromUnits(units);

    // useEffect(() => {
    //     Promise.all(
    //         units.map((unit: any) => {
    //             return unitsActions.fetchRenoScopes(unit.id);
    //         }),
    //     ).then((res: any) => {
    //         console.debug("----", res);
    //     });
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <>
            {!isEmpty(units) && !isEmpty(tasks) && (
                <>
                    <Gantt
                        tasks={tasks}
                        viewMode={view}
                        // onDateChange={handleTaskChange}
                        // onDelete={handleTaskDelete}
                        // onProgressChange={handleProgressChange}
                        // onDoubleClick={handleDblClick}
                        // onClick={handleClick}
                        // onSelect={handleSelect}
                        // onExpanderClick={handleExpanderClick}
                        columnWidth={columnWidth}
                    />
                    <ViewSwitcher onViewModeChange={(viewMode) => setView(viewMode)} />
                </>
            )}
        </>
    );
};

export default UnitGantt;
