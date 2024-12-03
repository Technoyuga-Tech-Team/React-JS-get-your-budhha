import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getFeedbackApi = async (paginateData) => {
    try {
        const response = await api_services.get(`admin/v1/get-feedback?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}`);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const updateFeedbackApi = async (data) => {
    try {
        const response = await api_services.post(`admin/v1/mark-as-read/`,data);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}