import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const manageBackGroundMusic = async (data) => {
    try {
        const music = await api_services.post("/admin/v1/manage-background-audio", data);
        return music.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const getBackGroundMusicApi = async (paginateData) => {
    try {
        const music = await api_services.get(`admin/v1/get-backGround-audio?page=${paginateData?.number}&limit=${paginateData?.size}&search=${paginateData?.search ? paginateData?.search : ''}`);
        return music.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const deleteBackGroundMusic = async (data) => {
    try {
        const res = await api_services.post(`/admin/v1/delete-background`, data);
        return res.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}