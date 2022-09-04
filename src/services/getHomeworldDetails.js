import axios from 'axios';

export const getHomeworldDetails = async (character) => {
  const { homeworld: homeworldDetailsURL } = character;

  try {
    const { data } = await axios({
      method: 'GET',
      url: homeworldDetailsURL,
    });

    return data;
  } catch (err) {
    throw new Error(err);
  }
};
