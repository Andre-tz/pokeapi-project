
export const background=document.querySelector(".bg-pokeball")

/*
*EVENTOS
*/
//Evento para crear fondo
window.addEventListener("DOMContentLoaded", crearFondo())
/*
*FUNCIONES
*/
 export function crearFondo(){

    let cantidadBalls=0;

    if(window.innerWidth<=767){

        cantidadBalls=10

    } else if(window.innerWidth>767 && window.innerWidth<1024){

        cantidadBalls=20

    } else{

        cantidadBalls=30
    }

    for(let i=0; i<cantidadBalls; i++){

        let pokebola=document.createElement("img");
        pokebola.src="/Recursos/Pokebola.png"
        pokebola.alt="Imagen de Pokebola"
        pokebola.classList.add("poke-ball")

        let top=Math.random()*(background.clientHeight - 50);

        let left=Math.random()*(background.clientWidth - 50);

        pokebola.style.top=`${top}px`
        pokebola.style.left=`${left}px`

        background.appendChild(pokebola);
    }
}

