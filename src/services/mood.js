import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const managemood = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/manage-mood", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const getmoodApi = async (paginateData) => {
    console.log(paginateData)
    try {
        const catagory = await api_services.post(`admin/v1/get-mood-list?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}`);
        console.log(catagory.data)
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}