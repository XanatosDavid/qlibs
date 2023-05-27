//READ ME:
//Si se desea hacer cambios esteticos en:
//Editor grafico del circuito: 
//  -Si desea cambiar la manera en que se representa cada elemento , puede editar la funcion actualizarDiagrama en la clase interfaz en el apartado DIBUJO
//Distribucion de la interfaz grafica:  
//  -editar con criterio el archivo HTML


///////////////////////////////
class interfaz{
  matriz= new circuitoMatriz(1);
  //////////
  historial=[];
  maximo=20;
  //////////
  div=null;
  estado=null;// 1=compuerta , 2 = conectorA , 3 = conectorB
  operador=null;// "XYZHPxxx"
  seleccionadoParaConectar = null ;
  //////////
  X=50;
  Y=80;
  Wcanvas=400;///espacio util
  Hcanvas=300;///espacio util
  WcanvasMin=400;///espacio util
  HcanvasMin=300;///espacio util
  w=50;
  h=50;
  espacio = 10
  //////////
  constructor(contenedor,canvas,ctx,capa,ctxCapa,bdiagramaCodigo,bcodigoDiagrama,codigo
    ,X,Y,Z,H, M ,P,iP,C,Mas,Menos
    ,consola ,inputs, ejecutar 
    ,generarTabla , archivo , generarResultados,
    circuito,updateLineNumbers,
    descargarCodigo,cargarCodigo,archivoCodigo){

    this.descargarCodigo=descargarCodigo;
    this.cargarCodigo=cargarCodigo;
    this.archivoCodigo=archivoCodigo;

    this.updateLineNumbers=updateLineNumbers;
    this.circuito = new Circuito(1,this);

    this.consola=consola;
    this.inputs=inputs;
    this.ejecutar=ejecutar;
    this.generarTabla=generarTabla;
    this.archivo=archivo;
    this.generarResultados=generarResultados;

    this.contenedor=contenedor;
    this.capa=capa;
    this.ctxCapa = ctxCapa;
    this.canvas=canvas;
    this.ctx = ctx;
    this.bdiagramaCodigo=bdiagramaCodigo
    this.bcodigoDiagrana=bcodigoDiagrama
    this.codigo=codigo

    this.Wcanvas = canvas.width
    this.Hcanvas = canvas.height
    this.WcanvasMin = canvas.width
    this.HcanvasMin = canvas.height
    this.esatadoActual= this.matriz.getEstado();
    
    cargarCodigo.addEventListener("click",()=>{     
      archivoCodigo.value = null 
      archivoCodigo.click();
    })
    archivoCodigo.addEventListener("input", ()=> {
      this.subirArchivoCodigo();
    })

    descargarCodigo.addEventListener("click",()=>{
      this.descargarCodigoApc();
    })

    generarTabla.addEventListener("click",()=>{
      this.generarTodasLasSalidas();
    })

    ejecutar.addEventListener("click",()=>{
      this.simular();
    })

    generarResultados.addEventListener("click",()=>{     
      archivo.value = null 
      archivo.click();
    })
    archivo.addEventListener("input", ()=> {
      this.simularMultiple();
    })


    bdiagramaCodigo.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.diagramaCodigo();
      this.updateLineNumbers()
    })
    bcodigoDiagrama.addEventListener("click",(evt)=>{   
      if(this.div != null){
        this.div.remove();
        this.div = null;
      } 
      this.codigoDiagrama();
    })
    document.addEventListener("keypress",(evt)=>{
      if(evt.key!="Enter"){
        return;
      }
      if(this.div != null){
        this.div.remove();
        this.div = null;
      } 
      console.log(evt)
      this.estado=null;
      this.operador=null;
      this.seleccionadoParaConectar = null ;
      this.matriz.setEstado(this.esatadoActual)
      this.actualizarDiagrama();
    })
  
    capa.addEventListener("mousemove",(evt)=>{      
      this.sobreElDiagrama(evt.offsetX,evt.offsetY)
    })
    
    capa.addEventListener("click",(evt)=>{
      console.log("click:",evt.offsetX,evt.offsetY)
      this.clickEnDiagrama(evt.offsetX,evt.offsetY)
    })
    
    M.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"M")
    })
    
    X.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"X")
    })
    Y.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"Y")
    })
    Z.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"Z")
    })
    P.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      let numero = (iP.value)/1
      this.cambiarEstado(1,"P"+numero)
    })
    H.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"H")
    })
    C.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(2,null)
    })
    Mas.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(null,null)
      this.aumentarQubits();
    })
    Menos.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.decrementarQubits();
      this.cambiarEstado(null,null)
    })
    /////
    this.actualizarDiagrama()
  }
  subirArchivoCodigo(){
    const file = this.archivoCodigo.files[0];

    const reader = new FileReader();
    this.circuito.reiniciarComando();
    reader.onload = () => {
      const lineBreak = reader.result.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
      let lineas = reader.result.split(lineBreak);
      this.codigo.value = reader.result
      this.log("Archivo cargado exitosamente")
    }
    reader.readAsText(file);
  }
  descargarCodigoApc(){
    let cod = this.codigo.value;
    let ar = prompt("Ingrese el nombre del archivo:", "codigo.txt");
    if(ar==null){
      return ;
    }
    this.descargarTextoComoArchivo(ar ,cod)
    this.log("Archivo descargado....")
  }
  descargarTextoComoArchivo(nombreArchivo, texto) {

    const elementoAncla = document.createElement("a");

    const textoBlob = new Blob([texto], { type: "text/plain" });
  
    const urlArchivo = window.URL.createObjectURL(textoBlob);

    elementoAncla.href = urlArchivo;
  
    elementoAncla.download = nombreArchivo;

    elementoAncla.click();
  
    window.URL.revokeObjectURL(urlArchivo);
  }

  log(txt){
    this.consola.value = this.consola.value + "\nSystem: \n"+txt+"\n";
    this.consola.scrollTop = this.consola.scrollHeight;
  }
  
  simularMultiple(){
    const file = this.archivo.files[0];
    const reader = new FileReader();
    this.circuito.reiniciarComando();
    
    let respuesta =this.circuito.generar(this.codigo.value);
    if(respuesta){
      let errores = "";
      for (let index = 0; index < respuesta.length; index++) {
        errores = "\n"+respuesta[index];
      }
      this.log("ERROR:"+ errores);
      return;
    }
    reader.onload = () => {
      
      const lineBreak = reader.result.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
      let lineas = reader.result.split(lineBreak);
      
      for (let index = 0; index < lineas.length; index++) {
        console.log(lineas[index])
        let a = new Analizador()
        let r = a.parseComplexList(lineas[index],this.circuito.qubits,index);
        if(r.error){
          this.log(r.error);
          return;
        }
        lineas[index]= r.result;
      }
      let res = "";
      
      for (let i = 0; i < lineas.length; i++) {
        this.circuito.setEntradas(lineas[i]);
        this.circuito.ejecutar();
        console.log("RESULTADO: "+complejos(this.circuito.entradas))
        res=res+complejos(this.circuito.entradas)+"\n";
      }
      this.descargarTextoComoArchivo("resultado.txt",res)
      this.log("RESULTADO: \n"+res)
    }
    reader.readAsText(file);
  }
  simular(){
    this.circuito.reiniciarComando();
    let respuesta = this.circuito.generar(this.codigo.value);
    if(respuesta){
      let errores = "";
      for (let index = 0; index < respuesta.length; index++) {
        errores = "\n"+respuesta[index];
      }
      this.log("ERROR:"+ errores);
      return;
    }
    let a = new Analizador()
    let r = a.parseComplexList(this.inputs.value,this.circuito.qubits,0);
    if(r.error){
      this.log(r.error);
      return;
    }

    let entradas = r.result
   
    
    console.log("IN:",entradas);
    console.log("IN:",complejos(this.circuito.entradas))
    this.circuito.setEntradas(entradas);
    this.circuito.ejecutar(true);
    console.log((this.circuito.entradas))
    console.log("IN:",complejos(this.circuito.entradas))
    this.log(complejos(this.circuito.entradas))

  }
  generarTodasLasSalidas(){
    let res = "";
    this.circuito.reiniciarComando();
    let respuesta = this.circuito.generar(this.codigo.value);
    if(respuesta){
      let errores = "";
      for (let index = 0; index < respuesta.length; index++) {
        errores = "\n"+respuesta[index];
      }
      this.log("ERROR:"+ errores);
      return;
    }
    let lineas = this.circuito.generarTodasLasEntradas();
    for (let index = 0; index < lineas.length; index++) {
      for (let index2 = 0; index2 < lineas[index].length; index2++) {
        //let num2 = (lineas[index][index2])**2;
        //let num1 = 1-num2;
        lineas[index][index2] = math.complex(lineas[index][index2],0);
      }
    }
    console.log(lineas)
    for (let i = 0; i < lineas.length; i++) {
      this.circuito.setEntradas(lineas[i]);
      this.circuito.ejecutar();
      console.log("RESULTADO: "+complejos(this.circuito.entradas))
      res=res+complejos(this.circuito.entradas)+"\n";
    }
    let ar = prompt("Ingrese el nombre del archivo:", "resultado.txt");
    if(ar==null){
      return ;
    }
    this.descargarTextoComoArchivo(ar ,res)
    this.log("Tabla de verdad:\n"+res)
  }
  aumentarQubits(){
    this.matriz.aumentarQbit();
    this.esatadoActual=this.matriz.getEstado();
    this.actualizarDiagrama();
  }
  decrementarQubits(){
    this.matriz.decrementarQbit();
    this.esatadoActual=this.matriz.getEstado();
    this.actualizarDiagrama();
  }
  eliminararQubits(q){
    this.matriz.eliminarQubit(q);
    this.esatadoActual=this.matriz.getEstado();
    this.actualizarDiagrama();
  }
  cambiarEstado(estado, operador){
    this.estado=estado;
    this.operador=operador;
  }
  traductorXY(x,y,extra){
    let casillasW= this.matriz.estado.final+1;
    let casillasH= this.matriz.estado.qubits;
    let rx =  Math.floor((x-this.X)/this.w);
    let ry =  Math.floor((y-this.Y)/(this.h+this.espacio));
    
    if(extra!=undefined){
      console.log("EXTRAAAAAA: ",rx,ry)
      return {X:rx,Y:ry}
    }else{
      console.log("NO EXTRA: ",rx,ry)
    }
  if(rx<0 ){
      return null;
    }
    if(casillasW<=rx){
      return null;
    }
    if(ry<0 ){
      return null;
    }
    if(casillasH<=ry ){
      return null;
    }
    
    return {X:rx,Y:ry}
  }
  sobreElDiagrama(x,y){
    this.ctxCapa.clearRect(0,0,this.Wcanvas,this.Hcanvas);
    let click = this.traductorXY(x,y);
    
    if(this.estado==1){      
      console.log(x,y)           
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){

        this.colocarCompuerta(this.operador,click.Y,click.X);
      }      
      this.actualizarDiagrama();
      this.dibujarCompuerta(this.ctxCapa,this.operador,x,y); 
    } 
    /*
    conectarA(qubit,lugar){
      this.seleccionadoParaConectar=qubit
      this.matriz.hacerAptaParaConectar(qubit,lugar)   
      this.cambiarEstado(3,null); 
    }
    conectarB(qubit,lugar){
      this.matriz.conector(qubit,lugar,this.seleccionadoParaConectar);
      this.cambiarEstado(null,null); 
    }
    */
    if(this.estado==2){ 
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.matriz.hacerAptaParaConectar(click.Y,click.X)  
        this.seleccionadoParaConectar=click.Y
      }      
      this.actualizarDiagrama();
      /*
      console.log(x,y)           
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.conectarA(click.Y,click.X);
      }      
      this.actualizarDiagrama();
      */
      this.dibujarCompuerta(this.ctxCapa,'C',x,y);
    }  
    if(this.estado==3){ 
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.matriz.conector(click.Y,click.X,this.seleccionadoParaConectar);
      }      
      this.actualizarDiagrama();
      /*
      console.log(x,y)           
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.conectarA(click.Y,click.X);
      }      
      this.actualizarDiagrama();
      */
      this.dibujarCompuerta(this.ctxCapa,'*',x,y);
    }    
    //this.actualizarDiagrama();
  }
  dibujarCompuerta(capa,op,X,Y){    
    capa.fillStyle = "white";  
    capa.strokeStyle = "#66869a";  
    capa.lineWidth = 4;
    capa.fillRect(X,Y,this.w*0.8,this.h);    
    capa.strokeRect(X,Y,this.w*0.8,this.h);
    capa.fillStyle = "#66869a"; 
    capa.font = "bold 20px Arial";
    
    if(op=='M'){
      const radio = 10;
      capa.lineWidth = 2.5;
      capa.beginPath();
      capa.arc(X+this.w/2.5,Y+this.h/2, radio, Math.PI, 0, false);
      capa.lineTo(X+this.w/2.5 - radio-1, Y+this.h/2);
      capa.lineTo(X+this.w/2.5 , Y+this.h/2);
      capa.lineTo(X+this.w/1.8 , Y+this.h/3.8);
      capa.stroke();

      return;
    }
    
    var textWidth = capa.measureText(op[0]).width;
    var textX = this.w*0.8 / 2 - textWidth / 2;
    var textY = this.h/2  + 8;
    capa.fillText(op[0], X+textX,Y+textY);
    let fase = op.slice(1);
    //Caso de la compuerta P 
    capa.font = "bold 9px Arial";
    if(fase){
      capa.fillText(fase, X+5,Y+this.h-5);
    }
  }
  clickEnDiagrama(x,y){
    let click = this.traductorXY(x,y);  
    this.matriz.setEstado(this.esatadoActual);  
    //BORRADO Q S
    let click2=0;
    if(this.estado==null){
      click2 = this.traductorXY(x,y,1); 
      if(click2.Y==-1 && click2.X >=0 && click2.X < this.matriz.estado.matriz[0].length){
        this.popUpp(x,y,click2.Y,click2.X);
        return
      }
      if(click2.X==-1 && click2.Y >=0 && click2.Y < this.matriz.estado.matriz.length){
        this.popUpp(x,y,click2.Y,click2.X);
        return
      }
      
    }
    //
    if(click==null){      
      return;
    }   
    if(this.estado==null){
      if(this.matriz.estado.matriz[click.Y][click.X]=='-'){
        return; 
      }
      this.popUpp(x,y,click.Y,click.X);
    }else if(this.estado==1){
      console.log(this.operador,click.Y,click.X)
      this.colocarCompuerta(this.operador,click.Y,click.X);
    }else if(this.estado==2){
      console.log(this.operador,click.Y,click.X)
      this.conectarA(click.Y,click.X)
    }else if(this.estado==3){
      console.log(this.operdor,click.Y,click.X)
      this.conectarB(click.Y,click.X)
    }    
    this.actualizarDiagrama();
    this.esatadoActual=this.matriz.getEstado()
  }
  popUpp(x,y,elementoY,elementoX){
    if(this.div != null){
      this.div.remove();
      this.div = null;
    }    
    const buttonBorrar = document.createElement('button');  
    buttonBorrar.className = "square-btn"
    buttonBorrar.innerHTML ='    <svg style="fill:#69a8e7" width="10px" heigth="10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'; 
    buttonBorrar.addEventListener('click', () => {
      console.log("borrado:",elementoY,elementoX)
      this.matriz.borrarElemento(elementoY,elementoX);
      this.esatadoActual=this.matriz.getEstado();
      this.actualizarDiagrama();
      this.div.remove();
      this.div = null;
    });

    const PButton =  document.createElement('button');     
    PButton.className = "square-btn"
    PButton.innerHTML ="<span style='color:#69a8e7;'>P</span>"; 

    const Pin =  document.createElement('input');
    Pin.style.width = "50px"
    Pin.type = "number" 
    Pin.value = 180;
    Pin.style.border="none"
    Pin.style.textAlign="center"
    PButton.addEventListener('click', () => {
      let phase =Pin.value/1;
      if(phase==NaN){
        phase=0;
      }
      phase=phase%360
      this.matriz.estado.matriz[elementoY][elementoX]=('P'+phase)
      this.esatadoActual=this.matriz.getEstado();
      this.actualizarDiagrama();
      this.div.remove();
      this.div = null;
    });
    
    
    
    
    this.div = document.createElement('div');
    this.div.style.position = 'absolute'; 
    this.div.style.backgroundColor="white"
    if(elementoY==-1 || elementoX==-1){
      console.log("hjgdsfgdhg")
      this.div.appendChild(buttonBorrar);
      this.div.style.top = `${this.Y+(elementoY)*(this.w+this.espacio)-15}px`;
    this.div.style.left = `${this.w*elementoX+this.X+this.w*0.1}px`;
    this.contenedor.appendChild(this.div);
      return;
    }
    //this.div.style.borderColor ="black"
    //this.div.style.borderWidth ="2px"
    this.div.appendChild(buttonBorrar);
    if(this.matriz.estado.matriz[elementoY][elementoX][0]=="P"){
      this.div.appendChild(PButton);
      this.div.appendChild(Pin);
    }
    
      
    
    this.div.style.top = `${this.Y+(elementoY)*(this.w+this.espacio)-35}px`;
    this.div.style.left = `${this.w*elementoX+this.X+this.w*0.1}px`;
    this.contenedor.appendChild(this.div);
    
    
    
  }
  actualizarDiagrama(){    
    console.log("Estado de la matriz:",this.matriz.estado);
    let X = this.X
    let Y = this.Y
    let w = this.w;
    let wc = this.w*0.75;
    let cw = (w-wc)/2
    let h = this.h;
    let espacio = this.espacio;
    ////////////////////////REDIMENSION
    let realW = X + (this.matriz.estado.final+1)*w;
    let realH = Y + (this.matriz.estado.qubits)*(h+espacio);
    if(realW>this.Wcanvas){
      this.canvas.width = realW+X;
      this.capa.width = realW+X;      
    }else{
      this.canvas.width = this.WcanvasMin;
      this.capa.width = this.WcanvasMin;
    }
    if(realH>this.Hcanvas){
      this.canvas.height = realH+Y;      
      this.capa.height = realH+Y; 
    }else{
      this.canvas.height = this.HcanvasMin;
      this.capa.height = this.HcanvasMin;
    }
    /////////////////////////DIBUJO
    this.ctx.clearRect(0,0,this.Wcanvas,this.Hcanvas)
    for (let i = 0; i < this.matriz.estado.matriz.length; i++) {  
      this.ctx.fillStyle = "#66869a"; 
      this.ctx.font = "bold 15px Arial";
      this.ctx.fillText('Q'+i,X-30,Y+i*(h+espacio)+h/2+5)
      this.ctx.fillRect(X,Y+i*(h+espacio)+h/2,w*this.matriz.estado.matriz[i].length,5);
      for (let j = 0; j < this.matriz.estado.matriz[i].length; j++) { 
        this.ctx.fillStyle = "#66869a"; 
        this.ctx.font = "bold 15px Arial";
        this.ctx.fillText('S'+j,X+j*w+w/3,Y-30)
        if(this.matriz.estado.matriz[i][j]!='-'){
          if(this.matriz.estado.matriz[i][j][0]=='C'){
            //Representacion de las conecciones:
            let objetivo = this.matriz.estado.matriz[i][j].slice(1)/1;
            let yObjetivo = Y+objetivo*(h+espacio)+h
            this.ctx.beginPath();
            this.ctx.arc(X+j*w+w/2,Y+i*(h+espacio)+h/2+1, 10, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.fillRect(X+j*w+w/2-2.5,Y+i*(h+espacio)+h/2,5,yObjetivo-(Y+i*(h+espacio)+h/2));
          }else{
            //Representacion de las compuertas:
            this.dibujarCompuerta(this.ctx,this.matriz.estado.matriz[i][j],X+j*w+cw,Y+i*(h+espacio))
            //this.ctx.fillStyle = "red";   
            //this.ctx.fillRect(X+j*w+cw,Y+i*(h+espacio),wc,h);
            //this.ctx.fillStyle = "black"; 
            //this.ctx.strokeRect(X+j*w+cw,Y+i*(h+espacio),wc,h);
            //this.ctx.fillText(this.matriz.estado.matriz[i][j][0], X+j*w+cw+wc/2-3,Y+i*(h+espacio)+h/1.75);
            //let fase = this.matriz.estado.matriz[i][j].slice(1);
            //Caso de la compuerta P 
            //if(fase){
              //this.ctx.fillText(fase, X+j*w+cw+1,Y+i*(h+espacio)+h-1);
            //}
          }          
        }     
      }
    }
  }
  diagramaCodigo(){
    this.log("Codigo generado automaticamente")
    this.matriz.setEstado(this.esatadoActual)
    this.codigo.value= this.matriz.generarCodigo()
  }
  codigoDiagrama(){
    console.log(this.codigo.value)
    let res = this.matriz.generar(this.codigo.value);
    console.log("DDDDDDDDDDDDDDDDD")
    console.log(res)
    if(res){
      let errores = "";
      for (let index = 0; index < res.length; index++) {
        errores = "\n"+res[index];
      }
      this.log("ERROR:"+ errores);///SALIDA DE ERROR
    }else {
      console.log(this.matriz.getEstado());
      this.esatadoActual = this.matriz.getEstado();
      console.log(this.matriz.estado)
      this.actualizarDiagrama()
      this.log("Diagrama generado automaticamente")
    }
    
  }
  /////
  colocarCompuerta(compuerta,qubit,lugar){
    this.matriz.operador(compuerta,qubit,lugar);
  }
  conectarA(qubit,lugar){
    this.seleccionadoParaConectar=qubit
    this.matriz.hacerAptaParaConectar(qubit,lugar)   
    this.cambiarEstado(3,null); 
  }
  conectarB(qubit,lugar){
    this.matriz.conector(qubit,lugar,this.seleccionadoParaConectar);
    this.cambiarEstado(null,null); 
  }
}
///////////////////////////////INICIO/////////////////////////////
let proof =new Analizador()
console.log(proof.parseComplexList("1,0,2,1-1i,0" , 5,0))
let contenedor = document.getElementById("contenedor");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let capa = document.getElementById("capa");
let ctxCapa = capa.getContext("2d");

let diagramaCodigo = document.getElementById("digramaCodigo");
let codigoDiagrama = document.getElementById("codigoDiagrama");
let codigo = document.getElementById("codigo");

let bX = document.getElementById("X");
let bY = document.getElementById("Y");
let bZ = document.getElementById("Z");
let bH = document.getElementById("H");
let bM = document.getElementById("M");

let bP = document.getElementById("P");
let iP = document.getElementById("iP");

let bC = document.getElementById("C");

let bMas = document.getElementById("+");
let bMenos = document.getElementById("-");

let consola = document.getElementById("consola")
let inputs = document.getElementById("inputs")
let ejecutar = document.getElementById("ejecutar")
let generarTabla = document.getElementById("generarTabla")
let archivo = document.getElementById("archivo")
let generarResultados = document.getElementById("generarResultados")

let descargarCodigo = document.getElementById("descargarCodigo")
let cargarCodigo = document.getElementById("cargarCodigo")
let archivoCodigo = document.getElementById("archivoCodigo")


//let circuto = new Circuito()

let inter = new interfaz(
  contenedor  
  ,canvas, ctx,capa, ctxCapa 
  ,diagramaCodigo,codigoDiagrama,codigo 
  ,bX,bY,bZ,bH, bM ,bP,iP,bC,bMas,bMenos
  ,consola ,inputs, ejecutar 
  , generarTabla , archivo , generarResultados ,
  null
  ,updateLineNumbers,
  descargarCodigo,cargarCodigo,archivoCodigo);


  

