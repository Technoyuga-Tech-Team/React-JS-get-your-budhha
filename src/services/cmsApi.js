import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const getListOfCmsDataApi = async (data) => {
    try {
        const getListOfSer = await api_services.get("/admin/v1/get-cms", data);
        return getListOfSer.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};

export const UpdateCmsData = async (data) => {
    try {
        const getListOfSer = await api_services.post("admin/v1/update-cms", data);
        return getListOfSer.data;
    } catch (err) {
        const data = await errorHandlerFunctionCatchBlock(err);
        return data;
    }
};
