import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AppContainer from '.';

export default {
    title: 'AppContainer',
    component: AppContainer,
    argTypes: {
    },
  } as ComponentMeta<typeof AppContainer>;


const Template: ComponentStory<typeof AppContainer> = (args) => <AppContainer {...args} />;

export const AppContainerWithTitle = Template.bind({});
export const AppContainerWithTabs = Template.bind({});

AppContainerWithTitle.args = {
    title: "Projects"
}

AppContainerWithTabs.args = {
    title: "Projects",
    currentTab: "/active",
    tabChanged: () => {},
    tabList: [{
        label: "Active",
        value: "/active",
    },]
}