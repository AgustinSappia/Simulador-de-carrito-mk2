
let admin1 = new Usuarios("rayo","123");
let userStorage = [];
let contU= 1;
let a=false;
let productosAgregados = [];
let u;

detectarAdmin();
mostrarProductos();






function verificacion(){
let usuarioIngresado = document.getElementById("usuario").value;
let contraseniaIngresada = document.getElementById("pass").value;  

for(let i=1; a !=true && i<localStorage.length;i++){
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
    <h3>Objeto Nuevo</h3>
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
  u = sessionStorage.length;
  idNuevoProducto = document.getElementById("nombre-nuevo-producto").value;
  idPrecioProducto = document.getElementById("precio-nuevo-producto").value;
  idStockProducto = document.getElementById("stock-nuevo-producto").value;
  producto = new productos(u,idNuevoProducto,idPrecioProducto,idStockProducto);
  productoJson = JSON.stringify(producto);
  sessionStorage.setItem( u,productoJson);
  u++;
  //productosAgregados.push(producto);

  mostrarProductos();

}

function mostrarProductos(){
  let ulDeProductos = document.getElementById("lista_objetos_ul");
  ulDeProductos.innerHTML = "";

  for (i=1;i<sessionStorage.length;i++){   
   
    let elementoP = sessionStorage.getItem(i);
    if (elementoP === null){
      console.log("Hay un elemento faltante");
      arreglarProblema(i,sessionStorage.length);
      
    }
    else{

      let elementoPTransformado = JSON.parse(elementoP);
      let liProd = document.createElement("li");
      liProd.setAttribute("id","row_"+elementoPTransformado.id);
      liProd.innerHTML = `nombre: ${elementoPTransformado.nombre} precio: ${elementoPTransformado.precio} stock: ${elementoPTransformado.stock} id: ${elementoPTransformado.id}`
      ulDeProductos.appendChild(liProd);
    }
  }
}

function arreglarProblema(x,y){  //Lo que hace es acomodar las key en el session storage cuando se elimina un objeto
    for (x;x<y-1;x++){    //x hace referencia al la key actual e "y" hace referencia al largo del session storage
      elementoP = sessionStorage.getItem(x+1);
      objeto = JSON.parse(elementoP);
      objeto.id = x;
      elementoP = JSON.stringify(objeto);
      sessionStorage.setItem(x,elementoP);
    }
}