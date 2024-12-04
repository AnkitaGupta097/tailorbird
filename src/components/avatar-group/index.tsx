import React from "react";
import { Avatar, AvatarGroup as MuiAvatarGroup, AvatarGroupProps, Typography } from "@mui/material";

interface IAvatarGroupProps extends AvatarGroupProps {
    names?: string[];
    size?: number;
}

const AvatarGroup = ({ names, size }: IAvatarGroupProps) => {
    const stringToColor = (string: string) => {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    };

    const stringAvatar = (name: string) => {
        const [firstName, lastName] = name.split(" ");
        return {
            sx: {
                bgcolor: stringToColor(name),
                height: size,
                width: size,
            },
            children: (
                <Typography variant="text_14_bold">
                    {`${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`}
                </Typography>
            ),
        };
    };

    return (
        <MuiAvatarGroup
            max={3}
            slotProps={{
                additionalAvatar: {
                    sx: { width: size, height: size, fontSize: 14, fontWeight: 700 },
                },
            }}
        >
            {names?.map((name: string, index: number) => (
                <Avatar key={index} {...stringAvatar(name)} />
            ))}
        </MuiAvatarGroup>
    );
};

export default AvatarGroup;
