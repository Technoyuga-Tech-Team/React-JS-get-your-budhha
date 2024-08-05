import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getDashboard = async (paginateData) => {
    try {
        console.log(paginateData)
        const catagory = await api_services.get(`admin/v1/dashboard`);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}