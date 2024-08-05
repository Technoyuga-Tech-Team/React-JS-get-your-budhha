import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getUserApi = async (paginateData) => {
    try {
        console.log(paginateData)
        const catagory = await api_services.get(`admin/v1/manage-user?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}&sortOrder=${paginateData?.sortOrder ? paginateData?.sortOrder == "1" ? 'asc' : 'desc' : 'desc'}&sortBy=${paginateData?.sortBy}`);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const updateUserApi = async (data) => {
    try {
        const response = await api_services.post(`admin/v1/user-status-manage`,data);
        return response.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}