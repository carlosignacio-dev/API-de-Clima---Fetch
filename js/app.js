
const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    //Validar el formulario
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    if(ciudad === "" || pais === "") {
        //error
        mostrarError("Ambos campos son obligatorios");
        return;
    }

    //Consultar API 
    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje) {
    const alerta = document.querySelector(".bg-red-100");

    if(!alerta) {
        //Crear una alerta
        const alerta = document.createElement("div");
    
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-md", "mx-auto", "mt-6", "text-center");
    
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 2500);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = "b81d8af116d5ef677ff327c114369979";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            limpiarHTML();

            if(datos.cod === "404") {
                mostrarError("Ciudad no encontrada");
                return;
            }

            //Imprime respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min }} = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `${name}`
    nombreCiudad.classList.add("font-bold", "text-6xl");

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add("font-bold", "text-6xl");

    const tempMaxima = document.createElement("p");
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add("text-xl");

    const tempMinima = document.createElement("p");
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add("text-xl");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

function kelvinACentigrados(grados) {
    return parseInt(Math.floor(grados - 273.15))
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-chase');

    divSpinner.innerHTML = `    
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>    
    `;

    resultado.appendChild(divSpinner);
}