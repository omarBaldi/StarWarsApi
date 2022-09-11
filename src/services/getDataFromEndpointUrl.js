import axios from 'axios';
import { DEFAULT_ERROR_MESSAGE } from '../constants';

export const getDataFromEndpointUrl = async (url) => {
  try {
    const { data } = await axios({
      method: 'GET',
      url,
    });

    return data;
  } catch (err) {
    const errorMessage = axios.isAxiosError(err)
      ? err.message
      : DEFAULT_ERROR_MESSAGE;
    Promise.reject(errorMessage);
  }
};
