import { useEffect, useReducer, useState, useCallback } from 'react';
import { apiReducer } from './reducers/apiReducer';
import { ACTIONS_TYPE } from './actions/apiActions';
import { getCharactersBasedOnPage } from './services/getCharacters';
import { MINIMUM_PAGE_PARAM_VALUE } from './constants';
import { Character } from './components/character';
import swloading from './assets/swloading.gif';
import { useCachedResults } from './hooks/useCachedResults';
import { getDataFromEndpointUrl } from './services/getDataFromEndpointUrl';
import { getPromiseFulfilledData } from './utils/getPromiseFulfilledData';

const initialState = {
  loading: true,
  errorMessage: '',
  characters: [],
};

const App = () => {
  const [state, dispatch] = useReducer(apiReducer, initialState);
  const [page, setPage] = useState(MINIMUM_PAGE_PARAM_VALUE);
  const { updateCacheResults, currentCachedResult } = useCachedResults(page);

  const getHomeWorldAndSpeciesDetails = async ({
    homeworld: homeworldEndpointUrl,
    species: speciesEndpointUrls,
    ...restCharacterInfo
  }) => {
    const homeWorldPromise = getDataFromEndpointUrl(homeworldEndpointUrl);
    const speciesPromise = speciesEndpointUrls[0]
      ? getDataFromEndpointUrl(speciesEndpointUrls[0])
      : Promise.resolve('Human');

    const [homeWorldDetails, speciesDetails] = await getPromiseFulfilledData([
      homeWorldPromise,
      speciesPromise,
    ]);

    return {
      ...restCharacterInfo,
      homeWorldDetails,
      speciesDetails,
    };
  };

  const getCharactersList = useCallback(async () => {
    if (currentCachedResult) return currentCachedResult;

    const characters = await getCharactersBasedOnPage(page);

    const updatedCharacters = await Promise.all(
      characters.map(getHomeWorldAndSpeciesDetails)
    );

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
      .catch((errorMessage) => {
        dispatch({
          type: ACTIONS_TYPE.SET_ERROR_MESSAGE,
          payload: errorMessage,
        });
      })
      .finally(() => {
        dispatch({ type: ACTIONS_TYPE.SET_LOADING, payload: false });
      });

    return () => {
      dispatch({ type: ACTIONS_TYPE.SET_LOADING, payload: true });
    };
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
