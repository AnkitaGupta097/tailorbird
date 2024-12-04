import { useAppSelector } from "stores/hooks";
import React, { useEffect, useState } from "react";

import QuestionAnswerWrapper from "./question-answer-wrapper";

const RenovationRooms: React.FC = () => {
    const { rooms, loading } = useAppSelector((state) => ({
        loading: state.singleProject.renovationWizard.rooms.loading,
        rooms: state.singleProject.renovationWizard.rooms.data,
    }));
    const [contentData, setContentData] = useState(rooms);

    useEffect(() => {
        setContentData(rooms);
    }, [rooms]);

    return (
        <QuestionAnswerWrapper
            question={"Which rooms will be impacted during this renovation?"}
            hint={"This information can always be changed later on, but just to give us an idea"}
            loading={loading}
            contentData={contentData}
            setContentData={setContentData}
            isRoomSelection={true}
            qtnKey={undefined}
            catIndex={undefined}
        />
    );
};

export default RenovationRooms;
