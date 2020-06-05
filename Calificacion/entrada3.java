/*
LA CLASE DE ERRORES ESTA DESTINADA A PONER A PRUEBA LA FORMA EN
LA QUE EL ESTUDIANTE SE RECUPERA DE ERRORES LEXICO Y SINTACTICOS
CADA ERROR TIENE UN PUNTEO DE 1 PUNTO SI EL ESTUDIANTE LOGRA RECUPERARSE
Y MOSTRAR EL ERROR, DE LO CONTRARIO TIENE CERO SI NO LOGRA RECUPERARSE.

EL ARCHIVO CUENTA CON 5 ERRORES QUE EQUIVALEN A LOS 5 PUNTOS DE ESTE ARCHIVO.

*/


class errores_lexicos_sintacticos {




  //primer error lexico
  ²




  //segundo error lexico
  ╤





  //primer error sintactico
  int fibonacci(int n) {
    if ( n > 1 ){
      return fibonacci( n - 1 ) + fibonacci( n - 2 )  //falta el punto y coma
    }
    else if ( n == 1 ) {
      return 1 //falta punto y coma
    }
  }





  //segundo error sintactico
  int factorial_forma_1(int numero){
    int factorial = 0;

    while ( numero != 0 ) //falta la llave que abre
      factorial = factorial * numero;
      numero = numero - 1;
    }

    return factorial;
  }




  //tercer error sintactico
  ackerman(int int, double double) {  //recuperacion de palabras reservadas
    return ackerman(m – 1, ackerman(m, n – 1)) //falta punto y coma
  }



}
