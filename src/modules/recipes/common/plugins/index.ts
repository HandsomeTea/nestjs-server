/**
 * 插件的使用
 * 插件本质是apollo服务器在整个运行周期期间的抛出的一些周期函数，比如：startup，收到请求，发送请求结果等
 * apollo提供了一个ApolloServerPlugin的interface，自定义插件的实质就是按需implements这个interface
 */
export { TraceLoggingPlugin } from './tracelog.plugin';
export { ComplexityPlugin } from './complexity.plugin';
