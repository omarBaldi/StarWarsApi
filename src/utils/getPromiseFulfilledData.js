/**
 * @param {*} promiseArr array of promises
 * @returns data for fulfilled promises
 */
export const getPromiseFulfilledData = async (promiseArr) => {
  const promisesData = await (
    await Promise.allSettled(promiseArr)
  ).map((promise) =>
    promise.status === 'fulfilled' ? promise.value : undefined
  );

  return promisesData;
};
