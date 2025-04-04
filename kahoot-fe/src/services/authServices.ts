/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAppResponseBase } from "@/interfaces/appTypes";
import { IGetTokenDTO, IGetTokenResponse } from "@/interfaces/authTypes";
import axiosConfig from "@/utils/axios";

const getToken = async (getTokenData: IGetTokenDTO): Promise<IAppResponseBase<IGetTokenResponse>> => {
  try {
    const response: IAppResponseBase<IGetTokenResponse> = await axiosConfig.post("/auth/get-token", getTokenData);
    return response;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.error;
  }
};
const authServices = {
  // add other functions here to export
  getToken,
};
export default authServices;
