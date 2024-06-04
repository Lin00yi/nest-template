/**
 * 自定义日志工具类
 */
export class LogUtil {
  static log(message: string) {
    console.log(`[LOG] ${message}`);
  }

  static error(message: string, trace?: any) {
    console.error(`[ERROR] ${message}`, trace);
  }

  static warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }

  static info(message: string) {
    console.info(`[INFO] ${message}`);
  }
}
