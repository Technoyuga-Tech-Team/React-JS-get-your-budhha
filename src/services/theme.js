import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const managetheme = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/manage-theme", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const getthemeApi = async (paginateData) => {
    try {
        const catagory = await api_services.post(`admin/v1/get-theme-list?page=${paginateData?.number}&limit=${paginateData?.size}`);
        console.log(catagory.data)
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}