//FUNCIONES BASICAS:
///PAULIX
function X(a) {
    let real = a.re; // Separa la parte real del qubit
    let imag = a.im; // Separa la parte imaginaria del qubit 
    if (real !== 0) { // Compara si la parte real del qubit es diferente de 0 por si entra -1
      real = 0; // Hace la operacion del qubit en caso de que entre un 1 o -1
    } else if (real === 0) { // Compara si la parte real del qubit es igual a 0
      real = 1; // Si entra un 0 lo cambia a 1
    }
    a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
    return a;
  }
  ///PAULIY
  function Y(a) {
    let real = a.re; // Separa la parte real del qubit
    let imag = a.im; // Separa la parte imaginaria del qubit
    if (real === 0 && imag === 0) { // Si la parte real es 0 y la imaginaria es 0
      real = 1; // La parte real es 1
      imag = 1; // La parte imaginaria es 0
    } else if (real === 0 && imag !== 0) { // Si la parte real es 0 y la imaginaria es diferente de 0
      real = 1; // La parte real es 1
    } else if (real !== 0 && imag === 0) { // Si la parte real es diferente de 0 (por si entra -1) y la imaginaria es 0
      real = 0; // La parte real es 0
      imag = -1; // El imaginario es -1
    } else if (real !== 0 && imag !== 0) { // Si la parte real es diferente de 0 (por si entra -1) y la imaginaria es diferente de 0
      real = 0; // La parte real es 0
      imag = math.multiply(imag, -1); // El imaginario se multiplica por -1
    }
    a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
    return a;
  }
  ///PAULIZ
  function Z(a) {
    let real = a.re; // Separa la parte real del qubit
    let imag = a.im; // Separa la parte imaginaria del qubit
    if (real === 0) { // Si la parte real es 0
      real = 0; // La parte real sera 0
    } else if (real !== 0) { // Si la parte real es diferente a 1
      real = math.multiply(real, -1); // La parte real cambirara de signo al multiplicarla por -1
    }
    a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
    return a;
  }
  // Cambio de fase
  function P(a, angulo) {
    let real = a.re; // Obtiene la parte real del qubit
    if (real == 0) { // Si el valor del qubit es igual a 0
      real = 0; // El valor del qubit se mantiene en 0
    } else if (real != 0) { // Si el valor del qubit es diferente de 0 se calculará el valor del qubit con el cambio de fase
      let radang = math.unit(angulo, 'deg').toNumber('rad'); // Convertimos de ángulo a radianes
      let fase = math.multiply(math.cos(radang), math.complex(0, math.sin(radang))); // Se calcula la fase utilizando la formula de Euler
      a = math.multiply(a, fase);
    }
    return a;
  }
  // Hadamard
  function H(a) {
    let real = a.re; // Obtiene la parte real del qubit
    let imag = a.im; // Obtiene la parte imaginaria del qubit
    if (real == 0) { // Si el valor del qubit es igual a 0
      real = 1 / math.sqrt(2); // El valor del qubit 1/la raiz de 2
    } else if (real != 0) { // Si el valor del qubit es diferente de 0
      real = -1 / math.sqrt(2); // El valor del qubit 1/la raiz de 2
    }
    a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
    return a;
  }
  /////CONTROL/////
  function CONTROL(entradas){
    for (const entrada of entradas) {
      console.log("XXX:",entrada)
      if(entrada.re == 0){
        return false;
      }  
    }
    return true;
  }
  ///////////////////
  function print(numero){
    if (typeof numero === 'object' && numero.re != null && numero.im != null) {
        console.log(numero.re + (numero.im >= 0 ? '+' : '') + numero.im + 'j');
    } else {
      console.log(numero);
    }
  }
  function complejo(numero){
    return `(${numero.re}${(numero.im>=0)?'+':''}${numero.im}i)`
  }
  function complejos(numeros){
    let r = ''
    for (let index = 0; index < numeros.length; index++) {
      
      r=r+complejo( numeros[index])+"  ";
    }
    return r
  }
  