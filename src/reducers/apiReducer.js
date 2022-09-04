import { ACTIONS_TYPE } from '../actions/apiActions';

export const apiReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS_TYPE.SET_LOADING: {
      const { payload: loading } = action;

      return {
        ...state,
        loading,
      };
    }
    case ACTIONS_TYPE.SET_ERROR_MESSAGE: {
      const { payload: errorMessage } = action;

      return {
        ...state,
        errorMessage,
      };
    }
    case ACTIONS_TYPE.SET_CHARACTERS: {
      const { payload: charactersList } = action;

      return {
        ...state,
        characters: charactersList,
      };
    }
    default: {
      return state;
    }
  }
};
