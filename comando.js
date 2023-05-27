////////////////////////////////
class ComandoXYZHP{
    qbit=null;
    circuito=null;
    compuerta='X';
    constructor(qbit,circuito,compuerta){
      this.qbit=qbit;
      this.circuito=circuito;
      this.compuerta=compuerta;
    }
    ejecutar(log){
      if(this.compuerta=='X'){
        this.circuito.entradas[this.qbit]=X(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta=='Y'){
        this.circuito.entradas[this.qbit]=Y(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta=='Z'){
        this.circuito.entradas[this.qbit]=Z(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta=='H'){
        this.circuito.entradas[this.qbit]=H(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta[0]=='P'){
        let fase = this.compuerta.slice(1)/1;
        this.circuito.entradas[this.qbit]=P(this.circuito.entradas[this.qbit],fase);
      }else if(this.compuerta=='M' && log===true){
        this.circuito.interfaz.log("q"+this.qbit+": "+this.circuito.entradas[this.qbit] )
      }
    }
  }
  class ComandoControlXYZHP{
    qbit=null;
    circuito=null;
    compuerta='X';
    controles=null;
    constructor(qbit,circuito,compuerta,controles){
      this.qbit=qbit;
      this.circuito=circuito;
      this.compuerta=compuerta;
      this.controles=controles;
    }
    ejecutar(log){
      let controles =[];
      for (const control of this.controles) {
        controles[controles.length]=this.circuito.entradas[control];
      }
      console.log(this.controles)
      console.log(controles)
      console.log(this.circuito.entradas)
      if(!CONTROL(controles)){
        console.log("FALSO")
        return;
      }
      if(this.compuerta=='X'){
        this.circuito.entradas[this.qbit]=X(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta=='Y'){
        this.circuito.entradas[this.qbit]=Y(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta=='Z'){
        this.circuito.entradas[this.qbit]=Z(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta=='H'){
        this.circuito.entradas[this.qbit]=H(this.circuito.entradas[this.qbit]);
      }else if(this.compuerta[0]=='P'){
        let fase = (this.compuerta.slice(1))/1;
        this.circuito.entradas[this.qbit]=P(this.circuito.entradas[this.qbit],fase);
      }else if(this.compuerta=='M'&& log===true){
        this.circuito.interfaz.log("q"+this.qbit+": "+this.circuito.entradas[this.qbit] )
      }
    }
    
  }
  class Circuito{
    entradas=[];
    comandos=[];
    qubits=0;
    constructor(entradas,interfaz){
      this.setEntradas(entradas);
      this.interfaz = interfaz;
    }
    setEntradas(entradas){
      this.entradas=entradas;
    }
    reiniciarComando(){
      this.comandos=[];
      this.qubits=0;
      this.entradas=[];
    }
    ingresarComando(comando){
      this.comandos[this.comandos.length]=comando;
    }
    ejecutar(log){
      try {
                    
        console.log("COMANDOS: ",this.comandos)
        for (const comando of this.comandos) {
          comando.ejecutar(log);
        } 
      } catch (error) {
        
          this.interfaz.log("ERROR al ejecutar , overflow")
        
      }
      
    }
  
    generar(codigo){    
      //let tok = this.dividirTexto(codigo);
      //console.log("tokens:",tok);
      //let tokken = this.tokkens(tok)
      //console.log("tipos:",tokken);
      ////////////////////////////
      let anali = new Analizador();
      let res = anali.generarTokensRevisados(codigo);
      if(res.error.length){
        console.log("Desde la clase CircuitoMatriz.generar:" );
        console.log(res.error );      
        return res.error;
      }
      let instrucciones = res.resultado;
      console.log("Instrucciones:",instrucciones);
      /////////////////////////////
      for (let i = 0; i < instrucciones.length; i++) {  
        if(1<instrucciones[i].length){
          console.log(instrucciones[i])
          if(instrucciones[i][0]=='qbits'){
            this.qubits = instrucciones[i][1]/1;
            console.log(this.qubits)
          }else if(instrucciones[i][0][0]!='C'){
            let qbit = (instrucciones[i][1].slice(1))/1;
            let op = instrucciones[i][0];
            console.log("PUERTA:",op,qbit);
            this.ingresarComando(new ComandoXYZHP(qbit,this,op));
          }else /*if(instrucciones[i][0][0]=='C')*/{
            let objetivo = (instrucciones[i][1].slice(1))/1;
            let op = instrucciones[i][0].slice(1);
            let controles = instrucciones[i].slice(2);
            for (let j = 0; j < controles.length; j++) {
              controles[j] =  (controles[j].slice(1))/1; 
            }
            console.log("CONTROLES: ",objetivo,op,controles);
            this.ingresarComando(new ComandoControlXYZHP(objetivo,this,op,controles));
          }
        }
      } 
      return false;  
    }  
  
    generarTodasLasEntradas(){
      // Calcular el número de filas en la matriz
      let N = this.qubits;
      const filas = 2 ** N;
        
      // Crear una matriz vacía de tamaño filas x N
      const matriz = new Array(filas).fill(null).map(() => new Array(N).fill(0));
  
      // Iterar sobre todas las filas y columnas de la matriz
      for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < N; col++) {
          // Comprobar si el bit correspondiente en el número de fila es 1 o 0
          if ((fila >> col) & 1) {
            matriz[fila][N-col-1] = 1;
          }
        }
      }
      return matriz;
    }
  }