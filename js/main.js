
let admin1 = new Usuarios("rayo","123");
let userStorage = [];
let contU;
let a=false;
let productosAgregados = [];
let carrito = [];
let usuario = [];
let productosArray = [];
let u;

  iniciar();





function verificacion(){
  localStorage.setItem(1,""); // reservo el lugar para el carrito
  localStorage.setItem(0,""); //reservo el lugar para el usuario conectado
  let usuarioIngresado = document.getElementById("usuario").value;
  let contraseniaIngresada = document.getElementById("pass").value;  
  userStorage = JSON.parse(localStorage.getItem(3));
  contU=0;
  userStorage.forEach(usuario => {
    if( usuarioIngresado === usuario.nombre && contraseniaIngresada === usuario.contraseña){
      localStorage.setItem(0,JSON.stringify(usuario));
      setTimeout(detectarPagina(),2000);
      window.location="index.html";
    }
    else{
      contU++;
      if(contU===userStorage.length){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ingreso un dato erroneo',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  })

}

function registrar (){

  usuarioIngresado = document.getElementById("usuario").value;
  contraseniaIngresada = document.getElementById("pass").value;
  comparador = detectarUsuariosYaRegistrados(usuarioIngresado); // uso la funcion para saber si ya el usuario ya existe
  if (comparador===true){       

    persona = new Usuarios (usuarioIngresado,contraseniaIngresada);
    respuestaAdmin = confirm("Desea ser admin?")
    if(respuestaAdmin){
      persona.admin = 1;
    }
    else{
      persona.admin = 0;
    }
    
    if(localStorage.getItem(3)===null){
      userStorage.push(persona);
      userStorageJson = JSON.stringify(userStorage);
      localStorage.setItem(3,userStorageJson);   
    }
    else{
      userStorage = JSON.parse(localStorage.getItem(3));
      userStorage.push(persona);
      userStorageJson = JSON.stringify(userStorage);
      localStorage.setItem(3,userStorageJson);   
    }
    
  }
}
  
  function detectarAdmin (){
    parametroEnJson = localStorage.getItem("0");
    parametro = JSON.parse(parametroEnJson);
    const dive = document.getElementById("registro_objetos");
    if (parametro.admin === 1){
      dive.innerHTML = ` 
      <form action="agregarObjeto">
      <h3 class = "agregarObjetosTitulo">Agregar Articulos</h3>
      <input class="inputProductos" placeholder="Nombre" type="text" id="nombre-nuevo-producto">
      <input class="inputProductos" placeholder="Precio" type="number" id="precio-nuevo-producto">
      <input class="inputProductos" placeholder="Stock" type="number" id="stock-nuevo-producto">
      <button class="botonAgregarObjeto" type="button" onclick="registrar_Producto()" id="boton_registrar_producto">Añadir</button>
      </form> <hr>
      `;
    }
    else{
      dive.innerHTML = ` <h3> no tiene permisos para agregar productos </h3> <hr> <p> no hay productos ingresados </p>`
    }
  }
  
  function registrar_Producto(){
    idNuevoProducto = document.getElementById("nombre-nuevo-producto").value;
    idPrecioProducto = document.getElementById("precio-nuevo-producto").value;
    idStockProducto = document.getElementById("stock-nuevo-producto").value;
    if (sessionStorage.getItem(0)===null){
      producto = new productos(productosArray.length,idNuevoProducto,idPrecioProducto,idStockProducto);
      productosArray.push(producto);
      sendProductosSession(productosArray,0);
    }
    else{
      jsonP = sessionStorage.getItem("0");
      productosArray = JSON.parse(jsonP);
      producto = new productos(productosArray.length,idNuevoProducto,idPrecioProducto,idStockProducto);
      productosArray.push(producto);
      sendProductosSession(productosArray,0);
    }
   
    
    mostrarProductos();
    
  }
  
  function mostrarProductos(){
    let ulDeProductos = document.getElementById("lista_objetos_ul");
    ulDeProductos.innerHTML = "";
    productosJsonSession = sessionStorage.getItem("0");
    productosSession = JSON.parse(productosJsonSession);
    productosSession.forEach (elemento => {

      

      if (elemento.nombre === null){
        console.log("Hay un elemento faltante");
        
      }
      else{
        if(parametro.admin === 1){

          let liProd = document.createElement("li");
          liProd.setAttribute("id","row_"+elemento.id);
          liProd.innerHTML = `<div"><h3 class="nombre">${elemento.nombre}</h3></div>
          <div><p class="precio" >precio: ${elemento.precio}</p></div>
          <div><p class="stock">stock: ${elemento.stock}</p></div>
          <div class="id"><p>id: ${elemento.id}</p></div>
          <button type="button" id="addCarrito" onclick="addCarrito(${elemento.id})">añadir al Carrito</button>
          <button type="button" id="removeCarrito" onclick="removeObjeto(${elemento.id})">Eliminar</button>`
          ulDeProductos.appendChild(liProd);
        }
        else{
          let liProd = document.createElement("li");
          liProd.setAttribute("id","row_"+elemento.id);
          liProd.innerHTML = `<div"><h3 class="nombre">${elemento.nombre}</h3></div>
          <div><p class="precio" >precio: ${elemento.precio}</p></div>
          <div ><p class="stock">stock: ${elemento.stock}</p></div>
          <div class="id"><p>id: ${elemento.id}</p></div>
          <button type="button" id="addCarrito" onclick="addCarrito(${elemento.id})">añadir al Carrito</button>`
          ulDeProductos.appendChild(liProd);
        }
        
      }
     })
  }    
    
  function removeObjeto(id){
    productosJsonSession = sessionStorage.getItem("0"); //recibo el array del session storage
    productosSession = JSON.parse(productosJsonSession);
    elemento = document.getElementById("row_"+id);
    elemento.remove();                //elimino el objeto del html
    productosSession.splice(id,1);    //elimino el objeto del array
    productosSession = arreglarId(productosSession,id); //LAS ID QUEDAN DESPLAZADAS Y CON ESTA FUNCION LAS CORRIJO
    sendProductosSession (productosSession,0);
    mostrarProductos();
  }

  function sendProductosSession (array,id){
    arrayJson = JSON.stringify(array);
    sessionStorage.setItem(id,arrayJson);
  }
  
  function addCarrito(id){        //escanea los datos del producto seleccionado y los convierte en un objeto
  
    elemento = document.getElementById("row_"+id);
    divCarrito = document.getElementById("body_carrito");
    productosArray = JSON.parse(sessionStorage.getItem(0));
    prod = productosArray[id];
    prod.stock--;
    sendProductosSession(productosArray,0);
    mostrarProductos(); 
    let producto = new productos(id,
      elemento.querySelector(".nombre").textContent,
      elemento.querySelector(".precio").textContent.substring(8,11)
      );
      mandarCarrito(producto);   
    } 
    function restCarrito(id){        //escanea los datos del producto seleccionado y los convierte en un objeto
      carrito = recuperarCarrito();
      elementoCarrito = carrito.filter(element => element.id===id);
      objetoAcomparar = elementoCarrito[0];
      if (objetoAcomparar.cantidad===1){
        columna=document.getElementById("colum_"+id);
        columna.innerHTML="";
        posicion= carrito.map(elemento => elemento.id).indexOf(id);
        carrito.splice(posicion,1);
      }
      else{
        objetoAcomparar.cantidad--;

      }
        carritoJson = JSON.stringify(carrito);
        localStorage.setItem("1",carritoJson);
        productosArray = JSON.parse(sessionStorage.getItem(0));
        ObjetoComprado = productosArray[id];
        ObjetoComprado.stock++;
        sessionStorage.setItem(0,JSON.stringify(productosArray));
        actualizarCarrito();
        detectarElementosEnCarrito();
        mostrarProductos();
      } 
    function mandarCarrito(producto){ //detecta si el producto ya esta en el carrito. en el caso afirmativo aumenta la variable "cantidad" en 1 del objeto. en el caso negativo agrega el objeto al array "carrito" y cambia la variable "cantidad" a 1

      if (carrito.some(element => element.id === producto.id)){
        productoYaAgregado = carrito.find(element => element.id === producto.id);
        productoYaAgregado.cantidad++;
      }
      else{
        let cantidad=1;
        producto.cantidad=cantidad;
        carrito.push(producto);
        const Toast = Swal.mixin({  //Sweetalert
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: 'Se añadio al carrito'
        })
      
      }
    ;
        carritoJson = JSON.stringify(carrito);
        localStorage.setItem("1",carritoJson);
      actualizarCarrito();
      detectarElementosEnCarrito();

      
    }
    
    function actualizarCarrito(){ // lee el array carrito y crea los elementos que se mostraran en el html
    
      carrito = recuperarCarrito();
      divCarrito = document.getElementById("body_carrito");
      divCarrito.innerHTML="";
      carrito.forEach(producto => {
        precioFinal = producto.precio*producto.cantidad;
        elemento = document.createElement("tr");
        elemento.setAttribute("id","colum_"+producto.id)
        elemento.innerHTML = `<th scope="row">${producto.nombre}</th>
        <td>${producto.precio}</td>
        <td>${producto.cantidad}</td>
        <td> <button type="button" onclick="addCarrito(${producto.id})" >+</button>  <button type="button" onclick="restCarrito(${producto.id})" >-</button></td>
        <td id="precio_carrito">${precioFinal}</td>`
        divCarrito.appendChild(elemento);
      });
    }
    function detectarElementosEnCarrito (){ // detecta si hay elementos en el carrito. en el caso afirmativo muestra el precio total. en el caso negativo muestra un mensaje
      if (carrito.length === 0 ){
        body = document.getElementById("body_carrito");
        body.innerHTML="";
        elemento = document.createElement("tr");
        elemento.innerHTML = "<p> no hay elementos </p>";
        body.appendChild(elemento);
      }
      else{
        sumarTotal(); 
      }
    }
    
    function sumarTotal(){  // detecta los precios de los elementos añadidos en el carrito y los suma para tener un precio total
      body = document.getElementById("body_carrito");
      elemento = document.createElement("tr");
      precios = body.querySelectorAll("#precio_carrito");
      let c = 0;
      precios.forEach(element => {
        c=element.textContent*1+c;
      })
      elemento.innerHTML = `<th scope="row" colspan="3"></th>
      <td><h4>Total:</h4></td>      
      <td><h4>${c}</h4></td>
      `;
      body.appendChild(elemento);
    }
    async function detectarPagina(){   //detecta si estamos posicionado en el index para recien ahi ejecutar las funciones 
        console.log("Asdwd")
      detectarAdmin();
        mostrarProductos();
        recuperarCarrito();
        actualizarCarrito();
        detectarElementosEnCarrito();
      
    }

    function recuperarCarrito(){
      if (localStorage.getItem("1")===undefined){
        localStorage.setItem("1","");
      }
      else{
        carritoJson = localStorage.getItem("1");
      
        carrito = JSON.parse(carritoJson);
        return carrito;
      }
    }

    function vaciarCarrito(){
      carrito = [];
      localStorage.setItem("1","");
      divCarrito = document.getElementById("body_carrito");
      divCarrito.innerHTML="";
      
    }
    function iniciar(){//agregue esta funcion porque la funcion "detectar pagina" no funciona si la ip del ordenador cambia, solo funciona con el live server
      if(document.title==='Carrito'){
        Swal.fire(
          'Bienvenido',
          'Es algo divertido',
          'success'
        )
        detectarAdmin();
        mostrarProductos();
        recuperarCarrito();
        actualizarCarrito();
        detectarElementosEnCarrito();
      }
    }


    function arreglarId(array,id){
      for(let i=id;i<array.length;i++){
        elemento = array[i];
        elemento.id = elemento.id - 1;
      }
      return array;
    }

    function detectarUsuariosYaRegistrados (nombre){        //sirve para analizar si el usuario ingresado ya existe
      
      if (localStorage.getItem(3)===null){
        return true;
      }
      else{

        userStorage = JSON.parse(localStorage.getItem(3));
        if (userStorage.filter(elemento => elemento.nombre === nombre).length>0){
          alert("El nombre de usario ya esta registrado")
          return false
        }
        else{
          return true;
        }
      }
    }
    function realizar_compra(){
      window.location="Final.html";
    }
