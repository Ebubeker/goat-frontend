export enum ContentActions {
  INFO = "info",
  EDIT_METADATA = "editMetadata",
  MOVE_TO_FOLDER = "moveToFolder",
  DOWNLOAD = "download",
  SHARE = "share",
  DELETE = "delete",
}

export type ResponseResult = {
  message: string;
  status?: "error" | "success";
};
