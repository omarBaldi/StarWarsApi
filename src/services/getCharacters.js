import axios from 'axios';
import { BASE_API_URL } from '../constants';

/**
 * TODO: create axios instance with base URL rather than specifying that every time
 */
export const getCharacters = async ({ page = 1 }) => {
  const { data } = await axios({
    method: 'GET',
    baseURL: BASE_API_URL,
    url: '/people',
    params: {
      page,
    },
  });

  return data.results;
};
