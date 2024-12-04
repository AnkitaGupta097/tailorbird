import { SxProps } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import React from "react";

export interface ISearchFilterProps {
    isLabor?: boolean;
    showProgress?: boolean;
    category?: Array<string>;
    subcategory?: Array<string>;
    finish?: Array<string>;
    style?: Array<string>;
    grade?: Array<string>;
    supplier?: Array<string>;
    ownership?: Array<string>;
    package?: Array<string>;
    onChange: Function;
    onSearch: Function;
}
export interface IPackageSelection {
    showDialog: boolean;
    newPackageMaterialsData: Array<IMaterialPackage | ILabor>;
    filtersData: any;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    setNewPackageMaterialsData: React.Dispatch<
        React.SetStateAction<Array<IMaterialPackage | ILabor>>
    >;
}

export interface Organization {
    id: String;
    name: String;
    email: String;
    address: String;
    createdBy: String;
}
export interface BackNavigationBarProps {
    projectId: string;
    onClick: Function;
    projectName: string;
    onRadioToggle: () => void;
    radioState: boolean;
    handleCopySKUs: Function;
    showSave?: boolean;
    showRemove?: boolean;
    showCopySelected?: boolean;
    handleSave: Function;
    handleRemove: Function;
    isAlt?: string;
}

export interface ILabor {
    description: string;
    uom: string;
    ref_price: string;
    date_created: string;
    date_updated: string;
    category: string;
    subcategory: string;
    labor_id: string;
    package_id: string;
    selected: boolean;
    material_id?: string;
    is_editable?: boolean;
    rel_pacakge_id?: string;
}

export interface IMaterialPackage extends IMaterial {
    selected: boolean;
    is_editable: boolean;
    labor_id?: string;
}

export interface IProjectPackage {
    projectId: string;
    packageId: string;
    projectName: string;
    isAlt?: string;
    containerVersion?: string;
}

export interface IB2BProjectPackageV2 {
    projectId: string;
}
export interface ISubcategoryPair {
    subcategory: string;
    category: string;
}
export interface IAddNewSKUModalV2Props {
    open: boolean;
    subcategoryPairs: Array<ISubcategoryPair>;
    allSubCategories: Array<string>;
    setCreateSKUModal: React.Dispatch<React.SetStateAction<boolean>>;
    setPackageSelectionExpand: React.Dispatch<React.SetStateAction<boolean>>;
    setPackageDataExpand: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: Function;
    version?: string;
}

export interface ISKULinkInputComponent {
    dataFromLink: any;
    validation: {
        error: boolean;
        errorMsg: string;
    };
    link: string;
    setLink: React.Dispatch<React.SetStateAction<string>>;
    handleLinkSubmit: () => Promise<void>;
    setInputs: React.Dispatch<React.SetStateAction<ICreateSKUState>>;
}

export interface IErrors {
    Subcategory: { error: Array<boolean>; errMsg: string };
    Category: { error: Array<boolean>; errMsg: string };
    UOM: { error: boolean; errMsg: string };
    Description: { error: Array<boolean>; errMsg: string };
}
export interface IAccordion {
    expanded: boolean;
    setExpanded: any;
    component: any;
    styles?: any;
    title: string;
}

export interface IPackageSpaceProps {
    originalCount?: number;
    skuRows: Array<IMaterialPackage | ILabor>;
    onSelectionChange: Function;
    onAllRowsSelection: Function;
    style?: any;
    setPackageSelectedCount?: React.Dispatch<React.SetStateAction<number>>;
    isSelection: boolean;
    onSupplierChange?: Function;
}

export interface IPackageFilterProps {
    skuRows: Array<IMaterialPackage | ILabor>;
    category: Array<any>;
    selectedCategory: string;
    onClick?: Function;
    subcategory?: any;
}

export interface ICreateSKUState {
    Manufacturer: string;
    ModelNumber: string;
    Supplier: string;
    ItemNumber: string;
    Subcategory: Array<string>;
    Category: Array<string>;
    UOM: string;
    Style: string;
    Finish: string;
    Grade: string;
    Description: Array<string>;
    primary_thumbnail?: string;
}

export interface LabelTextFieldProps {
    label: string;
    textFieldProps?: TextFieldProps;
    dropDownMenu?: React.ReactNode;
    dropDownTextField?: React.ReactNode;
    variant?: any;
    className?: any;
    textFieldClass?: any;
    helperText?: string;
    error?: boolean;
    required?: boolean;
    rows?: number;
    multiline?: boolean;
    disabled?: boolean;
    labelStyle?: object;
}

export interface ISavePackageModal {
    isOpen: boolean;
    onClose: Function;
    onFailed?: Function;
    isEditMode: boolean;
    extraMetadata: object;
    askOwnershipGroup: boolean;
    onSave?: Function;
    metadata?: any;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    isScraper?: boolean;
}

export interface IOwnership {
    disabled?: boolean;
    options?: IOrg[];
    setState?: Function;
    inputErrors?: any;
    placeholder?: string;
    value?: IOrg | null;
    helperText?: string | boolean;
    error?: boolean;
    refetchOrgFunc?: any;
    loading?: boolean;
    autocompleteSx?: SxProps;
    size?: "small" | "medium";
    org_type?: "OPERATOR";
    filterOrgs?: boolean;
    exceptContractors?: boolean | false;
}

export interface IOrg {
    id?: string;
    name: string;
    email?: string;
    address?: string;
    created_by?: string;
    contact_number?: string;
    is_deleted?: boolean;
    label?: string;
}

export interface ISupplier {
    supplier_id: string;
    supplier?: string;
    sku_id?: string;
    is_adhoc?: string;
    ref_price?: number;
    uom?: string;
    url?: string;
    primary_thumbnail?: string;
    created_by?: string;
    created_at?: string;
    updated_by?: string;
    updated_at?: string;
}

export interface IMaterial {
    rel_pacakge_id?: string;
    suppliers?: Array<ISupplier> | null;
    supplier_index?: number | null;
    material_id: string;
    manufacturer?: string;
    model_id?: string;
    is_adhoc?: boolean;
    high_price?: number;
    low_price?: number;
    cost_code?: string;
    style?: string;
    grade?: string;
    finish?: string;
    url?: string;
    primary_thumbnail?: string;
    created_by?: string;
    created_at?: string;
    updated_by?: string;
    updated_at?: string;
    description: string;
    uom: string;
    ref_price: string;
    date_created: string;
    date_updated: string;
    category: string;
    subcategory: string;
    package_id: string;
}

export interface IPackageDataProps {
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    setMaterialsData: React.Dispatch<React.SetStateAction<any>>;
    skuRows?: any;
    materialsData?: any;
}

export interface ISearchBar {
    setSearchText: React.Dispatch<React.SetStateAction<string | null>>;
    showStandardPkgDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IAttrs {
    name: string | undefined;
    description: string | undefined;
}

export interface IPackages {
    package_id: string;
    msa: string;
    name: string;
    description: string;
    category: string;
    type: string;
    style: string;
    finish: string;
    ownership_group_id: string;
    ownership_group_name: string;
    created_by: string;
    date_created: string;
    date_updated: string;
    supplier: string;
    project_id?: string;
    scraper_job_id?: string;
    package_type: "alt" | "base" | "scraper" | "standard" | string;
    alt_package_id?: string;
    base_package_id?: string;
    upload_template_url?: string;
}

export interface IPackagesTable {
    packages: Array<IPackages>;
    onSave?: Function;
    searchText?: any;
}

export interface IPkgDetailDialog {
    pkg?: IPackages;
    open: boolean;
    //eslint-disable-next-line
    onClose: (val: boolean) => void;
    onSave?: Function;
}

export interface IDialogContent {
    pkg?: IPackages;
    onClose: Function;
    onSave?: Function;
}
export interface pkgColumns {
    id: string;
    minWidth?: string;
    label: string;
    align: string;
    width?: string;
}

export interface ICreateStandardPkgDialog {
    open: boolean;
    onClose: () => void;
    onSave?: Function;
}

export interface IContent {
    onClose?: Function;
    onSave?: Function;
}
export interface IDataState {
    name: string;
    ownership: IOrg | null;
    description: string;
    version: { label: string; value: string };
}

export interface ISubCategoryTile {
    subcategoryPairs: Array<ISubcategoryPair>;
    index: number;
    inputs: any;
    options: Array<any>;
    setInputs: any;
    inputErrors: IErrors;
    onDelete: Function;
}
