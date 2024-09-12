import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const addNotification = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/create-notification", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const getNotification = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/list-notification", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

// export const UpdateNotification = async (data) => {
//     try {
//         const catagory = await api_services.post("/admin/v1/manage-mood", data);
//         return catagory.data;
//     } catch (err) {
//         const data = await errorHandlerFunctionCatchBlock(err);
//         return data;
//     }
// };

export const deleteNotification = async (data) => {
    try {
        const catagory = await api_services.post("/admin/v1/delete-notification", data);
        return catagory.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};