const urlApi = "https://pokeapi.co/api/v2/pokemon/"
const allPokemons = []
let agregados = []
let pokeTipos = ""
let imagenes = document.getElementById("img")

const cargarPokemones = async (id) => { // carga todos los pokemones
    let pokemon = urlApi + id
    await fetch(pokemon)
        .then(respuesta => respuesta.json())
        .then(final => {
            allPokemons.push(final);
        })
        .catch(error => console.log(error))
}
const cargarImg = () => {//carga las imagenes en la cabecera al hacer hover muestra los detalles
    ramdonArray(allPokemons)
    allPokemons.forEach((img, index) => {
        setTimeout(() => {
            imagenes.style.visibility = "visible"
            imagenes.setAttribute("src", img.sprites.other.home.front_default)
            document.getElementById("titulo-id").innerHTML = `#${img.id}`
            document.getElementById("titulo-name").innerHTML = img.name.toLocaleUpperCase()
            document.getElementById("titulo-name").style.color = buscarColor(img.types[0].type.name)
            if (img.types[1]) {
                document.getElementById("titulo-name").style.backgroundColor = buscarColor(img.types[1].type.name)
            } else document.getElementById("titulo-name").style.backgroundColor = "#ECECEC"
            document.getElementById("titulo-tipo1").innerHTML = img.types[0].type.name.toLocaleUpperCase()
            document.getElementById("titulo-tipo1").style.backgroundColor = buscarColor(img.types[0].type.name)
            document.getElementById("altura").innerHTML = ` ${img.height/10} mts`
            document.getElementById("peso").innerHTML = ` ${img.weight/10} kgs`
            document.getElementById("habilidad").innerHTML = img.abilities[0].ability.name
            if (img.types[1]) {
                document.getElementById("tipo-tipo").innerHTML = "Tipos:"
                document.getElementById("titulo-tipo2").classList.add("tipo")
                document.getElementById("titulo-tipo2").innerHTML = img.types[1].type.name.toLocaleUpperCase()
                document.getElementById("titulo-tipo2").style.backgroundColor = buscarColor(img.types[1].type.name)
            } else {
                document.getElementById("tipo-tipo").innerHTML = "Tipo:"
                document.getElementById("titulo-tipo2").classList.remove("tipo")
                document.getElementById("titulo-tipo2").style.backgroundColor = ""
                document.getElementById("titulo-tipo2").innerHTML = ""
            }
        }, index * 5000)
    })
}
const ramdonArray = array => array.sort(() => Math.random() - 0.5); //para desordenar un arreglo
const cargarTodos = () => { //carga al inicio todos los pokemons 
    for (let i = 1; i < 898; i++) {
        cargarPokemones(i);
    }
    setTimeout(cargarImg, 1000)
    datoAlmacenados()
}
//favoritos
const verAlert = () => { //para ingresear el nombre o ID del pokemon
    (async () => {
        const {
            value: text
        } = await Swal.fire({
            title: 'Agregar Pokemon',
            input: 'text',
            inputPlaceholder: 'Ingresa el Nombre o ID del Pokemon'
        })
        if (text) { //valido si no es vacio 
            pokemono(text, true, "container")
        } else {
            Swal.fire("Ingresa el Nombre o ID de un Pokemon")
        }
    })()
}
const pokemono = async (name, alertBolean) => { // buscar el pokemono en la api
    let pokemon = urlApi + name.toLowerCase()
    await fetch(pokemon)
        .then(respuesta => respuesta.json())
        .then(final => {
            agregados.push(final)
            localStorage.setItem("favoritos", JSON.stringify(agregados))
            if (alertBolean) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Pokemon Agregado',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            agregarPokemon(final)
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Pokemon no encontrado!'
            }), console.log(error)
        })
}
const agregarPokemon = (datosPokemon) => { // agrega el pokemono
    const nombreP = datosPokemon.name.charAt(0).toUpperCase() + datosPokemon.name.slice(1); //capitalize
    let tipos = ""
    if (datosPokemon.types[1]) {
        tipos = `${datosPokemon.types[0].type.name} -<span style="color:${buscarColor(datosPokemon.types[1].type.name)}"> ${datosPokemon.types[1].type.name}</span>`
    } else tipos = datosPokemon.types[0].type.name
    let seccion = document.getElementById("container")
    const article = document.createElement("article")
    article.id = datosPokemon.id
    article.classList.add("elementos")
    article.style.backgroundColor = buscarColor(datosPokemon.types[0].type.name) // por el idHtml busca el color asignado
    article.style.color = article.style.backgroundColor
    article.innerHTML = `<strong class="borrar"  onClick="borrarPokemon(${datosPokemon.id})"><i class="fa-solid fa-xmark"></i></strong>
                            <img src="${datosPokemon.sprites.other.home.front_default}" alt="pokemon">
                            <p class="texto">${nombreP}</p>
                            <p class="tipo">${tipos.toLocaleUpperCase()}</p>`
    article.addEventListener("mouseover", cambiarTipo = () => { //cambia el backgroundColor si hay dos tipos cuando se hace hover
        if (datosPokemon.types[1]) {
            article.style.backgroundColor = buscarColor(datosPokemon.types[1].type.name)
        }
    })
    article.addEventListener("mouseout", cambiarTipo = () => { //vuelve al backgroundColor tipo 0
        if (datosPokemon.types[1]) {
            article.style.backgroundColor = buscarColor(datosPokemon.types[0].type.name)
        }
    })
    seccion.appendChild(article)
}
const getRandomColor = () => { // genera un color al azar
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}
const buscarTipo = async () => { //busqueda de type
    let pokemon = "https://pokeapi.co/api/v2/type"
    await fetch(pokemon)
        .then(respuesta => respuesta.json())
        .then(final => colorSegunTipo(final.results))
        .catch((error) => Swal.fire("Algo ha fallado!!! :("))
}
const colorSegunTipo = (tipos) => { //asigna un color al azar a cada idHtml
    for (let idHtml of tipos) {
        switch (idHtml.name) {
            case "water":
                idHtml.color = "#30e4dc"
                break
            case "electric":
                idHtml.color = "#DAD332"
                break
            case "plant":
                idHtml.color = "#539748"
                break
            case "normal":
                idHtml.color = "#635A53"
                break
            case "fire":
                idHtml.color = "#fc3c0c"
                break
            case "rock":
                idHtml.color = "#9e9d9c"
                break
            case "ice":
                idHtml.color = "#75AEDC"
                break
            case "grass":
                idHtml.color = "#41980a"
                break
            case "dark":
                idHtml.color = "#212129"
                break
            case "ground":
                idHtml.color = "#8c3b0c"
                break
            case "steel":
                idHtml.color = "#71797E"
                break
            case "poison":
                idHtml.color = "#8d2475"
                break
            default:
                idHtml.color = getRandomColor()
        }
    }
    console.log(tipos)
    pokeTipos = tipos
}
const buscarColor = (tipoNombre) => { // busca el color segun el idHtml recibido
    let color = ""
    for (let idHtml of pokeTipos) {
        if (idHtml.name == tipoNombre) {
            color = idHtml.color
            break
        }
    }
    return color
}
const borrarPokemon = (id) => { // borra el elemnto pokemono
    Swal.fire({
        title: 'Estas seguro de Eliminar?',
        text: "Esto no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            let borrarArticle = document.getElementById(`${id}`)
            agregados.forEach((element, index) => {
                if (element.id == id) {
                    agregados.splice(index, 1)
                    localStorage.setItem("favoritos", JSON.stringify(agregados))
                }
            })
            borrarArticle.remove()
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Pokemon Eliminado',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })
}
//LOCAL STORAGE
const alertStorage = () => { //para ingresear el name usuario
    (async () => {
        const {
            value: text
        } = await Swal.fire({
            title: 'Bienvenido Usuario Nuevo',
            input: 'text',
            inputPlaceholder: 'ingresa tu usuario'
        })
        if (text) { //valido si no es vacio 
            localStorage.setItem("usuario1", text)
            let saludar = document.getElementById("saludarUsuario")
            saludar.innerHTML = "Bienvenido!!! " + text.toUpperCase() + "  .Poke app, una simple pagina hecha con javascript, html y pokeAppi."
        } else {
            alertStorage()
        }
    })()
}
const datoAlmacenados = () => {//valida si hay un usuario en localstorage y carga favoritos
    if (typeof (Storage) !== "undefined") {
        if (localStorage.usuario1 == undefined) {
            alertStorage()
        } else {
            let saludar = document.getElementById("saludarUsuario")
            saludar.innerHTML = "Bienvenido!!! " + localStorage.getItem("usuario1").toUpperCase() + "  .Poke app, una simple pagina hecha con javascript, html y pokeAppi."
            cargarFavoritos()
        }
    }
}
const borrarStorage = () => {//borra el localstorage
    Swal.fire({
        title: 'Estas seguro? se Borraran todos tus datos',
        text: "Esto no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo borrarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            agregados = []
            document.getElementById("container").innerHTML = `<Button class="btn-alert" id="btn" onclick="verAlert()">+</Button>`
            alertStorage()
            }
        })    
}
const cargarFavoritos = () => {//carga la vista de los favoritos 
    const favoritos = JSON.parse(localStorage.getItem("favoritos"))
    if (favoritos.length > 0) {
        favoritos.forEach((element) => {
            pokemono(element.name, false)
        })
    }
}
buscarTipo() // busca la cantidad de tipos para asignarle un ramdon color