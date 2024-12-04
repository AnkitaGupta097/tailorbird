import { gql } from "@apollo/client";

export const GET_RENOVATION_UNITS = gql`
    query getRenovationUnitDetailData(
        $renoUnitId: String
        $projectId: String
        $filterApprovals: Boolean
    ) {
        getRenovationUnits(
            reno_unit_id: $renoUnitId
            project_id: $projectId
            filter_approvals: $filterApprovals
        ) {
            is_active
            id
            unit_id
            release_date
            general_contractor
            project_id
            created_at
            updated_at
            scheduled_date
            status
            unit_name
            unit_type
            floor_plan_id
            floor_plan_name
            area
            unit_stats {
                reno_unit_id
                completed_work
                total_work
            }
            scope_approval_id
            approval_count
            renovation_start_date
            renovation_end_date
            move_out_date
            make_ready_date
            move_in_date
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
            pms_job_phases
        }
    }
`;

export const GET_RENOVATION_UNIT = gql`
    query GetRenovationUnit($renoUnitId: String) {
        getRenovationUnit(reno_unit_id: $renoUnitId) {
            is_active
            id
            unit_id
            release_date
            move_in_date
            move_out_date
            make_ready_date
            renovation_start_date
            renovation_end_date
            general_contractor
            project_id
            created_at
            updated_at
            scheduled_date
            status
            unit_name
            unit_type
            floor_plan_id
            floor_plan_name
            area
            unit_stats {
                reno_unit_id
                completed_work
                total_work
            }
            approval_count
            scope_approval_id
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
        }
    }
`;

export const UPDATE_RENOVATION_UNIT = gql`
    mutation UpdateRenovationUnit(
        $renoUnitId: String
        $renovation_start_date: String
        $renovation_end_date: String
        $move_in_date: String
        $move_out_date: String
        $make_ready_date: String
        $status: String
        $remark: String
        $attachments: [Int]
    ) {
        updateRenovationUnit(
            reno_unit_id: $renoUnitId
            renovation_start_date: $renovation_start_date
            renovation_end_date: $renovation_end_date
            move_in_date: $move_in_date
            move_out_date: $move_out_date
            make_ready_date: $make_ready_date
            remark: $remark
            status: $status
            attachments: $attachments
        ) {
            is_active
            id
            unit_id
            release_date
            move_in_date
            general_contractor
            project_id
            created_at
            updated_at
            scheduled_date
            make_ready_date
            status
            unit_name
            unit_type
            floor_plan_id
            floor_plan_name
            area
            renovation_start_date
            renovation_end_date
            unit_stats {
                reno_unit_id
                completed_work
                total_work
            }
            approval_count
            scope_approval_id
            make_ready_date
            move_in_date
            move_out_date
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
        }
    }
`;

export const UNSCHEDULE_RENO_UNIT = gql`
    mutation UnscheduleRenovationUnit($renoUnitId: String) {
        unscheduleRenovationUnit(reno_unit_id: $renoUnitId) {
            is_active
            id
            unit_id
            release_date
            move_in_date
            move_out_date
            general_contractor
            project_id
            created_at
            updated_at
            scheduled_date
            make_ready_date
            status
            unit_name
            unit_type
            floor_plan_id
            floor_plan_name
            area
            renovation_start_date
            renovation_end_date
            unit_stats {
                reno_unit_id
                completed_work
                total_work
            }
            approval_count
            scope_approval_id
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
        }
    }
`;

export const RELEASE_RENOVATION_UNIT = gql`
    mutation ReleaseRenovationUnit($renoUnitId: String) {
        releaseRenovationUnit(reno_unit_id: $renoUnitId) {
            is_active
            id
            unit_id
            release_date
            general_contractor
            project_id
            created_at
            updated_at
            scheduled_date
            status
            unit_name
            unit_type
            floor_plan_id
            floor_plan_name
            area
            renovation_start_date
            renovation_end_date
            unit_stats {
                reno_unit_id
                completed_work
                total_work
            }
            approval_count
            scope_approval_id
            move_out_date
            make_ready_date
            move_in_date
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
        }
    }
`;

export const GET_RENOVATION_UNIT_BUDGET_STAT = gql`
    query GetRenovationUnitBudgetStat($renoUnitId: String) {
        getRenovationUnitBudgetStat(reno_unit_id: $renoUnitId) {
            original_contract_value
            current_contract_value
            cost_to_complete
        }
    }
`;

export const UPDATE_RENO_UNITS = gql`
    mutation UpdateRenoUnits($renoInput: UpdateMultipleRenoUnitsInput!) {
        updateRenoUnits(renoInput: $renoInput) {
            id
            renovationEndDate
            renovationStartDate
            status
        }
    }
`;

export const SCHEDULE_UNIT = gql`
    mutation ScheduleRenoUnit($scheduleRenoUnitId: [String!]!, $releaseDate: String!) {
        scheduleRenoUnit(id: $scheduleRenoUnitId, releaseDate: $releaseDate)
    }
`;

export const UPDATE_RENOVATION_UNIT_DATES = gql`
    mutation UpdateRenovationUnitDates(
        $updateRenovationUnitDatesId: String!
        $renovationStartDate: String
        $renovationEndDate: String
        $moveInDate: String
        $moveOutDate: String
        $makeReadyDate: String
    ) {
        updateRenovationUnitDates(
            id: $updateRenovationUnitDatesId
            renovationStartDate: $renovationStartDate
            renovationEndDate: $renovationEndDate
            moveInDate: $moveInDate
            moveOutDate: $moveOutDate
            makeReadyDate: $makeReadyDate
        )
    }
`;
