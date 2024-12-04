import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import UploadModal from "./upload-modal";
import { PHASE_TYPE } from "modules/properties/constant";

interface IProps {
    take_off_type: string;
    disabled?: boolean;
    // eslint-disable-next-line no-unused-vars
    setDisabled: (val: boolean) => void;
}

export default function TakeOffUploadButton({ take_off_type, disabled, setDisabled }: IProps) {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState(PHASE_TYPE[0].value);
    return (
        <Box>
            <Button
                disabled={disabled}
                variant="outlined"
                style={{ height: "100%" }}
                onClick={() => setOpen(true)}
            >
                {`Upload`}
            </Button>
            <UploadModal
                open={open}
                phase={phase}
                take_off_type={take_off_type}
                setPhase={setPhase}
                setDisabled={setDisabled}
                onClose={() => setOpen(false)}
            />
        </Box>
    );
}
