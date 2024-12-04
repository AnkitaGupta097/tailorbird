import React, { useEffect, useState } from "react";
import ProjectDetail from "./project-details";
import CollapsibleSection from "components/collapsible-section";
import BaseAccordion from "components/base-accordion";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import ScrollToTop from "components/scroll-to-top";
import { Grid } from "@mui/material";
import ImageCarousel from "components/image-carousel";
import CommonDialog from "modules/admin-portal/common/dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import StatusIndicator from "../common/status-indicator";
import PriceSummaryTable from "../pricing-summary-table";
//@ts-ignore
import propertyImg from "../../../assets/icons/property-placeholder.jpg";
import { BIDS_STATUSES, ROUTES } from "../common/constants";
import { graphQLClient } from "utils/gql-client";
import {
    CONTAINER_CATEGORY_QUERY,
    ORGANIZATION_CONTAINER_CATEGORY_QUERY,
} from "components/container-admin-interface/constants";
import { GET_DESCRIPTIONS } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import FloorplanSummary from "../floorplan-summary";
import ScopeSummary from "../scope-summary";
import BasicTabs from "components/basic-tabs";
import { isEmpty } from "lodash";
import {
    getCategoryInScope,
    getSortedCategoryByContainer,
    getSortedCustomCategoryByContainer,
} from "../helper";

const ProjectDetailsV2 = () => {
    const { projectId, userID, role } = useParams();
    const search = useLocation().search;
    // Url contains org_id and version when tb admin accesses the contractor bidbook
    const userRole = localStorage.getItem("role");
    // Url contains org_id and version when tb admin accesses the contractor bidbook
    let org_id = new URLSearchParams(search).get("org_id");
    org_id = org_id
        ? org_id
        : userRole == "admin"
        ? localStorage.getItem("contractor_org_id")
        : localStorage.getItem("organization_id");
    let version = new URLSearchParams(search).get("version");
    version = version
        ? version
        : userRole == "admin"
        ? localStorage.getItem("version")
        : "undefined";
    localStorage.setItem("version", version ?? "undefined");
    let isLatest: any = new URLSearchParams(search).get("isLatest");
    isLatest = isLatest ? isLatest : userRole == "admin" ? localStorage.getItem("isLatest") : null;
    localStorage.setItem("isLatest", isLatest);
    isLatest =
        isLatest !== undefined
            ? isLatest?.trim()?.toLowerCase() === "true"
                ? true
                : false
            : undefined;
    const dispatch = useAppDispatch();
    const {
        project,
        imageFiles,
        loadingRfpProject,
        loadingFiles,
        allUsers,
        loadingBid,
        projects,
        bidResponse,
        baseScope,
        altScope,
        flooringScope,
        bidRequest,
        floorplans,
        selectedVersion,
        isEditable,
        singleProject,
        categories,
    } = useAppSelector((state) => ({
        project: state?.projectDetails?.data,
        imageFiles: state?.fileUtility?.imageFiles,
        loadingRfpProject: state.rfpService.project?.loadingProject,
        loadingFiles: state?.fileUtility?.loading,
        allUsers: state?.ims?.ims?.users,
        loadingBid: state.biddingPortal.loading,
        projects: state.rfpService.project.projectDetails,
        bidResponse: state.rfpService.project.bidResponse,
        baseScope: state.budgeting?.details?.baseScope?.renovations,
        altScope: state.budgeting?.details?.altScope?.renovations,
        flooringScope: state.budgeting?.details?.flooringScope?.renovations,
        categories: state.biddingPortal.categories,
        bidRequest: state.rfpService.project.bidRequest,
        floorplans: state.projectFloorplans.floorplans.data,
        selectedVersion: state.biddingPortal.selectedVersion,
        isEditable: state.biddingPortal.isEditable,
        groupedBidItems: state.biddingPortal.groupedBidItems,
        singleProject: state.singleProject.projectDetails,
    }));
    const [projectImageFiles, setProjectImageFiles] = useState<any[]>([]);
    const [projectCoverImageURL, setProjectCoverImageURL] = useState<string>();
    const [projectInfo, setProjectInfo] = useState<any>({});
    const [users, setUsers] = useState<any[]>([]);
    const [tbUser, setTbUser] = useState<{ name: string; email: string }>({ name: "", email: "" });
    const [projectDetails, setProjectDetails] = useState<(typeof projects)[0] | null>();
    const [bidResponseItem, setBidResponseItem] = React.useState<any[]>([]);
    const [bidRequestItem, setBidRequestItem] = React.useState<any[]>([]);
    // Url contains org_id and version when tb admin accesses the contractor bidbook
    const organization_id = !isEmpty(org_id)
        ? org_id ?? ""
        : localStorage.getItem("organization_id") ?? "";
    const [categoryData, setCategoryData] = useState<{ id: string; category: string }[]>([]);
    const [customCategoryData, setCustomCategoryData] = useState<Record<any, any>[]>([]);
    const [category, setCategoryInScope] = useState<any[]>([]);
    const [revisionRequest, setRevisionRequest] = React.useState<any[]>([]);
    const [acceptedRequest, setAcceptedRequest] = React.useState<any[]>([]);
    const [initialBidRequest, setInitialBidRequest] = React.useState<
        { id: string; reno_item_version: string }[]
    >([]);
    const [createBidItemsFailed, setCreateBidItemsFailed] = useState<boolean>(false);
    const [descriptions, setDescriptions] = useState<
        {
            resource_type: string;
            resource_id: string;
            description: string;
        }[]
    >([]);
    const navigate = useNavigate();
    // If Project has been declined or lost, we need to redirect to dashboard
    if (projectDetails?.bid_status === BIDS_STATUSES.DECLINED)
        navigate(ROUTES.PROJECTS_DASHBOARD(role!, userID!));

    const getScopeDescriptions = async () => {
        try {
            const response = await graphQLClient.query("getDescriptions", GET_DESCRIPTIONS, {
                project_id: projectId,
            });

            const descriptions = response?.getDescriptions?.map(
                (des: { description: any; resource_id: any; resource_type: any }) => {
                    return {
                        description: des.description,
                        resource_id: des.resource_id,
                        resource_type: des.resource_type,
                    };
                },
            );

            setDescriptions(descriptions);
        } catch (error) {
            console.error(error);
        }
    };

    const getDescriptionById = (id: string): string => {
        return descriptions?.length > 0
            ? descriptions.find(({ resource_id }: { resource_id: string }) => resource_id === id)
                  ?.description ?? "Further Details in Project Documents"
            : "Further Details in Project Documents";
    };

    const getCategoryData = async () => {
        const res = await graphQLClient.query("getCategoryData", CONTAINER_CATEGORY_QUERY);
        setCategoryData(res.getCategories);
    };

    //this funtion will fetch the custom categories for given organisationContainerId
    const getCustomCategoryData = async () => {
        const organisationContainerId = singleProject?.organisation_container_id;
        // const organisationContainerId = "582ef7a0564f45f1972bb69dc9fa4738";
        const res = await graphQLClient.query(
            "getOrganisationContainerGroups",
            ORGANIZATION_CONTAINER_CATEGORY_QUERY,
            { organisationContainerId },
        );
        setCustomCategoryData(res.getOrganisationContainerGroups);
    };

    useEffect(() => {
        const scopes = [
            ...baseScope.data,
            ...(altScope?.data ?? []),
            ...(flooringScope?.data ?? []),
        ];
        if (scopes?.length > 0) {
            scopes?.map((scope: { category: any }) => {
                if (!category?.some((item) => item?.name === scope?.category)) {
                    const index = categoryData?.findIndex(
                        (data) => data?.category === scope?.category,
                    );
                    //if scope category exist in container category only then push data
                    if (index !== -1) {
                        category?.push({
                            id: categoryData?.[index]?.id,
                            name: scope?.category,
                            isSelected: true,
                        });
                        setCategoryInScope(category);
                    }
                }
            });
            let categoriesInScope: string[] = [];
            if (categoryData?.length > 0 && category?.length > 0) {
                categoriesInScope = getCategoryInScope(categoryData, category, "name");
                if (singleProject?.organisation_container_id) {
                    getSortedCategoryByContainer(categoriesInScope, category, "name");
                } else {
                    getSortedCustomCategoryByContainer(categoriesInScope, customCategoryData);
                }

                setCategoryInScope(
                    category
                        .filter(
                            ({ name }) =>
                                categories?.includes(name) || categories?.includes(`${name} `),
                        )
                        .sort(
                            ({ name: cat1 }, { name: cat2 }) =>
                                categoriesInScope.indexOf(cat1) - categoriesInScope.indexOf(cat2),
                        ),
                );
            }
        }
        //eslint-disable-next-line
    }, [baseScope?.data, altScope?.data, flooringScope?.data, categoryData, categories]);

    useEffect(() => {
        if (projects?.length === 0) {
            dispatch(
                actions.rfpService.fetchProjectDetailsStart({
                    user_id: userID,
                    organization_id: org_id ?? organization_id,
                }),
            );
        }
        dispatch(
            actions.rfpService.getBidResponseStart({
                projectId: projectId,
                contractorOrgId: org_id ?? organization_id,
            }),
        );
        dispatch(
            actions.rfpService.getBidRequestByProjectStart({
                projectId: projectId,
                contractorOrgId: org_id ?? organization_id,
            }),
        );
        if (allUsers?.length === 0) {
            dispatch(actions.imsActions.fetchUsersStart({}));
        }
        dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));

        dispatch(actions.fileUtility.getProjectFilesStart({ project_id: projectId }));

        dispatch(
            actions.budgeting.fetchBaseScopeRenosStart({
                projectId,
            }),
        );
        dispatch(
            actions.budgeting.fetchAltScopeStart({
                projectId,
            }),
        );
        dispatch(
            actions.budgeting.fetchFlooringRenoItemsStart({
                projectId,
            }),
        );
        getScopeDescriptions();
        dispatch(actions.singleProject.fetchProjectDataStart({ project_id: projectId }));
        if (categoryData?.length === 0) getCategoryData();
        getCustomCategoryData();
        dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        setUsers(allUsers);
    }, [allUsers]);

    useEffect(() => {
        setProjectImageFiles(imageFiles?.filter((image) => !image?.tags?.is_cover_image) ?? []);
        setProjectCoverImageURL(
            imageFiles
                ?.find((image) => image?.tags?.is_cover_image)
                ?.cdn_path?.find((path: string) => path?.toLowerCase()?.includes("autox300")),
        );
    }, [imageFiles]);

    useEffect(() => {
        setProjectInfo(project);
        if (project?.rfp_bid_details?.tailorbird_contact_user_id) {
            const contact = users.find(
                (user: any) => user.id === project?.rfp_bid_details?.tailorbird_contact_user_id,
            );
            setTbUser(() => ({ name: contact?.name, email: contact?.email }));
        }
    }, [project, users]);

    useEffect(() => {
        if (projects?.length > 0) {
            setProjectDetails(
                projects.find(
                    (project: { project_id: string | undefined }) =>
                        project.project_id == projectId,
                ),
            );
        }
        //eslint-disable-next-line
    }, [projects]);

    const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(
        projectDetails?.bid_status !== "sent",
    );

    useEffect(() => {
        setIsDetailsCollapsed(projectDetails?.bid_status !== "sent");
    }, [projectDetails]);

    const scrollThumbnails = (activeIdx: number | undefined) => {
        //thumbnail scroller
        const thumbs = document.getElementById("thumbnails");

        if (thumbs && activeIdx !== undefined)
            thumbs.scroll({
                left: activeIdx * 64, // multiply with thumbnail size
                behavior: "smooth",
            });
    };

    const projectDetailProps = React.useMemo(
        () => ({
            bidDueDate: projectInfo?.rfp_bid_details?.bid_due_date,
            budget: projectInfo?.budget,
            isVeAccepted: projectInfo?.rfp_bid_details?.is_ve_accepted,
            propertyImgPath: projectCoverImageURL ?? propertyImg,
            projectName: projectInfo?.name,
            projectType: projectDetails?.property_type,
            propertyAddress: projectInfo?.streetAddress,
            propertyUrl: projectInfo?.propertyUrl,
            tb_accountManager: tbUser?.name,
            tb_userEmail: tbUser?.email,
            totalUnits: projectInfo?.rfp_bid_details?.total_units,
            turnRate: projectInfo?.rfp_bid_details?.turn_rate,
            tb_phoneno: projectInfo?.rfp_bid_details?.tailorbird_contact_phone_number,
            owner: projectDetails?.ownership_group_name,
            management: projectInfo?.management,
            bidStatus: projectDetails?.bid_status ?? "",
            bidResponseItem: bidResponseItem,
            bidRequestItem: bidRequestItem,
            revisionRequest: revisionRequest,
            acceptedRequest: acceptedRequest,
            initialBidRequest: initialBidRequest,
            createBidItemsFailed: createBidItemsFailed,
            setCreateBidItemsFailed: setCreateBidItemsFailed,
            organization_id: organization_id,
            expectedStartDate: projectInfo?.rfp_bid_details?.expected_start_date,
            setIsDetailsCollapsed: setIsDetailsCollapsed,
            submittedOn: projectDetails?.submitted_on,
        }),
        [
            projectInfo,
            tbUser,
            projectDetails,
            bidResponseItem,
            bidRequestItem,
            revisionRequest,
            acceptedRequest,
            initialBidRequest,
            createBidItemsFailed,
            organization_id,
            projectCoverImageURL,
        ],
    );

    const carouselItems: {
        images: { imgPath: string; altText: string }[];
        thumbnails: { imgPath: string; altText: string }[];
    } = {
        images: projectImageFiles?.map((file: any, idx: number) => ({
            imgPath: file?.cdn_path?.find((path: string) => path.includes("AUTOx300")),
            altText: `img-${idx}`,
        })),
        thumbnails: projectImageFiles?.map((file: any, idx: number) => ({
            imgPath: file?.cdn_path?.find((path: string) => path.includes("AUTOx50")),
            altText: `thumb-${idx}`,
        })),
    };

    useEffect(() => {
        // if (!imageFiles)
        dispatch(actions.fileUtility.getProjectFilesStart({ project_id: projectId }));
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (bidResponse?.length > 0 || bidRequest?.length > 0) {
            let acceptedRequest = bidRequest?.filter(
                (request: { type: string; is_accepted: boolean }) => request?.is_accepted === true,
            );
            let bidVersion = bidResponse?.map((response: any) => {
                return {
                    version: `Version ${response?.version}`,
                    bid_request_id: response?.bid_request_id,
                    bid_response_id: response?.id,
                    reno_item_version: response?.reno_item_version,
                    isLatest: false,
                };
            });
            let shouldPushVersion = true;
            bidVersion.every((version: any) => {
                if (
                    version.version ===
                    `Version ${acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version}`
                ) {
                    shouldPushVersion = false;
                    return false;
                }
                return true;
            });
            shouldPushVersion &&
                bidVersion?.push({
                    version: `Version ${
                        acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version
                    }`,
                    //get latest from bid request data
                    reno_item_version:
                        acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version,
                    isLatest: true,
                });
            setBidResponseItem(bidVersion);
            if (isEmpty(selectedVersion) && version && version !== "undefined") {
                let v: number = parseInt(`${version}`, 10);
                if (!bidVersion.find((v: any) => v.version === `Version ${version}`)) {
                    v = v - 1;
                }
                dispatch(actions.biddingPortal.setSelectedVersion(`Version ${v}`));
                // handleSelectedVersion(`Version ${v}`);
            } else if (isEmpty(selectedVersion) && !version) {
                let newVersion = acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version;
                dispatch(actions.biddingPortal.setSelectedVersion(`Version ${newVersion}`));
                handleSelectedVersion(`Version ${newVersion}`);
            }
        }
        //eslint-disable-next-line
    }, [bidResponse, bidRequest]);

    useEffect(() => {
        if (bidRequestItem?.length > 0) {
            // get active revision request
            let revisionRequest = bidRequestItem?.filter(
                (request: { type: string; is_accepted: boolean }) =>
                    request?.type !== "bid_request" && request?.is_accepted !== true,
            );
            let acceptedRequest = bidRequestItem?.filter(
                (request: { type: string; is_accepted: boolean }) =>
                    request?.type !== "bid_request" && request?.is_accepted === true,
            );

            let initialBidRequest = bidRequestItem;

            let latestVersion =
                acceptedRequest?.length > 0
                    ? acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version
                    : 1;
            if (
                initialBidRequest?.length > 0 &&
                initialBidRequest?.[0]?.bid_items_status !== "completed"
            ) {
                setCreateBidItemsFailed(true);
            }
            setAcceptedRequest(acceptedRequest);
            setInitialBidRequest(initialBidRequest);
            setRevisionRequest(revisionRequest);
            let editable: boolean | undefined = isEditable;
            let bidVersion: string | undefined = selectedVersion;
            // Url contains org_id and version when tb admin accesses the contractor bidbook
            if (org_id && userRole === "admin") {
                if (editable === null || editable === undefined)
                    editable = !isLatest ? true : false;
                if (isEmpty(bidVersion)) bidVersion = `Version ${version}`;
            }
            if (
                revisionRequest?.length > 0 ||
                (bidVersion !== `Version ${latestVersion}` && !isEmpty(bidVersion) && editable)
            ) {
                dispatch(
                    actions.biddingPortal.unlockProjectForEditingStart({
                        projectId: projectId,
                        userId: userID,
                        organization_id: organization_id,
                    }),
                );
            } else if (
                revisionRequest?.length === 0 &&
                bidVersion === `Version ${latestVersion}` &&
                !isEmpty(bidVersion) &&
                !editable &&
                projectDetails &&
                projectDetails?.bid_status !== "submitted"
            ) {
                dispatch(
                    actions.biddingPortal.lockProjectForEditingStart({
                        projectId: projectId,
                        userId: userID,
                        organization_id: organization_id,
                    }),
                );
            }
        }
        // eslint-disable-next-line
    }, [bidRequestItem, selectedVersion, projectDetails]);

    useEffect(() => {
        setBidRequestItem(bidRequest);
        let bidVersion: string | undefined = selectedVersion;
        // Url contains org_id and version when tb admin accesses the contractor bidbook
        if (org_id && isEmpty(bidVersion)) {
            bidVersion = `Version ${version}`;
        }

        // eslint-disable-next-line
    }, [bidRequest]);

    const [sortedFloorPlans, setSortedFloorPlans] = useState<any[]>([]);

    useEffect(() => {
        if (floorplans.length > 0) {
            setSortedFloorPlans(
                floorplans.slice().sort((current: any, next: any) => {
                    const [currentBedCount, nextBedCount] = [
                        current?.bedsPerUnit,
                        next?.bedsPerUnit,
                    ];
                    const [currentBathCount, nextBathCount] = [
                        current?.bathsPerUnit,
                        next?.bathsPerUnit,
                    ];
                    const [currentFpArea, nextFpArea] = [current?.area, next?.area];
                    const [current_Fp, next_Fp] = [current?.name, next?.name];
                    if (currentBedCount === undefined) return 1;
                    if (nextBedCount === undefined) return -1;
                    return currentBedCount > nextBedCount
                        ? 1
                        : currentBedCount < nextBedCount
                        ? -1
                        : currentBathCount > nextBathCount
                        ? 1
                        : currentBathCount < nextBathCount
                        ? -1
                        : currentFpArea > nextFpArea
                        ? 1
                        : currentFpArea < nextFpArea
                        ? -1
                        : current_Fp > next_Fp
                        ? 1
                        : current_Fp < next_Fp
                        ? -1
                        : 0;
                }),
            );
        }
    }, [floorplans]);

    const projectDetailsItems = [
        {
            name: "project summary",
            item:
                projectInfo?.rfp_bid_details?.project_specific_notes?.length > 0 ? (
                    <BaseAccordion
                        title="PROJECT SUMMARY"
                        components={[projectInfo?.rfp_bid_details?.project_specific_notes]}
                    />
                ) : (
                    <></>
                ),
        },
        {
            name: "photos",
            item:
                projectImageFiles?.length > 0 ? (
                    <BaseAccordion
                        title="PHOTOS"
                        components={
                            !loadingFiles
                                ? [
                                      <ImageCarousel
                                          key={1}
                                          items={carouselItems.images}
                                          showThumbnails
                                          onImageChange={scrollThumbnails}
                                          thumbnailItems={carouselItems.thumbnails}
                                      />,
                                  ]
                                : []
                        }
                    />
                ) : (
                    <></>
                ),
        },
        {
            name:
                projectDetails?.property_type?.toLowerCase() === "interior"
                    ? "floor plans"
                    : "Areas",
            item:
                sortedFloorPlans?.length > 0 ? (
                    <BaseAccordion
                        title={
                            projectDetails?.property_type?.toLowerCase() === "interior"
                                ? "FLOOR PLANS"
                                : "AREAS"
                        }
                        components={[
                            <BasicTabs
                                key={1}
                                tabs={sortedFloorPlans.map(
                                    ({
                                        area,
                                        bedsPerUnit,
                                        bathsPerUnit,
                                        name,
                                        totalUnits,
                                        id,
                                        cdn_paths,
                                        commercial_name,
                                    }) => ({
                                        label: commercial_name.toUpperCase() ?? name.toUpperCase(),
                                        content: (
                                            <FloorplanSummary
                                                bathCount={bathsPerUnit}
                                                bedCount={bedsPerUnit}
                                                totalSQFT={area}
                                                totalUnits={totalUnits}
                                                disableBedBathCount={
                                                    projectDetails?.property_type?.toLowerCase() !==
                                                    "interior"
                                                }
                                                summary={getDescriptionById(id)}
                                                fpImgPath={
                                                    cdn_paths?.length > 0
                                                        ? cdn_paths.find((url: any) =>
                                                              url?.includes("AUTOx300"),
                                                          ) ?? ""
                                                        : ""
                                                }
                                            />
                                        ),
                                    }),
                                )}
                            />,
                        ]}
                    />
                ) : (
                    <></>
                ),
        },
        {
            name: "scope summary",
            item:
                category?.length > 0 ? (
                    <BaseAccordion
                        title="SCOPE SUMMARY"
                        components={category?.map(({ id: categoryId, name: categoryName }, idx) => (
                            <ScopeSummary
                                key={idx}
                                categoryName={categoryName}
                                summary={getDescriptionById(categoryId)}
                            />
                        ))}
                    />
                ) : (
                    <></>
                ),
        },
    ];

    const handleSelectedVersion = (newValue: any) => {
        dispatch(actions.biddingPortal.setSelectedVersion(newValue));
        let latestVersion = 1;
        let acceptedRequest = bidRequest?.filter(
            (request: { type: string; is_accepted: boolean }) =>
                request?.type !== "bid_request" && request?.is_accepted === true,
        );
        if (acceptedRequest?.length > 0) {
            latestVersion = acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version;
        }
        if (
            newValue !== `Version ${latestVersion}` &&
            !isEmpty(newValue) &&
            bidRequestItem &&
            bidRequestItem?.length > 0
        ) {
            dispatch(
                actions.biddingPortal.fetchBidItemsHistoryStart({
                    projectId: projectId,
                    bid_request_id: bidRequestItem?.filter(
                        (item: { revision_version: string }) =>
                            `Version ${item?.revision_version}` === newValue,
                    )?.[0]?.id,
                    contractor_org_id: organization_id,
                }),
            );
            if (localStorage.getItem("role") === "admin") {
                localStorage.setItem("isLatest", "false");
                localStorage.setItem("version", (newValue as string).split(" ")[1]);
            }
        }
        if (
            newValue === `Version ${latestVersion}` &&
            !isEmpty(newValue) &&
            bidRequest?.length > 0
        ) {
            //Get latest bid items from last bid request reno version
            let acceptedRequest = bidRequest?.filter(
                (request: { is_accepted: boolean }) => request?.is_accepted === true,
            );
            let renoVersion = acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version;
            dispatch(
                actions.biddingPortal.fetchBidItemsStart({
                    projectId: projectId,
                    contractorOrgId: organization_id,
                    renovationVersion: renoVersion,
                }),
            );
            dispatch(
                actions.biddingPortal.fetchHistoricalPricingDataStart({
                    projectId: projectId,
                    contractorOrgId: organization_id,
                    renovationVersion: renoVersion,
                }),
            );
            if (latestVersion && latestVersion != 1) {
                dispatch(
                    actions.biddingPortal.fetchDiffFromRenovationVersionStart({
                        projectId: projectId,
                        renovationVersion: renoVersion,
                        bidResponse: bidRequest?.find(
                            (val: any) =>
                                val.revision_version ===
                                parseInt((latestVersion - 1).toFixed(0), 10),
                        ),
                        contractor_org_id: organization_id,
                    }),
                );
            }
            if (localStorage.getItem("role") === "admin") {
                localStorage.setItem("isLatest", "true");
                localStorage.setItem("version", latestVersion.toString());
            }
        }
    };

    if (loadingRfpProject) {
        return (
            <CommonDialog
                open={loadingRfpProject}
                onClose={() => {}}
                loading={loadingRfpProject}
                loaderText={"Please wait. Loading Project Details ..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }
    return (
        <>
            {loadingBid ? null : projectDetails?.bid_status === "sent" ? null : (
                <StatusIndicator
                    bidStatus={projectDetails?.bid_status}
                    bidResponseItem={bidResponseItem}
                    organization_id={organization_id}
                />
            )}
            <Grid container direction={"column"} alignItems={"center"}>
                <Grid item width="100%" sx={{ marginBottom: "24px" }}>
                    <ProjectDetail {...projectDetailProps} />
                </Grid>
                <Grid item width="87.5%">
                    <CollapsibleSection
                        defaultCollapsed={isDetailsCollapsed}
                        expandLabel="Show Project Details"
                        collapseLabel="Hide Project Details"
                        components={projectDetailsItems?.map(({ item }) => item)}
                    />
                </Grid>
                <ScrollToTop />
            </Grid>
            {projectDetails?.bid_status !== "sent" ? (
                <PriceSummaryTable
                    captureEditMode={
                        projectDetails?.bid_status === BIDS_STATUSES.PENDING_SUBMISSION ||
                        projectDetails?.bid_status === BIDS_STATUSES.REQUESTED_REVISED_PRICING ||
                        projectDetails?.bid_status === BIDS_STATUSES.ACCEPTED
                    }
                    bidResponseItem={bidResponseItem}
                    organization_id={organization_id}
                    handleSelectedVersion={(newValue: any) => handleSelectedVersion(newValue)}
                    projectType={projectDetails?.property_type}
                />
            ) : null}
        </>
    );
};

export default ProjectDetailsV2;
