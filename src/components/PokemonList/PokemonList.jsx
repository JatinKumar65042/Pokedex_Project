import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css' 
import Pokemon from "../pokemon/Pokemon";
function PokemonList(){

    const [PokemonList,setPokemonList]=useState([]);
    const [isLoading,setisLoading]=useState(true);

    const [POKEDEX_URL,setPOKEDEX_URL]=useState('https://pokeapi.co/api/v2/pokemon');
    const [next_url,setnext_url]=useState('')
    const [prev_url,setprev_url]=useState('')

    async function downloadPokemon(){
        setisLoading(true)
        const response=await axios.get(POKEDEX_URL);
        const PokemonResults=response.data.results;

        setnext_url(response.data.next)
        setprev_url(response.data.previous)

        console.log(response.data);

        const pokemonResultPromise=PokemonResults.map((pokemon)=> axios.get(pokemon.url))
        const pokemonData=await axios.all(pokemonResultPromise)
        console.log(pokemonData);
        const res=pokemonData.map((pokeData)=>{
            const pokemon=pokeData.data;

            return {
                id:pokemon.id,
                name:pokemon.name, 
                image:(pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default: pokemon.sprites.front_shiny,
                types:pokemon.types
            }
        })
        console.log(res);
        setPokemonList(res);
        setisLoading(false);
    }

    useEffect(()=>{
        downloadPokemon();
    },[POKEDEX_URL]);

    // const[x,setX]=useState(0);
    // const[y,setY]=useState(0);

    return (
        
            {/* <div>
                X: {x} <button onClick={()=> setX(x+1)}>Inc</button>
            </div>
            <div>
                Y: {y} <button onClick={()=> setY(y+1)}>Inc</button>
            </div> */},
            <div className="pokemon-list-wrapper">

                <div className="pokemon-wrapper">
                    {(isLoading)? ' Loading....':
                    PokemonList.map((p)=> <Pokemon name={p.name} image={p.image} key={p.id}/> )
                }</div>
                <div className="controls">
                    <button disabled={prev_url==null} onClick={()=>{setPOKEDEX_URL(prev_url)}}>Prev</button>
                    <button disabled={next_url==null } onClick={()=>{setPOKEDEX_URL(next_url)}}>Next</button>
                </div>
                
            </div>

            
        
    );

}

export default PokemonList;