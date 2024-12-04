import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import FileUpload  from '.';

export default {
    title: 'File-Upload',
    component: FileUpload,
  } as ComponentMeta<typeof FileUpload>;

  const Template: ComponentStory<typeof FileUpload> = (args) => <FileUpload {...args} />;

  export const PreviewUI = Template.bind({});
  
  PreviewUI.args = {
    helperText:"Upload only CSV / XLSX file*",
    onFileChange:()=>""
};