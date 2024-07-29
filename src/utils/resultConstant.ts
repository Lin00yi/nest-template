export enum ResultStatus {
  SUCCESS = 20000,
  FAILURE = 20001,
  IDENTITY_ERROR = 20002, //身份过期/未登录
}

export const ResultMsg = {
  SUCCESS: '操作成功',
  FAILURE: '操作失败',
};
