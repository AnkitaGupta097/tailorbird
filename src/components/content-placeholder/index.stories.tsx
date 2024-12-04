import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ContentPlaceholder  from '.';

export default {
    title: 'Content - Placeholder',
    component: ContentPlaceholder,
  } as ComponentMeta<typeof ContentPlaceholder>;

  const Template: ComponentStory<typeof ContentPlaceholder> = (args) => <ContentPlaceholder {...args} />;

  export const PreviewUI = Template.bind({});
  
  PreviewUI.args = {
  text:"No projects created.",
  aText:"Create a project.",
  onLinkClick:()=>console.log("Content - Placeholder"),
};