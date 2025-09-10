import React from "react";
import "./Courses.css";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-thumb">
        <img
          src={course.poster?.url || "https://picsum.photos/400/225"}
          alt={course.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://picsum.photos/400/225";
          }}
        />
        {course.isFree ? (
          <span className="badge free">Free</span>
        ) : (
          <span className="badge paid">Paid</span>
        )}
      </div>
      <div className="course-info">
        <h3>{course.title}</h3>
        <p>{course.description.slice(0, 80)}...</p>
        <span className="category">{course.category}</span>
      </div>
    </div>
  );
};

export default CourseCard;