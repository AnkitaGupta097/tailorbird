import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DetailsCard from '.';
import AddIcon from '@mui/icons-material/Add';


export default {
    title: 'Cards/Details Card',
    component: DetailsCard,
    argTypes: {
    },
} as ComponentMeta<typeof DetailsCard>;

const Template: ComponentStory<typeof DetailsCard> = (args) => <DetailsCard {...args} />;


export const ReviewCard = Template.bind({})

ReviewCard.args = {
    leftBorderColor : "#FFAB00",
    propertyName  :"Property Name",
    propertyAddress : "NYC",
    organization : "Demo Org",
    showProgress : true,
    progress: 50,
    progressText : "Bid completed 50%", 
    chipLabel : "Bid Due 00/00/00",
    chipBgColor : "#004D71",
    chipLabelColor : "#FFFFFF"
    ,
    cardProps:{
        sx:{
            maxWidth:"57rem"
        }
    }
}