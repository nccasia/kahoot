import ENV from "@/constants/Environment";
import { IAppResponseBase, IUploadImageResponse } from "@/interfaces/appTypes";
import axios from "axios";

const uploadAnImage = async (image: File): Promise<IAppResponseBase<IUploadImageResponse>> => {
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("cloud_name", String(ENV.CLOUD_NAME));
    formData.append("upload_preset", "kahoot");
    const response = await axios.post(`${ENV.CLOUD_BASE_URL}${ENV.CLOUD_NAME}/image/upload`, formData);
    const data: IAppResponseBase<IUploadImageResponse> = {
      statusCode: response.status,
      pagination: undefined,
      errorCode: null,
      message: null,
      data: response.data,
    };
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response.data;
  }
};

const deleteAnImage = async (url: string): Promise<IAppResponseBase<IUploadImageResponse>> => {
  try {
    if (!url || !url.trim()) {
      throw new Error("Invalid url");
    }
    const publicId = url.split("/").pop()?.split(".")[0];
    if (!publicId) {
      throw new Error("Invalid url");
    }
    const params = {
      public_id: publicId,
      api_key: ENV.CLOUD_API_KEY,
      api_secret: ENV.CLOUD_API_SECRET,
    };
    const response = await axios.post(`${ENV.CLOUD_BASE_URL}${ENV.CLOUD_NAME}/image/destroy`, params);
    const data: IAppResponseBase<IUploadImageResponse> = {
      statusCode: response.status,
      pagination: undefined,
      errorCode: null,
      message: null,
      data: response.data,
    };
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response.data;
  }
};

const uploadService = {
  uploadAnImage,
  deleteAnImage,
};
export default uploadService;
