const contenedor_usuario = document.getElementById("contenedor_usuario")
const usuario = document.getElementById("usuario")
const tabla = document.getElementById("cuerpo_tabla")
const formulario = document.getElementById("formulario")

const Arreglo_Guardado = localStorage.getItem("Usuarios_Guardados")
let Arreglo_Usuario = Arreglo_Guardado ? JSON.parse(Arreglo_Guardado) : []
InsertarTabla()


formulario.addEventListener("submit",async (evento) => {
    evento.preventDefault()
    const nombre_usuario = usuario.value.trim()
    try{
        const respuesta = await fetch(`https://api.github.com/users/${nombre_usuario}`)
        if(!respuesta.ok){
            alert("El usuario no ha sido encontrado")
            return
        }

        const user_encontrado = await respuesta.json()
        contenedor_usuario.innerHTML = ""

        const img_user = document.createElement("img")
        img_user.alt="Imagen Usuario"
        img_user.style.width = "100px"
        img_user.src = user_encontrado.avatar_url


        const login_user = document.createElement("h2")
        login_user.textContent = user_encontrado.login

        const respositorios_user = document.createElement("p")
        respositorios_user.textContent = `Repositorio: ${user_encontrado.public_repos}`

        usuario.value = ""

        AgregarTabla(nombre_usuario)
        contenedor_usuario.appendChild(login_user)
        contenedor_usuario.appendChild(img_user)
        contenedor_usuario.appendChild(respositorios_user)
    }catch(error){
        console.error("Error al conectar la API",error)
        contenedor_usuario.innerHTML = "<p>Error de Conexion</p>"
    }

})

function AgregarTabla(nombre_usuario){
    tabla.innerHTML = ""
    const usuario_repetido = Arreglo_Usuario.some((user) => user === nombre_usuario)
    if(usuario_repetido){
        const posicion = BuscarUsuario(nombre_usuario)
        OrdenarRepetido(posicion,nombre_usuario)
        InsertarTabla()
        return
    }
    if(Arreglo_Usuario.length <= 4 && Arreglo_Usuario.length >= 0){
        Arreglo_Usuario.push(nombre_usuario)
        const posicion = BuscarUsuario(nombre_usuario)
        OrdenPila(posicion)
        InsertarTabla()
    }else if(Arreglo_Usuario.length >4){
        OrdenarTabla(nombre_usuario)
        InsertarTabla()
    }else{
        alert("Error de Indice en el Arreglo")
    }
}

function InsertarTabla(){   
    tabla.innerHTML = ""
    for(let i = 0; i < Arreglo_Usuario.length; i++){
        const texto = Arreglo_Usuario[i]
        const fila = document.createElement("tr")
        fila.classList.add("fila")
        const celda_texto = document.createElement("td")

        celda_texto.textContent = texto
        fila.dataset.posicion = i
        fila.appendChild(celda_texto)
        tabla.appendChild(fila)
    }
    localStorage.setItem("Usuarios_Guardados",JSON.stringify(Arreglo_Usuario))
}

function OrdenarTabla(nombre_usuario){
    for(let i = 4; i >0; i--){
        Arreglo_Usuario[i] = Arreglo_Usuario[i-1]
    }
    Arreglo_Usuario[0] = nombre_usuario
}

function BuscarUsuario(nombre_usuario){
    for(let i = 0; i < Arreglo_Usuario.length; i++){
        if(Arreglo_Usuario[i] === nombre_usuario){
            return i
        }
    }
}

function OrdenarRepetido(posicion,nombre_usuario){
    if(posicion === 0) return
    for(let i = posicion; i > 0; i--){
        Arreglo_Usuario[i] = Arreglo_Usuario[i-1]
    }
    Arreglo_Usuario[0] = nombre_usuario
}

function OrdenPila(posicion){
    const usuario_incial = Arreglo_Usuario[posicion]
    if(posicion > 0){
        for(let i = posicion; i > 0; i--){
            Arreglo_Usuario[i] = Arreglo_Usuario[i-1]
        }
        Arreglo_Usuario[0] = usuario_incial
    }
}

tabla.addEventListener("click", async (evento) => {
    const fila = evento.target.closest("tr")
    if(!fila) return 
    const posicion_fila = parseInt(fila.dataset.posicion)
    const nombre_user = Arreglo_Usuario[posicion_fila]
    const rspt = await fetch(`https://api.github.com/users/${nombre_user}`)
    const user_encontrado = await rspt.json()

    contenedor_usuario.innerHTML = ""
    
    const img = document.createElement("img")
    img.alt = "Foto de Usuario"
    img.style.width = "100px"
    img.src = user_encontrado.avatar_url

    const usuario = document.createElement("h2")
    usuario.textContent = `Nombre del Usuario: ${user_encontrado.login}`
    

    const repos = document.createElement("p")
    repos.textContent = `Cantidad de Repositorios: ${user_encontrado.public_repos}`
    
    contenedor_usuario.appendChild(usuario)
    contenedor_usuario.appendChild(img)
    contenedor_usuario.appendChild(repos)

    OrdenarRepetido(posicion_fila,user_encontrado.login)
    InsertarTabla()
    }
)