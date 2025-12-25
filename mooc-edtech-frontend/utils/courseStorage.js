export const getSavedCourses = () => {
  const data = localStorage.getItem("savedCourses");
  return data ? JSON.parse(data) : [];
};

export const saveCourse = (course) => {
  const current = getSavedCourses();
  const exists = current.find((c) => c.title === course.title);
  if (!exists) {
    const updated = [...current, course];
    localStorage.setItem("savedCourses", JSON.stringify(updated));
  }
};

export const clearSavedCourses = () => {
  localStorage.removeItem("savedCourses");
};
