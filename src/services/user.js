import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getUserApi = async (paginateData) => {
    console.log(paginateData)
    try {
        const catagory = await api_services.get(`admin/v1/manage-user?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}`);
        console.log(catagory.data)
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}