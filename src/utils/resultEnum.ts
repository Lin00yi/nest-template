export enum ResultEnum {
  LOGIN_OUT_SUCCESS = 200,
  LOGIN_IN_SUCCESS = 201,

  AUTHORITY_FAILURE = 300,

  LOGIN_FAILURE_200401 = 200401,
  LOGIN_FAILURE_200402 = 200402,
  LOGIN_FAILURE_200403 = 200403,

  OPERATE_SUCCESS = 400,
  OPERATE_FAILURE = 401,

  QUERY_SUCCESS = 500,
  QUERY_FAILURE = 501,

  DELETE_SUCCESS = 600,
  DELETE_FAILURE = 601,

  INSERT_SUCCESS = 700,
  INSERT_FAILURE = 701,

  UPDATE_SUCCESS = 800,
  UPDATE_FAILURE = 801,

  SQL_FAILURE = 900,
  HTTP_FAILURE = 901,
  SERVICE_FAILURE = 902,

  PARAM_ERROR = 903,

  WX_PAY_EXCEPTION = 904,
}

export interface ResultMessage {
  [key: number]: string;
}

export const ResultMessage: ResultMessage = {
  [ResultEnum.LOGIN_OUT_SUCCESS]: '退出成功!',
  [ResultEnum.LOGIN_IN_SUCCESS]: '登录成功!',
  [ResultEnum.AUTHORITY_FAILURE]: '权限不足!',
  [ResultEnum.LOGIN_FAILURE_200401]: '登录失败!',
  [ResultEnum.LOGIN_FAILURE_200402]: '登录信息已过期!',
  [ResultEnum.LOGIN_FAILURE_200403]: '未登录，请先登录!',
  [ResultEnum.OPERATE_SUCCESS]: '操作成功!',
  [ResultEnum.OPERATE_FAILURE]: '操作失败!',
  [ResultEnum.QUERY_SUCCESS]: '查询成功!',
  [ResultEnum.QUERY_FAILURE]: '查询失败!',
  [ResultEnum.DELETE_SUCCESS]: '删除成功!',
  [ResultEnum.DELETE_FAILURE]: '删除失败!',
  [ResultEnum.INSERT_SUCCESS]: '新增成功!',
  [ResultEnum.INSERT_FAILURE]: '新增失败!',
  [ResultEnum.UPDATE_SUCCESS]: '修改成功!',
  [ResultEnum.UPDATE_FAILURE]: '修改失败!',
  [ResultEnum.SQL_FAILURE]: '数据库异常!',
  [ResultEnum.HTTP_FAILURE]: '请求异常!',
  [ResultEnum.SERVICE_FAILURE]: '服务器异常!',
  [ResultEnum.PARAM_ERROR]: '请求参数有误!',
  [ResultEnum.WX_PAY_EXCEPTION]: '微信异常!',
};
