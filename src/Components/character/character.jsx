import React from 'react';

const Character = ({
  name,
  birth_year,
  height,
  mass,
  _homeWorlDetail,
  _species,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Birth Year</th>
          <th>Height</th>
          <th>Mass</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{name}</th>
          <th>{birth_year}</th>
          <th>{height}</th>
          <th>{mass}</th>
        </tr>
      </tbody>
    </table>
  );
};

export default Character;
