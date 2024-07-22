import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getStageApi = async (paginateData,data) => {
    try {
        const response = await api_services.post(`admin/v1/get-stage-list?course=${data}&page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search ? paginateData?.search : ''}`);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const manageStageApi = async (data) => {
    try {
        const response = await api_services.post(`admin/v1/manage-stage`,data);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const UpdateIndexingApi = async (data) => {
    try {
        const response = await api_services.post(`admin/v1/update-stage-indices`,data);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}