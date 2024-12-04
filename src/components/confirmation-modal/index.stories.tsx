import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Stack, Box, Typography, Button, TextField } from "@mui/material";
import { ReactComponent as Question } from "../../assets/icons/question.svg";
import AppTheme from "../../styles/theme";
import { CONFIRMATION_VARIANT } from "../../styles/common-constant";
import { ReactComponent as Triangle } from "../../assets/icons/warning-triangle.svg";
import { ReactComponent as Square } from "../../assets/icons/square-info.svg";
interface IConfirmationModal {
  text?: String;
  isInput?: boolean;
  variant?: String;
  actionText?: any;
  cancelText?:any;
}
const ConfirmationModal = ({ text,
  variant,
  isInput,
  actionText,
  cancelText}: IConfirmationModal)=>{

  const getIcon = () => {
    switch (variant) {
        case CONFIRMATION_VARIANT.CREATION:
            return <Question />;
        case CONFIRMATION_VARIANT.DELETION:
            return <Triangle />;
        default:
            return <Square />;
    }
};
const getBackgroundColor = () => {
    switch (variant) {
        case CONFIRMATION_VARIANT.CREATION:
            return AppTheme.palette.info.main;
        case CONFIRMATION_VARIANT.DELETION:
            return AppTheme.text.error;
        default:
            return AppTheme.text.info;
    }
};
  return <Stack alignItems="center" justifyContent="center" p="1rem">
  {getIcon()}
  <Typography variant="text_18_regular" textAlign="center">
      {text}
  </Typography>
  {isInput && (
      <Box mt="20px">
          <TextField variant="outlined"  />
      </Box>
  )}
  <Stack
      direction="row"
      justifyContent="space-between"
      spacing={8}
      mt="20px"
  >
      <Button
          variant="contained"
          sx={{
              minWidth: "73px",
              padding: "12px 15px",
              backgroundColor: "#EEEEEE",
              color: "#000000",
          }}
      >
          <Typography variant="text_16_semibold" textAlign="center">
              Cancel
          </Typography>
      </Button>
      <Button
          variant="contained"
          sx={{
              minWidth: "73px",
              padding: "12px 15px",
              backgroundColor: getBackgroundColor(),
          }}
      >
          <Typography variant="text_16_semibold" textAlign="center">
              {actionText ? actionText : "Procced"}
          </Typography>
      </Button>
  </Stack>
</Stack>
}
export default {
    title: ' Warning Confirmation',
    component: ConfirmationModal,
  } as ComponentMeta<typeof ConfirmationModal>;

  const Template: ComponentStory<typeof ConfirmationModal> = (args) =>{

  return <ConfirmationModal {...args}/>};

  export const Deletion1 = Template.bind({});
  export const Deletion2 = Template.bind({});
  export const Creation = Template.bind({});
  export const CreationLayout = Template.bind({});
  export const Normal = Template.bind({});
  export const NormalLayout = Template.bind({});
  
  Deletion1.args = {
    text:"Are you sure, you want to archived this project?",
    variant:"deletion",
    actionText:"yes"
  };
  Deletion2.args = {
    text:"Are you sure, you want to archived this project?",
    variant:"deletion",
    isInput:true,
    actionText:"yes"
  };

  Creation.args = {
    text:"Are you sure, you want to archived this project?",
    variant:"creation",
    actionText:"yes"
  };
  CreationLayout.args = {
    text:"Are you sure, you want to archived this project?",
    variant:"creation",
    actionText:"yes",
    isInput:true,
  };

  Normal.args = {
    text:"Are you sure, you want to archived this project?",
  
  }; 
  NormalLayout.args = {
    text:"Are you sure, you want to archived this project?",
    isInput:true,
  };
