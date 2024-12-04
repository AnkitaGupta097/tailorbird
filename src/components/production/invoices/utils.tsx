import { MARK_FILE_UPLOADED } from "stores/projects/tpsm/tpsm-queries";
import { graphQLClient } from "utils/gql-client";

export const UploadFile = async (file: File, signedUrl: string, fileId: string) => {
    const options = {
        method: "PUT",
        body: file,
    };
    const uploadResponse = await fetch(signedUrl, options);
    if (!uploadResponse.ok) {
        throw uploadResponse.text;
    }
    const res = await graphQLClient.mutate("markFileUploaded", MARK_FILE_UPLOADED, {
        fileId,
    });
    if (!res) {
        throw "Unable to mark file as completed";
    }
    return true;
};
