
///////////CLASES:///////////
class Resultado{
    constructor(error,resultado){
      this.error=error;
      this.resultado=resultado;
    }
  }
  class Analizador{
    limite=0;
    constructor(limite){
      this.limite=limite;
    }
    verificarQubits(palabra){
      return palabra=='qbits';
    }
    verificarCompuertaP(palabra){
      return palabra[0]=='P' && this.verificarNumero(palabra.slice(1));
    }
    verificarControl(palabra){
      return palabra[0]=='C' && this.verificarCompuerta(palabra.slice(1))
    }
    verificarCompuerta(palabra){
      return palabra=='X' || palabra=='Y' || palabra=='Z' || palabra=='M' || palabra=='H' || this.verificarCompuertaP(palabra)
    }
    verificarQubit(palabra){
      
      return palabra[0]=='q' && this.verificarNumero(palabra.slice(1));
    }
    verificarNumero(palabra){
      return /^\d+$/.test(palabra);
    }
    
    generarTokensRevisados(codigo){
      let error = [];
      let instrucciones = codigo.split(';');
      for (let i = 0; i < instrucciones.length; i++) {      
        instrucciones[i]=instrucciones[i].trim();
        instrucciones[i]=instrucciones[i].split(' ');
        for (let j = 0; j < instrucciones[i].length; j++) {
          instrucciones[i][j]=instrucciones[i][j].trim();
        }  
      }
      console.log("INSTRUCCIONES desde analizador:")
      
      console.log(instrucciones)
      //////ANALISIS lexico sintactico
      if(!this.verificarQubits(instrucciones[0][0]) || !this.verificarNumero(instrucciones[0][1])){
        error = [
          'Error: El codigo debe empezar con "qbits n;"'
        ]
        console.log("Error desde analizador:")
        console.log(error)
        return new Resultado(error,instrucciones);
      }
      this.limite = instrucciones[0][1]/1
  
      for (let i = 1; i < instrucciones.length; i++) {      
        console.log("INSTRUC:") 
        console.log(instrucciones[i])
        if(instrucciones[i][0]==''){
          continue;
        }
        if( this.verificarCompuerta(instrucciones[i][0])){        
          if(this.verificarQubit(instrucciones[i][1])){
            let q = instrucciones[i][1].slice(1)/1
            console.log("Q : ", q, this.limite)
            if( q >= this.limite){
              console.log("QQQQQQQQQQQqq : ", q)
              error[error.length] = 'Error: Se intenta acceder a un qbit inexistente en el circuilto (q'+q+') en la instruccion '+(i+1);
              console.log("Error desde analizador:")
              console.log(error)
              return new Resultado(error,instrucciones);
            }
            if(instrucciones[i].length!=2){
              error[error.length] = 'Error: Se esperaban solo un qubit en la instruccion '+(i+1);
              console.log("Error desde analizador:")
              console.log(error)
              return new Resultado(error,instrucciones);
            }
          }else{
            error[error.length] = 'Error: se esperaba un qubit (q0, q1,q2...) despues de la compuerta en la instruccion '+(i+1);
            console.log("Error desde analizador:")
            console.log(error)
            return new Resultado(error,instrucciones);
          }
        }else if(this.verificarControl(instrucciones[i][0])){
          for (let j = 1; j < instrucciones[i].length; j++){
            if(this.verificarQubit(instrucciones[i][j])){
              let q = instrucciones[i][j].slice(1)/1
              console.log("Q : ", q, this.limite)
              if( q>= this.limite){
                console.log("QQQQQQQQQQQqq : ", q)
                error[error.length] = 'Error: Se intenta acceder a un qbit inexistente en el circuilto (q'+q+') en la instruccion '+(i+1);
                console.log("Error desde analizador:")
                console.log(error)
                return new Resultado(error,instrucciones);
              }
              if(instrucciones[i].length<=2){
                error[error.length] = 'Error: Se esperaba una lista de minimo de 2 qubits despues de la compuerta controlada en la instruccion '+(i+1);
                console.log("Error desde analizador:")
                console.log(error)
                return new Resultado(error,instrucciones);
              }
            }else{
              error[error.length] = 'Error: se esperaban un qubits validos (q0, q1,q2...) despues de la compuerta controlada en la instruccion '+(i+1);
              console.log("Error desde analizador:")
              console.log(error)
              return new Resultado(error,instrucciones);
            }
          }
        } else{
          error[error.length] = 'Error: se esperaba una compuerta (X,Y,Z,M ...) o compuerta controlada (CX , CY , CZ ....) al inicio de la intruccion '+(i+1);
          console.log("Error desde analizador:")
          console.log(error)
          return new Resultado(error,instrucciones);
        }
      }
  
      return new Resultado(error,instrucciones);
    }
    parseComplexList(input, expectedLength, inputNumber) {
        console.log(input)
        const values = input.split(/\s*,\s*/);
        const result = [];
        if (values.length !== expectedLength) {
            return {
            error: `Error: La entrada ${inputNumber} debe tener ${expectedLength} elementos separados por comas.`,
            result: null
            };
        }
        for (let i = 0; i < values.length; i++) {
            const value = values[i].trim();
            if (value === '1') {
            result.push(math.complex(1, 0));
            } else if (value === '0') {
            result.push(math.complex(0, 0));
            } else {
            try {
                console.log("XXXXXXXXXXXXXXXXXXXXX",value)
                result.push(math.complex(value));
                console.log(math.complex(value))
            } catch (error) {
                return {
                error: `Error: La entrada ${inputNumber} contiene un valor no válido: ${value}.`,
                result: null
                };
            }
            }
        }
        return {
            error: false,
            result
        };
        }
  }