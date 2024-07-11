/**
 * @author huaqiang
 * @param time 等待时间
 * @returns
 */
export const waitTime = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 判断是否有query参数
 * @author huaqiang
 * @param url
 * @returns
 */
export function hasQueryParams(url: string): boolean {
  const searchParams = new URLSearchParams(url);
  return searchParams.toString() !== '';
}
