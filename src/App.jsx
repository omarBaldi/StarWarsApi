import { useEffect, useReducer, useState, useCallback } from 'react';
import { apiReducer } from './reducers/apiReducer';
import { ACTIONS_TYPE } from './actions/apiActions';
import { getCharactersBasedOnPage } from './services/getCharacters';
import { MINIMUM_PAGE_PARAM_VALUE } from './constants';
import { Character } from './components/character';
import swloading from './assets/swloading.gif';
import { useCachedResults } from './hooks/useCachedResults';
import { getDataFromEndpointUrl } from './services/getDataFromEndpointUrl';
import { getPromiseData } from './utils/getPromiseData';

const initialState = {
  loading: true,
  errorMessage: '',
  characters: [],
};

const App = () => {
  const [state, dispatch] = useReducer(apiReducer, initialState);
  const [page, setPage] = useState(MINIMUM_PAGE_PARAM_VALUE);
  const { updateCacheResults, currentCachedResult } = useCachedResults(page);

  /**
   * @param {endpointsArr} endpointsArr an array of endpoints to be called - string[]
   * @returns an object containing [key: url] and [value: data from endpoint url]
   */
  const getDataAndCreateObject = async (endpointsArr) => {
    /* Create a new Set considering the fact that we do not
    want to call the same endpoint more than once */
    const uniqueUrls = [...new Set(endpointsArr)];

    /* Get promise data by passing array of promises */
    const promiseData = await getPromiseData(
      uniqueUrls.map(getDataFromEndpointUrl)
    );

    /* Create object with url as a key and the data retrieved
    as the value that can be easily retrieved from while looping
    the characters */
    const objBasedOnUrl = promiseData.reduce((acc, { url, ...rest }) => {
      return { ...acc, [url]: rest };
    }, {});

    return objBasedOnUrl;
  };

  const getCharactersList = useCallback(async () => {
    if (currentCachedResult) return currentCachedResult;

    const characters = await getCharactersBasedOnPage(page);

    const homeWorldUrls = characters.map(
      ({ homeworld: homeworldEndpointUrl }) => homeworldEndpointUrl
    );
    const homeworldsDetailsObj = await getDataAndCreateObject(homeWorldUrls);

    const speciesUrls = [].concat(
      ...characters.map(({ species: speciesEndpointUrl }) => speciesEndpointUrl)
    );
    const speciesDetailsObj = await getDataAndCreateObject(speciesUrls);

    const updatedCharacters = characters.map((character) => ({
      ...character,
      homeWorldDetail: homeworldsDetailsObj[character.homeworld],
      speciesDetail: speciesDetailsObj[character.species[0]],
    }));

    updateCacheResults(updatedCharacters);

    return updatedCharacters;
  }, [page]);

  /* As soon as the component is mounted, call API endpoint
  to retrieve list of characters */
  useEffect(() => {
    getCharactersList()
      .then((updatedCharacters) => {
        dispatch({
          type: ACTIONS_TYPE.SET_CHARACTERS,
          payload: updatedCharacters,
        });
      })
      .catch((err) => {
        const errorMessage = err.message || 'Error here!';
        dispatch({
          type: ACTIONS_TYPE.SET_ERROR_MESSAGE,
          payload: errorMessage,
        });
      })
      .finally(() => {
        dispatch({ type: ACTIONS_TYPE.SET_LOADING, payload: false });
      });
  }, [getCharactersList]);

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage <= 1 ? prevPage : prevPage - 1));
  };

  /* As soon as the next page button is being clicked,
  I need to increment the page param by 1 and repeat the process
  of getting characters + homeWorld details */
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (state.loading) return <img src={swloading} alt=''></img>;
  if (state.errorMessage) return <div>{state.errorMessage}</div>;

  return (
    <>
      {state.characters.map((character, _) => (
        <Character key={character.name} {...character} />
      ))}
      <button onClick={handlePreviousPage}>Back Page</button>
      <button onClick={handleNextPage}>Next Page</button>
    </>
  );
};

export default App;
