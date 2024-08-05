import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getCourseApi = async (paginateData) => {
    try {
        const response = await api_services.post(`admin/v1/get-course-list?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search ? paginateData?.search : ''}`);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const manageCourseApi = async (data) => {
    try {
        const response = await api_services.post(`admin/v1/manage-course`,data);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const deleteCourseApi = async (data) => {
    try {
        const response = await api_services.post(`admin/v1/delete-course`,data);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}