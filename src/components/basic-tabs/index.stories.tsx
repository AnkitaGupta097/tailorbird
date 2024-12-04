import { ComponentMeta, ComponentStory } from "@storybook/react";
import BasicTabs from ".";

export default {
    title: "Base Tabs",
    component: BasicTabs,
    argTypes: {},
} as ComponentMeta<typeof BasicTabs>;

const Template: ComponentStory<typeof BasicTabs> = (args) => <BasicTabs {...args} />;

export const Tabs = Template.bind({});

Tabs.args = {
    tabs: [
        { label: "Floor Plan [00]", content: <>Desc for FP00</> },
        { label: "Floor Plan [01]", content: <>Desc for FP01</> },
        { label: "Floor Plan [02]", content: <>Desc for FP02</> },
        { label: "Floor Plan [03]", content: <>Desc for FP03</> },
        { label: "Floor Plan [04]", content: <>Desc for FP04</> },
        { label: "Floor Plan [05]", content: <>Desc for FP05</> },
        { label: "Floor Plan [06]", content: <>Desc for FP06</> },
        { label: "Floor Plan [07]", content: <>Desc for FP07</> },
        { label: "Floor Plan [08]", content: <>Desc for FP08</> },
        { label: "Floor Plan [09]", content: <>Desc for FP09</> },
        { label: "Floor Plan [10]", content: <>Desc for FP10</> },
        { label: "Floor Plan [11]", content: <>Desc for FP11</> },
        { label: "Floor Plan [12]", content: <>Desc for FP12</> },
        { label: "Floor Plan [13]", content: <>Desc for FP13</> },
        { label: "Floor Plan [14]", content: <>Desc for FP14</> },
    ],
};
