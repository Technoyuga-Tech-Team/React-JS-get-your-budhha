import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const manageMenidation = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/manage-meditation", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const getMeditationApi = async (paginateData) => {
    console.log(paginateData)
    try {
        const catagory = await api_services.get(`admin/v1/get-audio-with-filter?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}&theme=${paginateData?.theme}&mood=${paginateData?.mood}`);
        console.log(catagory.data)
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}