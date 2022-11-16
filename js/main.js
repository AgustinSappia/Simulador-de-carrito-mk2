
let admin1 = new Usuarios("rayo","123");
let userStorage = [];
let contU= 2;
let a=false;
let productosAgregados = [];
let carrito = [];
let usuario = [];
let productosArray = [];
let u;

setTimeout(detectarPagina(),1000);




function verificacion(){
  localStorage.setItem(1,""); // reservo el lugar para el carrito
  localStorage.setItem(0,""); //reservo el lugar para el usuario conectado
  let usuarioIngresado = document.getElementById("usuario").value;
  let contraseniaIngresada = document.getElementById("pass").value;  
  
  for(let i=2; a !=true && i<localStorage.length;i++){ //la posicion 0 esta reservada para el carrito y la 1 para el usuario en linea
    let comparado = localStorage.getItem(i);
    objeto = JSON.parse(comparado);
    if( usuarioIngresado === objeto.nombre && contraseniaIngresada === objeto.contraseña){
      alert("Bienvenido");
      a=true;
      window.location="index.html";
      localStorage.setItem("0", comparado); //reservo la posicion 0 para el usuario que está en linea
    }
  }
  if(a != true){
    alert("ingreso algun dato mal")
  }
}

function registrar (){
  usuarioIngresado = document.getElementById("usuario").value;
  contraseniaIngresada = document.getElementById("pass").value;
  persona = new Usuarios (usuarioIngresado,contraseniaIngresada);
  respuestaAdmin = confirm("Desea ser admin?")
  if(respuestaAdmin){
    persona.admin = 1;
  }
  else{
    persona.admin = 0;
  }
  persona = JSON.stringify(persona);
    localStorage.setItem(contU,persona);
    contU++;
  }
  
  function detectarAdmin (){
    parametroEnJson = localStorage.getItem("0");
    parametro = JSON.parse(parametroEnJson);
    const dive = document.getElementById("registro_objetos");
    if (parametro.admin === 1){
      dive.innerHTML = ` 
      <form action="agregarObjeto">
      <h3>Agregar Articulos</h3>
      <p>Nombre</p><input type="text" id="nombre-nuevo-producto">
      <p>precio</p><input type="number" id="precio-nuevo-producto">
      <p>stock</p><input type="number" id="stock-nuevo-producto">
      <button type="button" onclick="registrar_Producto()" id="boton_registrar_producto">Añadir</button>
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
          <div><p class="stock">stock: ${elemento.stock}</p></div>
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
    function mandarCarrito(producto){ //detecta si el producto ya esta en el carrito. en el caso afirmativo aumenta la variable "cantidad" en 1 del objeto. en el caso negativo agrega el objeto al array "carrito" y cambia la variable "cantidad" a 1

      if (carrito.some(element => element.id === producto.id)){
        productoYaAgregado = carrito.find(element => element.id === producto.id);
        productoYaAgregado.cantidad++;
      }
      else{
        let cantidad=1;
        producto.cantidad=cantidad;
        carrito.push(producto);
        alert("se agrego producto con exito");
      
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
        elemento.innerHTML = `<th scope="row">${producto.nombre}</th>
        <td>${producto.precio}</td>
        <td>${producto.cantidad}</td>
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
      elemento.innerHTML = `<th scope="row" colspan="2"></th>
      <td><h4>Total:</h4></td>      
      <td><h4>${c}</h4></td>  `;
      body.appendChild(elemento);
    }
    async function detectarPagina(){   //detecta si estamos posicionado en el index para recien ahi ejecutar las funciones 
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
      detectarAdmin();
      mostrarProductos();
      recuperarCarrito();
      actualizarCarrito();
      detectarElementosEnCarrito();
    }


    function arreglarId(array,id){
      for(let i=id;i<array.length;i++){
        elemento = array[i];
        elemento.id = elemento.id - 1;
      }
      return array;
    }

  //  function enviarAdataJson(arrayJson){

 //   fetch("/data.json",{method:"POST",
 //                       body: JSON.stringify(arrayJson),
 //                       headers:{"content-type":"aplication/Json;charset=UTF-8",
 //                               },
 //                                     })
 //       .then((Response)=> Response.json())
 //       .then((data)=> console.log(data));
 //       
 //       
 //    
 //}