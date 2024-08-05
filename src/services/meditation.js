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

export const getMeditationApi = async (paginateData, type, id,sort) => {
    try {
        const catagory = await api_services.get(`admin/v1/get-audio-with-filter?sortBy=${sort ?? "createdAt"}&type=${type}&stage=${id}&page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search}&theme=${paginateData?.theme}&mood=${paginateData?.mood}`);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const deleteMeditation = async (data) => {
    try {
        const res = await api_services.post(`/admin/v1/delete-meditation`, data);
        return res.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const UpdateIndexingApi = async (data) => {
    try {
        const res = await api_services.post(`/admin/v1/update-meditation-indices`, data);
        return res.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}