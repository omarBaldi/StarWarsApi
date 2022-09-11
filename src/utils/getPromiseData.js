/**
 * @param {*} promiseArr array of promises
 * @returns data for fulfilled promises
 */
export const getPromiseData = async (promiseArr) => {
  const promisesFulfilled = await (
    await Promise.allSettled(promiseArr)
  ).filter((promise) => promise.status === 'fulfilled');

  const promisesData = promisesFulfilled.map(({ value }) => value);
  return promisesData;
};
