import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getFeedbackApi = async (paginateData,data) => {
    try {
        const response = await api_services.post(`admin/v1/get-feedback?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}`,data);
        console.log(response.data)
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}