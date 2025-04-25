import { errorHandlerFunctionCatchBlock } from "./ErrorHandler";
import { api_services } from "./httpClient";

export const manageMenidation = async (data) => {
  try {
    const catagory = await api_services.post(
      "/admin/v1/manage-meditation",
      data
    );
    return catagory.data;
  } catch (err) {
    const data = await errorHandlerFunctionCatchBlock(err);
    return data;
  }
};

export const getMeditationApi = async (paginateData, type, id, sort, order) => {
  try {
    let query = `admin/v1/get-audio-with-filter?`;

    if (paginateData?.number) {
      query += `page=${paginateData?.number}&`;
    }
    if (paginateData?.size) {
      query += `limit=${paginateData?.size}&`;
    }
    if (paginateData?.search) {
      query += `search=${paginateData?.search}&`;
    }
    if (paginateData?.theme) {
      query += `theme=${paginateData?.theme}&`;
    }
    if (paginateData?.mood) {
      query += `mood=${paginateData?.mood}&`;
    }
    if (type) {
      query += `type=${type}&`;
    }
    if (id) {
      query += `stage=${id}&`;
    }
    if (sort) {
      query += `sortBy=${sort}&`;
    }
    if (order) {
      query += `sortOrder=${order}&`;
    }
    const catagory = await api_services.get(query);
    return catagory.data;
  } catch (err) {
    const data = await errorHandlerFunctionCatchBlock(err);
    return data;
  }
};

export const deleteMeditation = async (data) => {
  try {
    const res = await api_services.post(`/admin/v1/delete-meditation`, data);
    return res.data;
  } catch (err) {
    const data = await errorHandlerFunctionCatchBlock(err);
    return data;
  }
};

export const UpdateIndexingApi = async (data) => {
  try {
    const res = await api_services.post(
      `/admin/v1/update-meditation-indices`,
      data
    );
    return res.data;
  } catch (err) {
    const data = await errorHandlerFunctionCatchBlock(err);
    return data;
  }
};
