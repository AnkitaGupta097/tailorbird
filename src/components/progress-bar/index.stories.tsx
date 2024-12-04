import { ComponentMeta, ComponentStory } from "@storybook/react";
import BaseProgressBar from ".";
import { ThemeProvider } from "@mui/material";
import theme from "styles/theme";

export default {
    title: 'Progress Bar',
    component: BaseProgressBar,
    decorators: [(Story) => (<ThemeProvider theme={theme}><Story /></ThemeProvider>)]
} as ComponentMeta<typeof BaseProgressBar>;

const ProgressBarTemplate: ComponentStory<typeof BaseProgressBar> = (args) => <BaseProgressBar {...args} />

export const progressBar = ProgressBarTemplate.bind({})

export const progressBarWithText = ProgressBarTemplate.bind({})

progressBar.args = {
    value: 25,
}

progressBarWithText.args = {
    value: 25,
    label: "Bidbook Exported 25%",
}



