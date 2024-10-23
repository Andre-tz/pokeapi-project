///Importando variables y Funciones
import { background } from "../Principal/script.js";
import { crearFondo } from "../Principal/script.js";

/*
*OBTENIENDO ELEMENTOS HTML
*/

//Variable que recibirá todos los datos de los pokémon
const pokemonContainer=document.getElementById("pokemon-container")

//Variable para buscar pokemon por nombre
const input=document.getElementById("input-buscar")

//Obteniendo elemento para desplegar temporadas
const season=document.querySelector("#seasons")

//Obteniendo elemento despegable
const menu=document.querySelector("#menu")

//Variable que guarda el modal
const modal=document.querySelector("#modal")

//Obteniendo elemento que con mensaje de alerta
const alerta=document.querySelector("#alert")
//Obteniendo arrary con la lista de las temporadas
const pokemonSeason=document.querySelectorAll(".pokemon-season")


/*
*VARAIBLES DE APOYO
*/
//Array que tendra una lista de todos los pokemon, con informacion de cada uno
let pokeList=[];

//Array que tendrá todos los botones que se han creado por medio de la API
let buttons=[]

//Varaibles de apoyo
let desde=1
let cantidadPokemon=20


/*
*FUNCIONES
*/

//Funcion obtener datos APi
function obtenerApi(numInicio, cantidadAMostrar){

//PETICIÓN A LA POKEAPI

//Haciendo petiticion a la API
const link=`https://pokeapi.co/api/v2/pokemon?limit=${cantidadAMostrar}&offset=${numInicio-1}`

fetch(link)
    .then(respuesta=>respuesta.json())
    .then(data=>{

        const pokemonData=data.results;

        //Esta variable almacena todas las promesas de los detalles de cada pokemon
        const pokemonPromise=pokemonData.map(pokeDato=>{
            return fetch(pokeDato.url)
                .then(respuesta=>respuesta.json())
        });

        //Promise.all() sirve para esperar a que todas las promesas se resuelvan y asi manejar sus datos
        Promise.all(pokemonPromise)
            .then(pokemons=>{

                pokemons.forEach(data=>{

                    //Objeto que tendrá la informacion individual de cada Pokemon
                    const pokeInfo={};
                    pokeInfo["name"]=data.name;
    
                    pokeInfo["id"]=data.id;

                    pokeInfo["height"]= data.height * 10;

                    pokeInfo["weight"]= data.weight / 10;

                    pokeInfo["tipo"]=[]
    
                     //Obtener todos los tipos de los pokémon 
                    if(data.types.length<2){
    
                        pokeInfo["tipo"].push(data.types[0].type.name)
    
                    }else{
    
                        for(let i=0; i<data.types.length; i++){
    
                            pokeInfo["tipo"].push(data.types[i].type.name)
    
                        }
    
                        
                    }
    
                    pokeInfo["image"]=data.sprites.other["official-artwork"].front_default;
    
                    //Usamos una funcion para crear la carta 
                    let pokemonDetalle=crearCard(pokeInfo)

    
                    pokeList.push(pokemonDetalle)
                    
                    let button=pokemonDetalle.children[4]

                    buttons.push(button)

                    //Evento para cada boton creado
                    button.addEventListener("click",()=>{obtenerInfo(pokeInfo)})
    
                })
                    


                })
                .catch(error=>console.error("Error", error))
        })
        .catch(error=>console.error("Error", error));

}

//Funcion cambiar cantidad de Pokemon
function cambiarPeticiones(event){
    event.preventDefault();
    let inicio=document.querySelector("#inicio");
    let cantidad=document.querySelector("#cantidad");   


    limpiarArray();

    pokeList=[];

    obtenerApi(inicio.value, cantidad.value);
    
    inicio.value="";
    cantidad.value="";
}

function peticionesTemporada(event){

    //esta variable obtendra todo el texto de el contenedor que he dado click en minusculas
    let temporada=event.target.textContent.toLowerCase()

    //Es un objeto que contien los nombres de las temporadas
    //Cada uno cuenta con una lista que es el rango de pokemon de cada temporada
    let seasonObject={
        kanto: [1, 151],
        johto: [152, 100],
        hoenn: [252, 135],
        sinnoh:[387, 107],
        unova: [494, 156],
        kalos: [650, 72],
        alola: [722, 88],
        galar: [810, 89]
    }

    //Object.Keys me da un array con las propiedades del objeto [kanto, johto, hoenn, ....]

    //  Uso el forEach para iterar sobre la lista y de esta manera ver si  en el texto esta incluido algun nombre de la temporada
   Object.keys(seasonObject).forEach(nameSeason=>{
    if(temporada.includes(nameSeason)){
        
        //de ser el caso, accedo a sus valores y los guardo en variables
        let [inicio, cantidad] = seasonObject[nameSeason];

        menu.classList.remove("despliegue")
        
        limpiarArray()

        pokeList=[];

        obtenerApi(inicio, cantidad)

    }
   })
    
}

//Funcion para retornar  los tipos de los pokemon
function obtenerTipos(list){

    if(list.length<2){
        return list[0]
   }
    return list.join(" - ");

}

//Función crear Card
function crearCard(pokemon){

    let name=pokemon.name.charAt(0).toUpperCase()+pokemon.name.slice("1")

    let types=obtenerTipos(pokemon.tipo)


    let pokeCard=document.createElement("div");

    pokeCard.classList.add("card")

    pokeCard.innerHTML= 
    `<img class=card-image src=${pokemon.image} alt="pokemon ${pokemon.name}">
    <h4 class=card-id> ${pokemon.id}</h4>
    <h3 class=card-title>${name}</h3> 
    <p class=card-tipo>${types}</p>
    <button class=card-button>Ver más</button>`

    pokemonContainer.appendChild(pokeCard)

    setTimeout(()=>{
        pokeCard.classList.add("aparecer")
    }, 200)
    return pokeCard
}


//Funcion buscar Pokemon
function buscarPokemon(){

    let string= input.value;

    let containerVacio=true;

    pokeList.forEach(li=>{
        
        let child = li.children[2].textContent.toLowerCase()

        if(child.includes(string)){

            li.style.display="flex";
            containerVacio=false;


        }else{
            li.style.display="none"
        }

        if(containerVacio==true){
            alerta.classList.add("alert")
        }else{
            alerta.classList.remove("alert")
        }
    })


}


//Funcion para limpiar el container y la lista de pokemon
function limpiarArray() {
    pokeList = [];
    pokemonContainer.innerHTML="";
}

//Funcion mostrar Modal
function obtenerInfo(card) {
    

    let infoApi=`https://pokeapi.co/api/v2/pokemon-species/${card.id}`

    fetch(infoApi)
        .then(response=>response.json())
        .then(data=>{

            //Busca el idioma español.
            //Usamos opcional changing (? .) permite acceder de forma segura a metodos u objetos, en caso este no se haye, nos devulve un undefined
            let buscarIdioma=data.flavor_text_entries.find(idioma=>idioma.language.name=="es")?.flavor_text

            if(!buscarIdioma){
               buscarIdioma=data.flavor_text_entries.length > 0? 
               data.flavor_text_entries[0].flavor_text : "No se encontró descripcion"
            }

            
            card["descripcion"]=buscarIdioma

            crearModal(card)

        }).catch(error=>console.error("Error", error))

        
}

//Funcion crear Modal
function crearModal(pokeDetalles){
    
    modal.classList.add("mostrar")
    setTimeout(()=>{

        const modalContainer=document.createElement("div")

        modalContainer.setAttribute("id", "modal-container")
    
        modalContainer.innerHTML=

            `<span id=close class=material-symbols-outlined>close</span>

            <p id=id>${pokeDetalles.id}</p>
    
            <img id=modal-img src=${pokeDetalles.image} alt="pokemon ${pokeDetalles.name}">
    
            <div id=info-container>
            
                <div id=informacion>
                
                    <h4 class=datos><span>Peso:<span> ${pokeDetalles.weight} kilos</h4>
                    <h4 class=datos><span>Altura:<span> ${pokeDetalles.height} cm.</h4>
                    <h4 class=datos><span>Tipos: <span>${pokeDetalles.tipo}</h4>
        
                </div>
        
                <p id=descripcion>${pokeDetalles.descripcion}</p>

            </div>
        `
        modal.appendChild(modalContainer)

        let clase=backgroundColor(pokeDetalles.tipo);

        setTimeout(()=>{
            modalContainer.classList.add(clase)
            modalContainer.classList.add("estirar")
        },150)

        //Variable que guarda el icono X
        const close=document.querySelector("#close")

         //Evento para cerrar modal y vaciarlo
        close.addEventListener("click", cerrarModal)

    }, 300)
   
}

//Funcion para agregar color dependiendo el tipo a cada card
function backgroundColor(tipos){

    let tipo=tipos[0]

    const typeObject = {
        fire: 'fire',
        water: 'water',
        grass: 'grass',
        bug: 'bug',
        electric: 'electric',
        flying: 'flying',
        rock: 'rock',
        ground: 'ground',
        poison: 'poison',
        psychic: 'psychic',
        ice: 'ice',
        dragon: 'dragon',
        dark: 'dark',
        fairy: 'fairy',
        steel: 'steel',
        fighting: 'fighting',
        ghost: 'ghost',
        normal: 'normal'
      };
      
      return typeObject[tipo]
}

//Funcion desplegar menu
function desplegar(){
    menu.classList.toggle("despliegue")
}

function cerrarModal(){
    modal.classList.remove("mostrar")
    setTimeout(()=>{
        modal.innerHTML=""
    }, 150)
    
}

/*
*EVENTOS
*/

//Evento para el fondo
window.addEventListener("DOMContentLoaded", ()=>crearFondo())

//Evento para obtener datos de la Api
window.addEventListener("DOMContentLoaded", obtenerApi(desde, cantidadPokemon))

//Evento para encontrar pokemon por temporada
pokemonSeason.forEach(season=>{

    season.addEventListener("click",()=>{

        peticionesTemporada(event)

    } )
})
//Evento para el input
input.addEventListener("input", buscarPokemon)

//Evento para cambiar cantidad y limites de los pokemon
document.querySelector("form").addEventListener("submit",event=>{
    cambiarPeticiones(event)
})

//Evento para desplegar menu de temporadas
season.addEventListener("click", desplegar)

