import { gql } from "@apollo/client";

export const CREATE_BID_BOOK = gql`
    mutation createBidBook($input: BidBookCreationInput) {
        bidbook: createBidBook(input: $input) {
            generateBidbookStatus: generate_bidbook_status
        }
    }
`;
