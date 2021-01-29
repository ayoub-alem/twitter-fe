import React from 'react';
import "./../css/subject.css";

const Subject = ({ subjectLabel, onClick, id }) => {

    return (
        <div onClick={(e) => onClick(e)} id={id} className="subject ">
            {subjectLabel}
        </div>
    )
}

export default Subject;