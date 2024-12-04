import { ComponentMeta, ComponentStory } from '@storybook/react';
import SummaryCard from '.';
import { ReactComponent as WonBid } from '../../../assets/icons/awarded-bid.svg';
import { ReactComponent as OpenBid } from '../../../assets/icons/open-bid.svg';
import { ReactComponent as SubmittedBid } from '../../../assets/icons/submitted-bid.svg';
import { ReactComponent as Thunder } from '../../../assets/icons/thunder.svg';


export default {
    title: 'Cards/Bidding Status Card',
    component: SummaryCard,
    argTypes: {
    },
} as ComponentMeta<typeof SummaryCard>;

const Template: ComponentStory<typeof SummaryCard> = (args) => <SummaryCard {...args} />;

export const OrangeSummaryCard = Template.bind({});

OrangeSummaryCard.args = {
    count: 1,
    subtitle: 'New Bid Opportunity',
    iconPath: <Thunder />,
    cardProps: {
        sx: {
            width: "12.688rem",
            height: "6.438rem",
            backgroundColor: "orange"
        },

    }
}



export const BlueSummaryCard = Template.bind({});

BlueSummaryCard.args = {
    count: 3,
    subtitle: 'Open Bids',
    iconPath: <OpenBid />,
    cardProps: {
        sx: {
            width: "12.688rem",
            height: "6.438rem",
            backgroundColor: "#004D71",
            color: "white"
        },

    }
}


export const VioletSummaryCard = Template.bind({});

VioletSummaryCard.args = {
    count: 11,
    subtitle: 'Won(closed) Bids',
    iconPath: <WonBid />,
    cardProps: {
        sx: {
            width: "12.688rem",
            height: "6.438rem",
            backgroundColor: "#B196DE"
            , color: "white"
        },

    }
}


export const GreenSummaryCard = Template.bind({});

GreenSummaryCard.args = {
    count: 5,
    subtitle: 'Submitted bids',
    iconPath: <SubmittedBid />,
    cardProps: {
        sx: {
            width: "12.688rem",
            height: "6.438rem",
            backgroundColor: "#57B6B2"
        },

    }
}