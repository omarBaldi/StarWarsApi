import { useEffect, useReducer } from 'react';

const cachedResultState = {
  cachedResults: new Map(),
  currentCachedResult: undefined,
};

const CACHED_RESULTS_ACTIONS = Object.freeze({
  UPDATE_CACHED_RESULTS: 0,
  SET_CURRENT_CACHED_RESULT: 1,
});

const cachedResultsReducer = (state, action) => {
  switch (action.type) {
    case CACHED_RESULTS_ACTIONS.UPDATE_CACHED_RESULTS: {
      const { key, payload: newResult } = action;
      const updatedCachedResults = state.cachedResults.set(key, newResult);

      return {
        ...state,
        cachedResults: updatedCachedResults,
      };
    }
    case CACHED_RESULTS_ACTIONS.SET_CURRENT_CACHED_RESULT: {
      const { payload: currentCachedResult } = action;

      return {
        ...state,
        currentCachedResult,
      };
    }
    default: {
      return state;
    }
  }
};

/**
 * TODO: move cachedResult reducer inside folder
 */
export const useCachedResults = (page) => {
  const [{ cachedResults, currentCachedResult }, dispatch] = useReducer(
    cachedResultsReducer,
    cachedResultState
  );

  useEffect(() => {
    const cachedResultsKey = page.toString();
    const cachedResponse = cachedResults.get(cachedResultsKey);

    dispatch({
      type: CACHED_RESULTS_ACTIONS.SET_CURRENT_CACHED_RESULT,
      payload: cachedResponse,
    });
  }, [page]);

  const updateCacheResults = (result) => {
    const cachedResultsKey = page.toString();

    dispatch({
      type: CACHED_RESULTS_ACTIONS.UPDATE_CACHED_RESULTS,
      key: cachedResultsKey,
      payload: result,
    });
  };

  return {
    currentCachedResult,
    updateCacheResults,
  };
};
