import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AutoComplete from '.';
import { Stack, Avatar, Typography } from '@mui/material';
import BaseChip from 'components/chip';

export default {
    title: 'AutoComplete',
    component: AutoComplete,
    argTypes: {
    },
  } as ComponentMeta<typeof AutoComplete>;

  const Template: ComponentStory<typeof AutoComplete> = (args) => <AutoComplete {...args}/>;

  export const DefaultAutoComplete = Template.bind({});

  export const InviteUserAutoComplete = Template.bind({});

  const users = [
    {
        name: "Pankaj Sahini",
        email: "pankaj@campconstructions.com",
    },
    {
        name: "Rohan Nanavati",
        email: "rohan@campconstructions.com",
    },
    {
        name: "Cam Bruckman",
        email: "cam@campconstructions.com",
    },
];

const stringAvatar = (name: string) => {
    return {
        sx: {
            bgcolor: "#410099",
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
};

  DefaultAutoComplete.args = {
    options: ["Appliances", "Kitchen", "Bath", "Blinds"],
    multiple: true,
    placeholder: "Add User"
  }

  InviteUserAutoComplete.args = {
    options: users,
    multiple: true,
    placeholder: "Add User",
    getOptionLabel:(option: { name: any; }) => option.name,
    renderOption: (props: any, option: any) => (
        <Stack
            key={option.email}
            direction="row"
            spacing={2}
            marginBottom="15px"
            component="li"
            {...props}
        >
            <Avatar {...stringAvatar(option.name)} />
            <Stack>
                <Typography variant="text_14_semibold">{option.name}</Typography>
                <Typography variant="text_12_regular">{option.email}</Typography>
            </Stack>
        </Stack>
    ),
    renderTags:(tagValue: any, getTagProps: any) =>
        tagValue.map((option: any, index: any) => (
            // eslint-disable-next-line
            <BaseChip
                avatar={
                    <Avatar sx={{ backgroundColor: "#FFFFFF" }}>
                        {option.name.split(" ")[0][0]}
                    </Avatar>
                }
                bgcolor={"#004D71"}
                textColor={"#FFFFFF"}
                variant="filled"
                label={option.email}
                sx={{
                    ".MuiChip-deleteIcon": {
                        color: "#FFFFFF",
                    },
                }}
                {...getTagProps({ index })}
            />
        ))
  }