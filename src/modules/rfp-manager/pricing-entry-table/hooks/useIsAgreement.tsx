import { useEffect, useState } from "react";

const useIsAgreement = (value: boolean, bidRequest: any) => {
    const [isAgreement, setIsAgreement] = useState(value);
    useEffect(() => {
        if (bidRequest && bidRequest?.length > 0) {
            let agreementRequest = bidRequest?.filter(
                (request: { type: string }) => request?.type === "agreement",
            );
            setIsAgreement(agreementRequest?.length > 0);
        }
    }, [bidRequest]);
    return isAgreement;
};

export default useIsAgreement;
