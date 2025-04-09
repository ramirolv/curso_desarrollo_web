/*
Declaración de variables
*/
var numero = "15";
let numero2 = 120;
const numero3 = 10;

/*
Operaciones aritméticas
*/
let suma = numero + numero2;
let suma2 = numero2 + numero3;
let resta = numero2 - numero3;
let resta2 = numero - numero2;
let multiplicacion = numero2 * numero3;
let multiplicacion2 = numero * numero2;
let division = numero2 / numero3;


/*
Operadores comparación
*/
numero2 = 10;
let igual = numero2 == numero3;
let mayor_que = numero2 > numero3;
let menor_que = numero2 < numero3;
let var3 = numero2 <= numero3;
let var4 = numero2 >= numero3;
let diferencia = numero2 != numero3;

/*
Estructuras de control
*/

let edad = 18;
// Condiciales
if (edad == 100) {
    console.log('Felicidades, estás viejito');
}else if(edad >= 18){
    console.log('La persona es mayor de edad');
}else{
    console.log('La persona es menor de edad');
}

// Ciclos
for (let contador = 1; contador <= 5; contador++) {
    console.log('Bienvenido, iteracion: '+contador);
}

let contador = 1;

while (contador <= 5){
    console.log('Adios, iteracion: '+contador);
    contador++;
}

/*
Funciones
*/
function sumarNumeros(n1, n2){
    let suma = n1 + n2;
    return suma;
}

console.log(sumarNumeros(5, 10));
console.log(sumarNumeros(20, 10));
console.log(sumarNumeros(50, 10));
console.log(sumarNumeros(1200, 10));

alert('Bienvenidos a la página');
alert('Bienvenido Boris');
alert('El resultado de la suma es: ' + sumarNumeros(18273, 82736));