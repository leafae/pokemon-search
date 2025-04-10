import React, { useState } from "react";
import "./PokemonCard.css";

export const PokemonCard = () => {
  const [pokemon, setPokemon] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPokemon = async (pokemonName) => {
    if (!pokemonName.trim()) {
      setError("Please enter a Pokémon name.");
      return;
    }

    setLoading(true);
    setError("");
    console.log("Fetching Pokémon with name/ID: ", pokemonName);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) throw new Error("Pokémon not found");
      const data = await response.json();
      console.log(data);
      setPokemonData(data);
    } catch (error) {
      console.error(error);
      setPokemonData(null);
      setError("Pokémon not caught. Try another name!");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    return `/assets/type-icons/${type}.png`;
  };

  const toggleShiny = () => {
    setIsShiny(!isShiny);
  };

  const randomPokemon = async () => {
    setLoading(true);
    setError("");
    const randomId = Math.floor(Math.random() * 1025) + 1;
    console.log("Fetching Pokémon with ID: ", randomId);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      if (!response.ok) throw new Error("Pokémon not found");
      const data = await response.json();
      console.log(data);
      setPokemonData(data);
    } catch (error) {
      console.error(error);
      setPokemonData(null);
      setError("Failed to fetch a random Pokémon. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Pokémon</h1>
      <div className="searchBar">
        <input
          className="pokemonInput"
          placeholder="Enter any Pokémon name."
          value={pokemon}
          onKeyDown={(e) => e.key === "Enter" && searchPokemon(pokemon)}
          onChange={(e) => setPokemon(e.target.value)}
        ></input>
        <button className="searchBtn" onClick={() => searchPokemon(pokemon)}>
          Search
        </button>
      </div>
      <div className="pokemonDisplay">
        {loading && (
          <div className="loadingContainer">
            <img
              src="/assets/pokeball-loading.png"
              alt="Loading"
              className="loadingImg"
            />
            <p className="loadingText">Catching Pokémon...</p>
          </div>
        )}

        {error && (
          <div className="errorContainer">
            <p className="errorText">{error}</p>
          </div>
        )}

        {pokemonData ? (
          <div className="pokemonInfo">
            <img
              className="pokemonSprite"
              src={
                isShiny
                  ? pokemonData.sprites.front_shiny
                  : pokemonData.sprites.front_default
              }
              alt={pokemonData.name}
              title={
                pokemonData.name.charAt(0).toUpperCase() +
                pokemonData.name.slice(1)
              }
            />
            <button onClick={toggleShiny} className="shinyBtn">
              {isShiny ? "Show Regular" : "Show Shiny"}
            </button>
            <span className="pokemonId">
              #{pokemonData.id.toString().padStart(4, "0")}
            </span>
            <h2 className="pokemonName">{pokemonData.name.toUpperCase()}</h2>
            <div className="pokemonTypes">
              {pokemonData.types.map((typeInfo) => (
                <img
                  key={typeInfo.type.name}
                  src={getTypeIcon(typeInfo.type.name)}
                  alt={typeInfo.type.name}
                  className="typeIcon"
                  title={
                    typeInfo.type.name.charAt(0).toUpperCase() +
                    typeInfo.type.name.slice(1)
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="randomContainer">
          <p className="randomText">Catch a random Pokémon!</p>
          <button className="randomBtn" onClick={randomPokemon}>
            RANDOM
          </button>
        </div>
      </div>
    </div>
  );
};
