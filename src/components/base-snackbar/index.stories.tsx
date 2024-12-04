import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseSnackbar  from '.';
import { Box } from "@mui/material";
import {SNACKBAR_VARIANT} from '../../styles/common-constant'
import AppTheme from "../../styles/theme"

export default {
    title: 'Alert',
    component: BaseSnackbar,
  } as ComponentMeta<typeof BaseSnackbar>;

  const Template: ComponentStory<typeof BaseSnackbar> = (args) =>{
    const getBackgroundColor = (variant:string) => {
      switch (variant) {
          case SNACKBAR_VARIANT.ERROR:
              return AppTheme.background.error;
          case SNACKBAR_VARIANT.INFO:
              return AppTheme.background.info;
          case SNACKBAR_VARIANT.SUCCESS:
              return AppTheme.background.success;
          case SNACKBAR_VARIANT.WARNING:
              return AppTheme.background.warning;
          default:
              true;
      }
  };
  return<Box  sx={{
    width: "20rem",
    padding: "0px 16px",
    borderRadius: "5px",backgroundColor: getBackgroundColor(args.variant),
    margin: "0px",
}}> <BaseSnackbar {...args} /></Box>};

  export const PreviewInfo = Template.bind({});
  export const PreviewWarning = Template.bind({});
  export const PreviewError = Template.bind({});
  export const PreviewSuccess = Template.bind({});
  
  PreviewInfo.args = {
    title:"Title",
    description:"Here is your message",
    variant:"info",
  };

  PreviewWarning.args = {
    title:"Title",
    description:"Here is your message",
    variant:"warning",
  };

  PreviewError.args = {
    title:"Title",
    description:"Here is your message",
    variant:"error",
  };

  PreviewSuccess.args = {
    title:"Title",
    description:"Here is your message",
    variant:"success",
  };