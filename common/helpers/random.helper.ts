export const randomNumberGenerator = async(): Promise<string> => {
    const minm = 100000;
    const maxm = 999999;
    return (Math.floor(Math.random() * (maxm - minm + 1)) + minm).toString();
}