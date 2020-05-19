
%{
    const {Nodo_Arbol} = require('../NodoArbol/Nodo_Arbol');
    let CNodo_Error = require('../Reportes/Nodo_Error');
    let CError = require('../Reportes/Errores');
    let count = 0;
%}



%lex

%options case-sensitive

%%


[ \r\t]+            {}
\n                  {}

"//".*   {};

[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]    {};

"int"                   return 'int';
"double"                return 'double';
"boolean"               return 'boolean';
"char"                  return 'char';
"String"                return 'string';


"if"                    return 'if';
"else"                  return 'else';
"switch"                return 'switch';
"case"                  return 'case';
"while"                 return 'while';
"do"                    return 'do';
"for"                   return 'for';
"void"                  return 'void';
"return"                return 'return';
"break"                 return 'break';
"main"                  return 'main';
"continue"              return'continue';
"System.out.println"    return'soutln';
"System.out.print"      return'sout';


"import"                return'import';
"class"                 return'class';
"true"                  return'true';
"false"                 return'false';
"default"               return'default';

"{"                     return 'lizquierdo';
"}"                     return 'lderecho';
";"                     return 'puntocoma';
"("                     return 'pizquierdo';
")"                     return 'pderecho';
"["                     return 'cizquierdo';
"]"                     return 'cderecho';
","                     return 'coma';
":"                     return 'dospuntos';

"&&"                    return 'and';
"||"                    return 'or';
"!="                    return 'distinto';
"=="                    return 'igualdad';
">="                    return 'mayorigualque';
"<="                    return 'menorigualque';
">"                     return 'mayorque';
"<"                     return 'menorque';


"="                     return 'igual';


"!"                     return 'not';


"+"                     return 'mas';
"-"                     return 'menos';
"*"                     return 'por';
"/"                     return 'dividido';
"%"                     return 'modulo';
"^"                     return 'potencia';

[0-9]+("."[0-9]+)       return 'decimal';

[0-9]+\b                return 'entero';




(\"[^"]*\")             return 'cadena';
(\'[^']\')              return'caracter';



([a-zA-Z]|[_])[a-zA-Z0-9_]* return 'IDENTIFICADOR';



<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

%left or
%left and
%left igualdad, distinto
%left mayorigualque, menorigualque, menorque, mayorque
%left mas, menos
%left por, dividido, modulo
%left potencia
%right not
%left UMENOS

%start INICIO
%% 

INICIO : IMPORTSYCLASES EOF {$$=$1; return $$;}
        | error { CError.Errores.add(new CNodo_Error.NodoError("Error Sintáctico","No se esperaba el caracter: "+ yytext, this._$.first_line)) }
;

PANIC:  puntocoma
      | lderecho
      | error { console.error('Este es un error sintáctico : ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
      ;


INSTRUCCIONES : INSTRUCCIONES INSTRUCCION
              | INSTRUCCION
              ;

INSTRUCCION : PRINT
            | IF2
            | WHILE2
            | FOR2
            | DO2
            | SWITCH2
            | CLASE2
            | PANIC  INSTRUCCION { console.error('Este es un error sintáctico estado INSTRUCCION: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); $$ = new Nodo_Arbol("Error", $1,  count++);}
;


INSTRUCCIONESCLASE : INSTRUCCIONESCLASE INSTRUCCIONCLASE
              | INSTRUCCIONCLASE
              ;

INSTRUCCIONCLASE : CLASE2
;

INICIO2: IMPORTSYCLASES {$$= new Nodo_Arbol("Raiz","Raiz",count++);$$.lista_Nodo.push($1)}
         | PANIC  INICIO2 { console.error('Este es un error sintáctico estado IMPORTSYCLASES: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); $$ = new Nodo_Arbol("Error", $1,  count++);}
    ;

IMPORTSYCLASES: IMPORT2 CLASE2 {$$=new Nodo_Arbol("Raiz","Raiz",count++); $$.encontrarNode($1);$$.encontrarNode($2);}
            |CLASE2 {$$ = new Nodo_Arbol("Raiz","Raiz",count++); $$.encontrarNode($1);}
            ;

IMPORT2: IMPORT2 import IDENTIFICADOR puntocoma {$$=$1;$$.push(new Nodo_Arbol("Import",$2+" "+$3,count++))}
        |import IDENTIFICADOR puntocoma {$$=[];$$.push(new Nodo_Arbol("Import",$1+" "+$2,count++))}
        ;

INSTRUCCIONESDENTROCLASE : INSTRUCCIONESDENTROCLASE INSTRUCCIONDENTROCLASE {$$=$1;$$.push($2)}
              | INSTRUCCIONDENTROCLASE   {$$=[];$$.push($1)}
              ;

INSTRUCCIONDENTROCLASE : METODO2 {$$ = $1}
            | FUNCION2 {$$ = $1}
            | DECLARACION {$$ = $1}
;

INSTRUCCIONESMETODO : INSTRUCCIONESMETODO INSTRUCCIONMETODO {$$=$1;$$.push($2)}
              | INSTRUCCIONMETODO   {$$=[];$$.push($1)}
              ;

INSTRUCCIONMETODO : PRINT {$$ = $1}
            | IFM {$$ = $1}
            | WHILEM {$$ = $1}
            | FORM {$$ = $1}
            | DOM {$$ = $1}
            | SWITCHM {$$ = $1}
            | DECLARACION {$$ = $1}
            | ASIGNACION {$$ = $1}
            | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1,count++); $$.encontrarNode($3)}
            | return EXPRESION puntocoma {$$ = new Nodo_Arbol("Sentencia",$1,count++);}
;

INSTRUCCIONESFUNCION : INSTRUCCIONESFUNCION INSTRUCCIONFUNCION {$$=$1;$$.push($2)}
              | INSTRUCCIONFUNCION {$$=[];$$.push($1)}
              ;

INSTRUCCIONFUNCION : PRINT {$$ = $1}
            | IF2 {$$ = $1}
            | WHILE2 {$$ = $1}
            | FOR2 {$$ = $1}
            | DO2 {$$ = $1}
            | SWITCH2 {$$ = $1}
            | DECLARACION {$$ = $1}
            | ASIGNACION {$$ = $1}
            | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1,count++); $$.encontrarNode($3)}

;

INSTRUCCIONESIF: INSTRUCCIONESIF INSTRUCCIONIF {$$=$1;$$.push($2)}
                |INSTRUCCIONIF {$$=[];$$.push($1)}
                ;

INSTRUCCIONIF: PRINT {$$ = $1}
            | IF2 {$$ = $1}
            | WHILE2 {$$ = $1}
            | FOR2 {$$ = $1}
            | DO2 {$$ = $1}
            | SWITCH2 {$$ = $1}
            | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma  {$$ = new Nodo_Arbol("Sentencia", $1,count++); $$.encontrarNode($3)}
            | DECLARACION {$$ = $1}
            | ASIGNACION {$$ = $1}
            | break puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            | return EXPRESION puntocoma { $$ = new Nodo_Arbol("Sentencia", $1,count++);$$.lista_Nodo.push($2);}
            ;

INSTRUCCIONESFOR: INSTRUCCIONESFOR INSTRUCCIONFOR {$$=$1;$$.push($2)}
                |INSTRUCCIONFOR {$$=[];$$.push($1)}
                ;

INSTRUCCIONFOR: PRINT {$$ = $1}
            | IF2 {$$ = $1}
            | WHILE2 {$$ = $1}
            | FOR2 {$$ = $1}
            | DO2 {$$ = $1}
            | SWITCH2 {$$ = $1}
            | break puntocoma { $$ = new Nodo_Arbol("Sentencia", $1,count++);}
            | continue puntocoma { $$ = new Nodo_Arbol("Sentencia", $1,count++);}
            | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1,count++); $$.encontrarNode($3)}
            | DECLARACION {$$ = $1}
            | ASIGNACION {$$ = $1}
            | return EXPRESION puntocoma { $$ = new Nodo_Arbol("Sentencia", $1,count++);$$.lista_Nodo.push($2);}
            ;


INSTRUCCIONESSWITCH: INSTRUCCIONESSWITCH INSTRUCCIONSWITCH {$$=$1;$$.push($2)}
                |INSTRUCCIONSWITCH {$$=[];$$.push($1)}
                ;

INSTRUCCIONSWITCH: PRINT {$$ = $1}
            | IF2 {$$ = $1}
            | WHILE2  {$$ = $1}
            | FOR2 {$$ = $1}
            | DO2 {$$ = $1}
            | SWITCH2 {$$ = $1}
            | break puntocoma { $$ = new Nodo_Arbol("Sentencia", $1,count++);}
            |IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1,count++); $$.encontrarNode($3)}
            |DECLARACION {$$ = $1}
            |ASIGNACION {$$ = $1}
            |return EXPRESION puntocoma { $$ = new Nodo_Arbol("Sentencia", $1,count++);$$.lista_Nodo.push($2);}
            ;

LISTAEXPRESION: LISTAEXPRESION coma EXPRESION  {$$=$1;$$.push($3)}
                |EXPRESION {$$=[];$$.push($1)}
                ;


FUNCION2: TIPO IDENTIFICADOR pizquierdo PARAMETROS pderecho BLOQUE_INSTRUCCIONESFUNCION {$$=new Nodo_Arbol("Funcion",$1+" "+$2, count++);$$.encontrarNode($4);if($6!=null){$$.encontrarNode($6)};}
        | TIPO IDENTIFICADOR pizquierdo  pderecho BLOQUE_INSTRUCCIONESFUNCION {$$=new Nodo_Arbol("Funcion",$1+" "+$2, count++);if($5!=null){$$.encontrarNode($5)};}

    ;

METODO2 : void IDENTIFICADOR pizquierdo PARAMETROS pderecho BLOQUE_INSTRUCCIONESMETODO {$$=new Nodo_Arbol("Metodo",$1+" "+$2,count++);$$.encontrarNode($4);if($6!=null){$$.encontrarNode($6)};}
        | void IDENTIFICADOR pizquierdo  pderecho BLOQUE_INSTRUCCIONESMETODO {$$=new Nodo_Arbol("Metodo",$1+" "+$2,count++);if($5!=null){$$.encontrarNode($5)};}
        | void main pizquierdo pderecho BLOQUE_INSTRUCCIONESMETODO {$$=new Nodo_Arbol("Main",$1+" "+$2,count++);if($5!=null){$$.encontrarNode($5)};}
    ;

CLASE2 : CLASE2 class IDENTIFICADOR BLOQUE_INSTRUCCIONESCLASE { $$= $1; let y = new Nodo_Arbol("Clase", $2+" "+$3, count++);  if($4!=null){y.encontrarNode($4)}; $$.push(y); }
       | class IDENTIFICADOR BLOQUE_INSTRUCCIONESCLASE { $$ = [] ; let x = new Nodo_Arbol("Clase", $1+" "+$2, count++);if($3!=null){x.encontrarNode($3)}; $$.push(x);}
    ;

SWITCH2 : switch  CONDICION lizquierdo CASE2 lderecho {$$=new Nodo_Arbol("Sentencia",$1, count++);$$.lista_Nodo.push($2);$$.encontrarNode($4);}
        | switch CONDICION lizquierdo CASE2 DEFAULT2 lderecho {$$=new Nodo_Arbol("Sentencia",$1, count++);$$.lista_Nodo.push($2);$$.encontrarNode($4);$$.lista_Nodo.push($5);}
    ;

CASE2: CASE2 case EXPRESION dospuntos INSTRUCCIONESSWITCH {$$=$1;$$.push(new Nodo_Arbol("Sentencia",$2, count++));$$[$$.length-1].lista_Nodo.push($3);if($5!=null){$$[$$.length-1].encontrarNode($5)};}
    |case EXPRESION dospuntos INSTRUCCIONESSWITCH {$$=[];$$.push(new Nodo_Arbol("Sentencia",$1, count++));$$[0].lista_Nodo.push($2);if($4!=null){$$[0].encontrarNode($4)} ;}
    ;

DEFAULT2:  default dospuntos  INSTRUCCIONESSWITCH {$$=new Nodo_Arbol("Sentencia",$1, count++);if($3!=null){$$.encontrarNode($3)};}
    ;

DO2 : do BLOQUE_INSTRUCCIONESFOR while CONDICION puntocoma {$$=new Nodo_Arbol("Sentencia",$1+$3, count++);if($2!=null){$$.encontrarNode($2)};$$.lista_Nodo.push($4);}
    ;

FOR2 : for pizquierdo DECLARACION EXPRESION puntocoma CONDICIONFOR pderecho BLOQUE_INSTRUCCIONESFOR {$$=new Nodo_Arbol("Sentencia",$1, count++); $$.lista_Nodo.push($3);$$.lista_Nodo.push($4);$$.lista_Nodo.push($6);if($8!=null){$$.encontrarNode($8)};}
     | for pizquierdo ASIGNACION EXPRESION puntocoma CONDICIONFOR pderecho BLOQUE_INSTRUCCIONESFOR  {$$=new Nodo_Arbol("Sentencia",$1, count++); $$.lista_Nodo.push($3);$$.lista_Nodo.push($4);$$.llista_NodoistaIns.push($6);if($8!=null){$$.encontrarNode($8)};}
    ;


CONDICIONFOR : IDENTIFICADOR mas mas {$$ = new Nodo_Arbol("Asignacion",$1, count++); $$.lista_Nodo.push(new Nodo_Arbol("Incremento",$2+$3, count++));}
     | IDENTIFICADOR menos menos {$$ = new Nodo_Arbol("Asignacion",$1, count++); $$.lista_Nodo.push(new Nodo_Arbol("Decremento",$2+$3, count++));}
;

TIPO : string {$$ = $1;}
     | boolean {$$ = $1;}
     | char {$$ = $1;}
     | double {$$ = $1;}
     | int {$$ = $1;}
     ;

DECLARACION : TIPO LISTAID igual EXPRESION puntocoma {$$=new Nodo_Arbol("Declaracion",$1, count++); $$.encontrarNode($2);$$.lista_Nodo.push($4);}
            | TIPO LISTAID puntocoma {$$=new Nodo_Arbol("Declaracion",$1, count++); $$.encontrarNode($2);}
            |
            ;


LISTAID: LISTAID coma IDENTIFICADOR {$$=$1;$$.push(new Nodo_Arbol("Variable",$3, count++));}
        |IDENTIFICADOR {$$=[];$$.push(new Nodo_Arbol("Variable",$1, count++));}
        ;


ASIGNACION : IDENTIFICADOR igual EXPRESION puntocoma {$$=new Nodo_Arbol("Asignacion",$1, count++); $$.lista_Nodo.push($3);}
            | IDENTIFICADOR mas mas puntocoma {$$ = new Nodo_Arbol("Asignacion",$1, count++); $$.lista_Nodo.push(new Nodo_Arbol("Incremento",$2+$3, count++));}
            | IDENTIFICADOR menos menos puntocoma {$$ = new Nodo_Arbol("Asignacion",$1, count++); $$.lista_Nodo.push(new Nodo_Arbol("Decremento",$2+$3, count++));}
    ;

WHILE2 : while CONDICION BLOQUE_INSTRUCCIONESFOR { $$ = new Nodo_Arbol("Sentencia", $1, count++);$$.lista_Nodo.push($2); if($3!=null){$$.encontrarNode($3)};}
      ;

IF2 : if CONDICION BLOQUE_INSTRUCCIONESIF { $$ = new Nodo_Arbol("Sentencia", $1, count++);$$.lista_Nodo.push($2); if($3!=null){$$.encontrarNode($3)};}
   | if CONDICION BLOQUE_INSTRUCCIONESIF ELSE2 { $$ = new Nodo_Arbol("Sentencia", $1, count++);$$.lista_Nodo.push($2); if($3!=null){$$.encontrarNode($3)};$$.lista_Nodo.push($4);}
   ;

ELSE2: else BLOQUE_INSTRUCCIONESIF { $$ = new Nodo_Arbol("Sentencia", $1, count++); if($2!=null){$$.encontrarNode($2)};}
     |else IF2 { $$ = $2;}
    ;

CONDICION : pizquierdo EXPRESION pderecho { $$ = $2;}
          ;


BLOQUE_INSTRUCCIONES : lizquierdo INSTRUCCIONES lderecho
                     | lizquierdo lderecho
                     ;

BLOQUE_INSTRUCCIONESIF : lizquierdo INSTRUCCIONESIF lderecho {$$=$2}
                     | lizquierdo lderecho {$$=null;}
                     ;

BLOQUE_INSTRUCCIONESFOR : lizquierdo INSTRUCCIONESFOR lderecho  {$$=$2}
                     | lizquierdo lderecho {$$=null;}
                     ;


BLOQUE_INSTRUCCIONESCLASE : lizquierdo INSTRUCCIONESDENTROCLASE lderecho {$$=$2}
                     | lizquierdo lderecho {$$=null;}
                     ;

BLOQUE_INSTRUCCIONESMETODO : lizquierdo INSTRUCCIONESMETODO lderecho {$$=$2}
                     | lizquierdo lderecho {$$=null;}
                     ;

BLOQUE_INSTRUCCIONESFUNCION : lizquierdo INSTRUCCIONESFUNCION return EXPRESION puntocoma lderecho {$$=$2;$$.push(new Nodo_Arbol("Sentencia",$3,count++));$$[$$.length-1].lista_Nodo.push($4);}
                     | lizquierdo INSTRUCCIONESFUNCION lderecho {$$=$2}
                     | lizquierdo return EXPRESION puntocoma lderecho {$$=[]; $$.push(new Nodo_Arbol("Sentencia",$2, count++));$$[0].lista_Nodo.push($3);}
                     ;

PRINT : sout pizquierdo EXPRESION pderecho puntocoma { $$ = new Nodo_Arbol("Imprimir", $1, count++);$$.lista_Nodo.push($3);}
    | soutln pizquierdo EXPRESION pderecho puntocoma { $$ = new Nodo_Arbol("Imprimir", $1, count++);$$.lista_Nodo.push($3);}
      ;

PARAMETROS : PARAMETROS coma TIPO IDENTIFICADOR {$$=$1;$$.push(new Nodo_Arbol("Parametros",$3+" "+$4, count++));}
        | TIPO IDENTIFICADOR {$$=[];$$.push(new Nodo_Arbol("Parametros",$1+" "+$2, count++));}
        ;

IFM:if CONDICION BLOQUE_INSTRUCCIONESIFM { $$ = new Nodo_Arbol("Sentencia", $1, count++);$$.lista_Nodo.push($2); if($3!=null){$$.encontrarNode($3)};}
   | if CONDICION BLOQUE_INSTRUCCIONESIFM ELSEM { $$ = new Nodo_Arbol("Sentencia", $1, count++);$$.lista_Nodo.push($2); if($3!=null){$$.encontrarNode($3)};$$.lista_Nodo.push($4);}
   ;


ELSEM: else BLOQUE_INSTRUCCIONESIFM { $$ = new Nodo_Arbol("Sentencia", $1, count++); if($2!=null){$$.encontrarNode($2)};}
    |else IFM { $$ = $2;}
;

INSTRUCCIONESIFM: INSTRUCCIONESIFM INSTRUCCIONIFM {$$=$1;$$.push($2)}
                |INSTRUCCIONIFM {$$=[];$$.push($1)}
                ;

INSTRUCCIONIFM: PRINT {$$ = $1}
            | IFM {$$=$1}
            | WHILEM {$$=$1}
            | FORM  {$$=$1}
            | DOM   {$$=$1}
            | SWITCHM  {$$=$1}
            | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1, count++); $$.encontrarNode($3)}
            | DECLARACION {$$=$1}
            | ASIGNACION {$$=$1}
            | break puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            | return EXPRESION puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            ;

BLOQUE_INSTRUCCIONESIFM : lizquierdo INSTRUCCIONESIFM lderecho {$$=$2}
                     | lizquierdo lderecho {$$=null;}
                     ;


WHILEM : while CONDICION BLOQUE_INSTRUCCIONESFORM { $$ = new Nodo_Arbol("Sentencia", $1, count++);$$.lista_Nodo.push($2); if($3!=null){$$.encontrarNode($3)};}
      ;


BLOQUE_INSTRUCCIONESFORM : lizquierdo INSTRUCCIONESFORM lderecho {$$=$2}
                     | lizquierdo lderecho {$$=null;}
                     ;

INSTRUCCIONESFORM: INSTRUCCIONESFORM INSTRUCCIONFORM {$$=$1;$$.push($2)}
                |INSTRUCCIONFORM {$$=[];$$.push($1)}
                ;

INSTRUCCIONFORM: PRINT {$$ = $1}
            | IFM {$$ = $1}
            | WHILEM {$$ = $1}
            | FORM {$$ = $1}
            | DOM {$$ = $1}
            | SWITCHM {$$ = $1}
            | break puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            | continue puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1, count++); $$.encontrarNode($3)}
            | DECLARACION {$$ = $1}
            | ASIGNACION {$$ = $1}
            | return EXPRESION puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            ;

FORM : for pizquierdo DECLARACION EXPRESION puntocoma CONDICIONFOR pderecho BLOQUE_INSTRUCCIONESFORM {$$=new Nodo_Arbol("Sentencia",$1, count++); $$.lista_Nodo.push($3);$$.lista_Nodo.push($4);$$.lista_Nodo.push($6);if($8!=null){$$.encontrarNode($8)};}
     | for pizquierdo ASIGNACION EXPRESION puntocoma CONDICIONFOR pderecho BLOQUE_INSTRUCCIONESFORM {$$=new Nodo_Arbol("Sentencia",$1, count++); $$.lista_Nodo.push($3);$$.lista_Nodo.push($4);$$.lista_Nodo.push($6);if($8!=null){$$.encontrarNode($8)};}
    ;

DOM : do BLOQUE_INSTRUCCIONESFORM while CONDICION puntocoma {$$=new Nodo_Arbol("Sentencia",$1+$3, count++);if($2!=null){$$.encontrarNode($2)};$$.lista_Nodo.push($4);}
    ;


SWITCHM : switch  CONDICION lizquierdo CASEM lderecho {$$=new Nodo_Arbol("Sentencia",$1, count++);$$.lista_Nodo.push($2);$$.encontrarNode($4);}
        | switch CONDICION lizquierdo CASEM DEFAULTM lderecho {$$=new Nodo_Arbol("Sentencia",$1, count++);$$.lista_Nodo.push($2);$$.encontrarNode($4);$$.lista_Nodo.push($5);}
    ;

CASEM: CASEM case EXPRESION dospuntos INSTRUCCIONESSWITCHM {$$=$1;$$.push(new Nodo_Arbol("Sentencia",$2, count++));$$[$$.length-1].lista_Nodo.push($3);if($5!=null){$$[$$.length-1].encontrarNode($5)};}
    |case EXPRESION dospuntos INSTRUCCIONESSWITCHM {$$=[];$$.push(new Nodo_Arbol("Sentencia",$1, count++));$$[0].encontrarNode.push($2);if($4!=null){$$[0].encontrarNode($4)} ;}
    ;


DEFAULTM:  default dospuntos  INSTRUCCIONESSWITCHM {$$=new Nodo_Arbol("Sentencia",$1, count++);if($3!=null){$$.encontrarNode($3)};}
    ;

INSTRUCCIONESSWITCHM: INSTRUCCIONESSWITCHM INSTRUCCIONSWITCHM {$$=$1;$$.push($2)}
                |INSTRUCCIONSWITCHM {$$=[];$$.push($1)}
                ;

INSTRUCCIONSWITCHM: PRINT {$$ = $1}
            | IFM {$$ = $1}
            | WHILEM  {$$ = $1}
            | FORM {$$ = $1}
            | DOM {$$ = $1}
            | SWITCHM {$$ = $1}
            | break puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            |IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho puntocoma {$$ = new Nodo_Arbol("Sentencia", $1, count++); $$.encontrarNode($3)}
            |DECLARACION {$$ = $1}
            |ASIGNACION {$$ = $1}
            |return EXPRESION puntocoma { $$ = new Nodo_Arbol("Sentencia", $1, count++);}
            ;


EXPRESION : menos EXPRESION %prec UMENOS
          | not EXPRESION	          { $$ = new Nodo_Arbol("Relacional", $1, count++);$$.lista_Nodo.push($2);}
          | EXPRESION mas EXPRESION	     {$$= new Nodo_Arbol("Artimetica",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION menos EXPRESION     {$$= new Nodo_Arbol("Artimetica",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION por EXPRESION		    {$$= new Nodo_Arbol("Artimetica",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION dividido EXPRESION	 {$$= new Nodo_Arbol("Artimetica",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION menorque EXPRESION	 {$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION mayorque EXPRESION	{$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION mayorigualque EXPRESION	 {$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION menorigualque EXPRESION	  {$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION igualdad EXPRESION	{$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION distinto EXPRESION	{$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION or EXPRESION	    {$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION and EXPRESION	   {$$= new Nodo_Arbol("Relacional",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION potencia EXPRESION	{$$= new Nodo_Arbol("Artimetica",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | EXPRESION modulo EXPRESION	  {$$= new Nodo_Arbol("Artimetica",$2, count++);$$.lista_Nodo.push($1);$$.lista_Nodo.push($3);}
          | decimal   { $$ = new Nodo_Arbol("Primitivo", $1, count++);}
          | entero	  { $$ = new Nodo_Arbol("Primitivo", $1, count++);}
          | true	  { $$ = new Nodo_Arbol("Primitivo", $1, count++);}
          | false	  { $$ = new Nodo_Arbol("Primitivo", $1,  count++);}
          | cadena    { $$ = new Nodo_Arbol("Primitivo", $1,  count++);}
          | caracter  { $$ = new Nodo_Arbol("Primitivo", $1,  count++);}
          | IDENTIFICADOR pizquierdo LISTAEXPRESION pderecho 	{$$ = new Nodo_Arbol("Variable", $1, count++); $$.encontrarNode($3)}
          | IDENTIFICADOR pizquierdo pderecho 		    { $$ = new Nodo_Arbol("Variable", $1, count++);}
          | IDENTIFICADOR	{ $$ = new Nodo_Arbol("Variable", $1,  count++);}
          | PANIC EXPRESION { console.error('Este es un error sintáctico estado EXPRESION: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); $$ = new Nodo_Arbol("Error", $1,  count++);}
          ;