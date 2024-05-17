import React, { createContext, useContext, useState } from "react";

const LatestQuestionContext = createContext();

export function RecentAddedQuestion() {
    return useContext(LatestQuestionContext);
}

export function QuestionStateProvider({children}){
    const [question,setQuestion] = useState([]);
    
    return (
        <LatestQuestionContext.Provider value={{question,setQuestion}}>
            {children}
        </LatestQuestionContext.Provider>
    )
}

export default LatestQuestionContext;