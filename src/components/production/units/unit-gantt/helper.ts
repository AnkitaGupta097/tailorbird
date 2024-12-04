import { compact } from "lodash";
import { Task } from "gantt-task-react";

const convertUnitToTask = (unit: any) => {
    const { total_work, completed_work } = unit?.unit_stats ?? {};
    const progress =
        total_work && completed_work ? Math.ceil((completed_work / total_work) * 100) : 0;

    return unit.renovation_start_date && unit.renovation_end_date
        ? {
              start: unit.renovation_start_date && new Date(unit.renovation_start_date),
              end: unit.renovation_end_date && new Date(unit.renovation_end_date),
              name: unit.unit_name,
              id: unit.id,
              progress,
              type: "project",
          }
        : undefined;
};
export const getTasksFromUnits = (units: any): Task[] => {
    return compact(units.map((unit: any) => convertUnitToTask(unit)));
};
