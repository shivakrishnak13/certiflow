import { ErrorCode } from "@/utils/constants/errorCodes";

export interface ApiResponseType {
  success?: boolean;
  message?: string;
  data?: any;
  errors?: any;
  messageCode?: ErrorCode;
}
