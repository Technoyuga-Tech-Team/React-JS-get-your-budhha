import toast from "react-hot-toast";

export const displayErrorToast = (data) => {
  return toast.error(data, {
    style: { background: "#333", color: "#fff" },
  });
};

export const displaySuccessToast = (data) => {
  return toast.success(data, {
    style: { background: "#333", color: "#fff" },
  });
};
