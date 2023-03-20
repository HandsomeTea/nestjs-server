// 在路由函数执行之前/之后绑定额外的逻辑，转换请求返回结果
// 拦截器可用于全局/controller前/具体路由前
import ResponseHandle from './send';
import TestInterceptor from './test';

export { ResponseHandle, TestInterceptor };
