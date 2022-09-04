import { useEffect, useReducer, useState, useCallback } from 'react';
import { apiReducer } from './reducers/apiReducer';
import { ACTIONS_TYPE } from './actions/apiActions';
import { getCharacters } from './services/getCharacters';
import { getHomeworldDetails } from './services/getHomeworldDetails';
import { MINIMUM_PAGE_PARAM_VALUE } from './constants';
import { Character } from './components/character';
import swloading from './assets/swloading.gif';
import { useCachedResults } from './hooks/useCachedResults';

const initialState = {
  loading: true,
  errorMessage: '',
  characters: [],
};

const App = () => {
  /* *------------------------------------------------------* */
  /*                          NEW CODE
  /* *------------------------------------------------------* */

  const [state, dispatch] = useReducer(apiReducer, initialState);
  const [page, setPage] = useState(MINIMUM_PAGE_PARAM_VALUE);
  const { updateCacheResults, currentCachedResult } = useCachedResults(page);

  const getCharactersList = useCallback(async () => {
    if (currentCachedResult) {
      return currentCachedResult;
    }

    const characters = await getCharacters({
      page,
    });

    const homeworldDetails = (
      await Promise.all(characters.map(getHomeworldDetails))
    ).reduce((acc, { url, ...rest }) => {
      return { ...acc, [url]: rest };
    }, {});

    const updatedCharacters = characters.map((character) => ({
      ...character,
      homeWorldDetail: homeworldDetails[character.homeworld],
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

  /* *------------------------------------------------------* */
  /*                          OLD CODE
  /* *------------------------------------------------------* */

  /* const [characters, setCharacters] = useState([]);
  const [people, setPeople] = useState([]);
  const [homeWorld, setHomeWorld] = useState([]);
  // const [species, setSpecies] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(`${BASE_API_URL}/people/`);
  const [backPageUrl, setBackPageUrl] = useState('');
  const [test, setTest] = useState([]);

  const fetchPeople = async () => {
    const { data } = await axios.get(nextPageUrl);
    setNextPageUrl(data.next);
    setBackPageUrl(data.previous);
    return data.results;
  };

  const backPage = async () => {
    const { data } = await axios.get(backPageUrl);
    setNextPageUrl(data.next);
    setBackPageUrl(data.previous);
  };

  // Get People
  async function getPeople() {
    const persons = await fetchPeople();

    const homeWorldUrl = await Promise.all(
      persons.map((thing) => axios.get(thing.homeworld))
    );

    const newPersons = persons.map((person) => {
      return {
        ...person,
        homeworld: homeWorldUrl.find(
          (url) => url.config.url === person.homeworld
        ),
      };
    });

    const newPersons2 = newPersons.map((person) => {
      return {
        ...person,
        homeWorld: person.homeworld.data.name,
      };
    });

    setPeople(newPersons2);
  }

  async function getSpecies() {
    // const persons = await fetchPeople();
    const speciesUrl = await Promise.all(
      // filter by length to get all with [0] together since all are arrays of [0]
      // map to create array of each one with an array of [0]
      people
        .filter((thing) => thing.species.length)
        .map((thing) => axios.get(thing.species[0]))
    );

    const newSwapi = people.map((person) => {
      return {
        ...person,
        species: speciesUrl.find((info) => info.data.url === person.species[0]),
      };
    });
    const newSwapi2 = newSwapi.map((person) => {
      if (person.species == undefined) {
        return { ...person, species: 'Human' };
      } else {
        return { ...person, species: person.species.data.name };
      }
    });
    setCharacters(newSwapi2);
    console.log(characters);
    // species.data.name
    setTest(newSwapi2);
  }

  useEffect(() => {
    async function getCharacters() {
      await getPeople();
      getSpecies();
    }
    //  getPeople();
    //  getSpecies();

    getCharacters();
  }, []);

  return (
    <div>
      <CharacterList list={characters} />
      <h4>Real Buttons Below</h4>
      <button onClick={(e) => backPage()}>Back Page</button>
      <button onClick={(e) => fetchPeople()}>Next Page</button>
      <h3>Test Button</h3>
      <button onClick={(e) => console.log(test)}>Test</button>
    </div>
  ); */
};

export default App;

/* 

  NOTE: rather than store the characters inside an array,
  implement a object data structure that store as
  a KEY the page value and as VALUE the characters result.

*/
