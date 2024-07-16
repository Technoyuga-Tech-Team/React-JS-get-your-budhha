import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getLoggedinUserProfile = async () => {
    try {
        const catagory = await api_services.get("/admin/v1/get-profile");
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const changeProfilePassword = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/change-password", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}

export const updateProfileData = async (data) => {
    try {
        const catagory = await api_services.post("admin/v1/update-profile", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
}