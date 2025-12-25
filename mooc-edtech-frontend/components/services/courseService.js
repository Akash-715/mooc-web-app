import axios from "axios";

const REST_BASE_API = 'http://localhost:8080/admin/courses?page=0&size=10';

export const listCourses = () => axios.get(REST_BASE_API);