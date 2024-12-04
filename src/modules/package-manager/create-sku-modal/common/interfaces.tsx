import { AnyAction } from "@reduxjs/toolkit";
import React, { Dispatch } from "react";
import { ICreateSKUState, IErrors } from "../../interfaces";

export interface IHelperProps {
    inputErrors: IErrors;
    inputs: ICreateSKUState;
    setInputs: React.Dispatch<React.SetStateAction<ICreateSKUState>>;
    setInputErrors: React.Dispatch<React.SetStateAction<IErrors>>;
    setLink: React.Dispatch<React.SetStateAction<string>>;
    dispatch: Dispatch<AnyAction>;
    setCreateSKUModal: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: Function;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    setNoOfSubCats: React.Dispatch<React.SetStateAction<number>>;
    version?: string;
}
