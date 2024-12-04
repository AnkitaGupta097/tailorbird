import { ComponentStory, ComponentMeta } from "@storybook/react";
import ColumnFilters from ".";
import { ThemeProvider } from "@mui/material";
import theme from "styles/theme";
export default {
    title: "Column Filters for Bid Levelling",
    component: ColumnFilters,
    decorators: [(Story) => <ThemeProvider theme={theme}><Story /></ThemeProvider>]
} as ComponentMeta<typeof ColumnFilters>;


const Template: ComponentStory<typeof ColumnFilters> = (args) => <ColumnFilters {...args} />


export const closed = Template.bind({});
closed.args = {
    expanded: false,
    setExpanded: () => console.log("calling expanded"),
    areFiltersApplied: true,
    floorplans: [
        { fp_name: "floorplanA", bed_bath_count: "1 Bedroom X 0 Bath" },
        { fp_name: "floorplanB", bed_bath_count: "1 Bedroom X 0 Bath" },
        { fp_name: "floorplanC", bed_bath_count: "1 Bedroom X 1 Bath" },
    ],
    inventories: ["Inventory 1", "Inventory 2"],
    contractors: ["Contractor1", "Contractor2"],
    selectedFloorplans: [],
    selectedInventories: [],
    selectedContractors: [],
    showInventory: false,
    showFloorplan: false,
}
