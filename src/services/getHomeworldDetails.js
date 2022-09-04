import axios from 'axios';

export const getHomeworldDetails = async (character) => {
  const { homeworld: homeworldDetailsURL } = character;

  const { data } = await axios({
    method: 'GET',
    url: homeworldDetailsURL,
  });

  return data;
};
