
////////////////////////////////
class circuitoMatriz{
    estado={
    matriz : [[]],
    qubits : 0 ,
    final : 0,
    finales : []
    }
    /////////////////////////////////
    formato(str) {
      if (str.length < 5) {
        let diff = 5 - str.length;
        let dashes = '-'.repeat(diff);
        return str.concat(dashes);
      } else {
        return str;
      }
    }
    /////////////////////////////////
    constructor(numero){
      this.setQubits(numero);
    }
    ////////////////////////////////
    setEstado(estado){
      this.estado = structuredClone(estado)
    }
    getEstado(){
      return structuredClone(this.estado)
    }
    setQubits(numero){
      this.estado.qubits = numero;
      this.estado.final=0;
      this.estado.matriz=[[]]
      for (let i = 0; i < this.estado.qubits; i++) {     
        this.estado.matriz[i]=['-'];      
        this.estado.finales[i]=0;
      }
      return true;
    }
    aumentarQbit(){
      this.estado.qubits++;
      this.estado.matriz[this.estado.qubits-1]=[]
      for (let i = 0; i <= this.estado.final; i++){
        this.estado.matriz[this.estado.qubits-1][i]='-';
      }
      return true;
    }
    borrarConecciones(){
      for (let i = 0; i <= this.estado.final; i++){
        for (let j = 0; j < this.estado.qubits; j++){
          if(this.estado.matriz[j][i][0]=='C'){
            let objetivo = this.estado.matriz[j][i].slice(1)/1;
            if(!this.esCompuerta(objetivo,i)){
              for (let k = 0; k < this.estado.qubits; k++){
                this.estado.matriz[k][i]='-';
              }
              break;
            }
          }
        }
      }
    }
    decrementarQbit(){
        
      this.estado.qubits--;
      
      this.estado.matriz.pop();
      this.borrarConecciones();
      if(this.estado.qubits==0){
        this.estado.final=0;
        
      }
      return false;
    }
    eliminarQubit(q){
        this.estado.qubits--;      
        this.estado.matriz.splice(q,1);
        this.borrarConecciones();
        if(this.estado.qubits==0){
            this.estado.final=0;            
        }
        return false;
    }
    operador(op,qubit,lugar){
      console.log(op,qubit,lugar)
      if(this.estado.matriz[qubit][lugar]=='-'){
        if(this.lineaConectada(lugar)){
          this.lineaNueva(lugar);
          this.operador(op,qubit,lugar) 
        }
        this.estado.matriz[qubit][lugar]=op;
        if(lugar == this.estado.final){
          this.anadirLinea();
        }
        return true;
      }else if (this.estado.matriz[qubit][lugar]!=undefined){
        this.lineaNueva(lugar);
        this.operador(op,qubit,lugar)      
      }
      return false;
    }
    lineaConectada(lugar){
      for (let j = 0; j < this.estado.qubits; j++){
        if(this.estado.matriz[j][lugar][0]=='C'){
          return true;
        }
      }
      return false;
    }
    lineaNueva(lugar){
      /////TODO verificaciones
      for (let i = 0; i < this.estado.qubits; i++) {     
        this.estado.matriz[i].splice(lugar,0,'-')
      }
      this.estado.final++;
      return true;
    }
    esCompuerta(qubit,linea){
      if(this.estado.matriz[qubit]==undefined){
        return false;
      }
      if(this.estado.matriz[qubit][linea]==undefined){
        return false;
      }
      if(this.estado.matriz[qubit][linea]=='-'){
        return false;
      }
      return this.estado.matriz[qubit][linea][0]!='C';
    }
    lineaAptaParaConectar(linea){
      let c=0;
      for (let i = 0; i < this.estado.qubits; i++) {     
        if(!this.esCompuerta(i,linea)){
          c++;
        }
      }
      return c==(this.estado.qubits-1);
    }
    hacerAptaParaConectar(qubit, lugar){
      if(this.lineaAptaParaConectar(lugar)){
        return false;
      }
      if(!this.esCompuerta(qubit,lugar)){
        return false;
      }
      for (let i = 0; i < this.estado.qubits; i++) {     
        this.estado.matriz[i].splice(lugar,0,'-')
      }
      this.estado.matriz[qubit][lugar]=this.estado.matriz[qubit][lugar+1];
      this.estado.matriz[qubit][lugar+1]='-';
      this.estado.final++;
      return true;
    }
    conector(qubit,lugar,objetivo){    
      if(qubit==objetivo){
        return false;
      }
      if(this.lineaAptaParaConectar(lugar)){
        console.log("linea apta")
        if(this.esCompuerta(objetivo,lugar)){
          this.estado.matriz[qubit][lugar]='C'+objetivo;
          return true;
        }
      }else{  
        this.hacerAptaParaConectar(objetivo,lugar);
        this.conector(qubit,lugar,objetivo)
      }
    }
    borrarElemento(qubit,lugar){
        if(lugar==-1 && qubit >=0){
            this.eliminarQubit(qubit)
            this.borrarConecciones();
            return;
        }
        if(qubit==-1 && lugar >=0){
            this.borrarlinea(lugar)
            this.borrarConecciones();
            return;
        }
      if(this.estado.matriz[qubit]==undefined){
        console.log("111111111")
        return false;
      }
      if(this.estado.matriz[qubit][lugar]==undefined){
        console.log("2222222222")
        return false;
      }
      this.estado.matriz[qubit][lugar]="-";
      this.borrarConecciones();
      return true;
    }
    borrarlinea(linea){    
        if(this.estado.final==0){
            return;
        }
        if(this.estado.final==linea){
            return;
        }
        for (let index = 0; index < this.estado.matriz.length; index++) {
            this.estado.matriz[index].splice(linea,1);     
            this.estado.finales[index]--;
        }
        this.estado.final--;

    }
    lineaVacia(linea){
      for (let i = 0; i < this.estado.qubits; i++) {     
        if(this.estado.matriz[i][linea]!='-' ){
          return false;
        }
      }
      return true;
    }
    anadirLinea(){
      for (let i = 0; i < this.estado.qubits; i++) {     
        this.estado.matriz[i][this.estado.final+1]='-';
      }
      this.estado.final++;
      return true;
    }
    quitarLinea(){
      for (let i = 0; i < this.estado.qubits; i++) {     
        this.estado.matriz[i].pop()
      }
      this.estado.final--;
      return true;
    }
    mostrar(){
      let salida='MATRIZ:\n';
      for (let i = 0; i < this.estado.qubits; i++) {    
        for (let j = 0; j <= this.estado.final; j++){
          salida=salida+this.formato(this.estado.matriz[i][j]);
        } 
        salida=salida+'\n'
      }
      console.log(salida);
    }  
    generar(codigo){    
      let anali = new Analizador();
      let res = anali.generarTokensRevisados(codigo);
      if(res.error.length){
        console.log("Desde la clase CircuitoMatriz.generar:" );
        console.log(res.error );      
        return res.error;
      }
      let instrucciones = res.resultado;
      console.log(instrucciones);
      for (let i = 0; i < instrucciones.length; i++) {  
        if(1<instrucciones[i].length){
          if(instrucciones[i][0]=='qbits'){
            this.setQubits(instrucciones[i][1]/1);
          }else if(instrucciones[i][0][0]!='C'){
            let qbit = (instrucciones[i][1].slice(1))/1;
            let lugar = this.estado.finales[qbit];
            let op = instrucciones[i][0];
            this.estado.finales[qbit]++;
            console.log("PUERTA:",op,qbit,lugar);
            this.operador(op,qbit,lugar);
          }else if(instrucciones[i][0][0]=='C'){
            let objetivo = (instrucciones[i][1].slice(1))/1;
            let lugar = this.estado.final;
            let op = instrucciones[i][0].slice(1);
            let controles = instrucciones[i].slice(2);
            this.operador(op,objetivo,lugar);
            for (let j = 0; j < controles.length; j++) {
              let q =  (controles[j].slice(1))/1; 
              console.log("C:",q,lugar,objetivo); 
              this.conector(q,lugar,objetivo); 
            }
            for (let index = 0; index < this.estado.finales.length; index++) {
              this.estado.finales[index]= this.estado.final;
              
            }
            //console.log(objetivo,lugar,op,controles);
           
          }
        }
      }  
      return false; 
    }
    generarCodigo(){
      let codigo = "qbits "+this.estado.qubits+";\n";
      for (let i = 0; i <= this.estado.final; i++) {
        //Verificar conecciones:
        let noHayConecciones = true;
        for (let j = 0; j < this.estado.qubits; j++) {
          if(this.estado.matriz[j][i][0]=='C'){
            noHayConecciones = false;
            break;
          }
        }
        if(noHayConecciones){
          for (let j = 0; j < this.estado.qubits; j++) {
            if(this.estado.matriz[j][i][0]!='-'){
              codigo = codigo+this.estado.matriz[j][i]+" "+"q"+j+";\n";
            }
          }
        }else{
          let conecciones=[]
          let objetivo=-1
          let operador = ""
          for (let j = 0; j < this.estado.qubits; j++) {
            if(this.estado.matriz[j][i][0]=='C'){
              objetivo = this.estado.matriz[j][i].slice(1)/1
              conecciones.push(j);
            }else if(this.estado.matriz[j][i][0]!='-'){            
              operador= this.estado.matriz[j][i]
            }       
          }
          codigo = codigo+"C"+operador+" "+"q"+objetivo+"";
          for (let index = 0; index < conecciones.length; index++) {
            codigo=codigo+" q"+conecciones[index]+"";          
          }
          codigo=codigo+";\n";
        }
        //      
      }
      return codigo;
    }
  }