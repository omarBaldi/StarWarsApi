import axios from 'axios';
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE_CHARACTERS } from '../constants';

/**
 * TODO: create axios instance with base URL rather than specifying that every time
 */
export const getCharactersBasedOnPage = async (page) => {
  try {
    const { data } = await axios({
      method: 'GET',
      baseURL: BASE_API_URL,
      url: '/people',
      params: {
        page,
      },
    });

    return data.results;
  } catch (err) {
    const errorMessage = axios.isAxiosError(err)
      ? err.message
      : DEFAULT_ERROR_MESSAGE_CHARACTERS;
    Promise.reject(errorMessage);
  }
};
