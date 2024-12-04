import { gql } from "@apollo/client";

export const CREATE_S3_SIGNED_URL = gql`
    mutation createS3SignedURL($input: S3SignedURLInput) {
        createS3SignedURL(input: $input) {
            signed_url
            file_name
        }
    }
`;
