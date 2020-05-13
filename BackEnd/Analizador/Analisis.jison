/*------------------------------------------IMPORTS------------------------------------------*/

%{

    let Lista_Error = require('../build/Reportes/Reporte_Error')
    let Nodo_Lista_Error = require('../build/Reportes/Nodo_Error')


}%

/*------------------------------------------Lexico------------------------------------------*/

%lex
%%

    //Comentarios
    
    "//".*			// comentario simple
    [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	 //Comentario multilineas

    
    //Palabra Reservadas
    "int"       return 'tk_int';
    "double"    return 'tk_double';
    "boolean"   return 'tk_boolean';
    "char"      return 'tk_char';
    "String"    return 'tk_String';
    "class"     return 'tk_class';
    "import"    return 'tk_import';
    "if"        return 'tk_if';
    "else"      return 'tk_else';
    "switch"    return 'tk_switch';
    "case"      return 'tk_case';
    "break"     return 'tk_break';
    "default"   return 'tk_default';
    "while"     return 'tk_while';
    "do"        return 'tk_do';
    "for"       return 'tk_for';
    "continue"  return 'tk_continue';
    "return"    return 'tk_return';
    "main"      return 'tk_main';
    "System"    return 'tk_System';
    "out"       return 'tk_out';
    "print"     return 'tk_print';
    "println"   return 'tk_println';
    "void"      return 'tk_void';

    //Operaciones Aritmeticas
    "+"         return 'tk_mas';
    "-"         return 'tk_menos;
    "*"         return 'tk_mult';
    "/"         return 'tk_div';
    "^"         return 'tk_eleva';
    "%"         return 'tk_porcen';
    "++"        return 'tk_incremento';
    "--"        return 'tk_decremento';
    
    //Operaciones Relacionales
    "=="        return 'tk_igualdad';
    "!="        return 'tk_distinto';
    ">"         return 'tk_mayork';
    ">="        return 'tk_mayorigualk';
    "<"         return 'tk_menork';
    "<="        return 'tk_menorigualk';
    
    //Operaciones Logicas
    "&&"        return 'tk_and';
    "||"        return 'tk_or';
    "!"         return 'tk_not';

    //Simbolos Extras
    "{"         return 'tk_llaveabre';
    "}"         return 'tk_llavecierra';
    ";"         return 'tk_puntocoma';
    "("         return 'tk_parentesisabre';
    ")"         return 'tk_parentesiscierra';
    ":"         return 'tk_dospuntos';
    "."         return 'tk_punto';
    ","         return 'tk_coma';
    "="         return 'tk_igual';


    //ER's
    [\t\r\n\f]                      %{ /*se ignoran*/ %}
    \"[^\"]*\"                      %{ return 'tk_cadena'; %}
    \'[^\']*\'                      %{ return 'tk_caracter'; %}
    [a-zA-Z]+([a-zA-Z]|[0-9]|_)*    %{ return 'tk_id'; %}
    (-)?[0-9]+("."[0-9]+)?\b  	    %{ return 'tk_digito'; %}

    <<EOF>>     %{  return 'EOF';   %}

    .           Lista_Error.Reporte_Errores.add(new Nodo_Lista_Error.Nodo_Error("Lexico","No se esperaba el caracter: "+yytext,yylineno))

/lex

/*------------------------------------------Sintactico------------------------------------------*/

%star S
%%

S: IMPORTS CLASS
;

IMPORTS: tk_import tk_id tk_puntocoma IMPORTS
        |
;

CLASS: tk_class tk_id tk_llaveabre S_CUERPO tk_llavecierra CLASS
      |
;

S_CUERPO: TIPO_DATO tk_id OPCION S_CUERPO
         |tk_void TIPO_METODO S_CUERPO
         |CLASS S_CUERPO
         |tk_id OP_ID tk_puntocoma
         |
;

OPCION: tk_puntocoma
       |tk_parentesisabre PARAMETRO tk_parentesiscierra tk_llaveabre SENTENCIAS tk_llavecierra
       |tk_coma tk_id LISTADO tk_puntocoma
       |tk_igual IGUAL tk_puntocoma
;

LISTADO: tk_coma tk_id LISTADO
        |tk_igual IGUAL
        |
;

PARAMETRO: TIPO_DATO tk_id LISTADO_PAR
          |
;

LISTADO_PAR: tk_coma TIPO_DATO tk_id LISTADO_PAR
            |
;

IGUAL: tk_cadena CADENA
      |tk_caracter CADENA
      |tk_id OPCION_SIG
      |tk_digito ART
;

OPCION_SIG: tk_parentesisabre tk_id LISTA_PARAMETRO tk_parentesiscierra
           |ARITMETICO VAL ART
           |OP_ID
;

LISTA_PARAMETRO: tk_coma tk_id LISTA_PARAMETRO
                |
;

OP_ID: tk_incremento
      |tk_decremento

TIPO_DATO: tk_int
          |tk_double
          |tk_boolean
          |tk_char
          |tk_String
;

ARITMETICO: tk_mas
           |tk_menos
           |tk_div
           |tk_eleva
           |tk_porcen
           |tk_mult
;

ART: OP_ID
    |ARITMETICO VAL ART
    |
;

VAL: tk_id
    |tk_digito
    |tk_cadena CADENA
    |tk_caracter CADENA
;

CADENA: tk_mas VALC CADENA
       |
;

VALC: tk_id ART
      |tk_digito ART
      |tk_cadena
      |tk_caracter
;

TIPO_METODO: tk_id tk_parentesisabre PARAMETRO tk_parentesiscierra tk_llaveabre SENTENCIAS tk_llavecierra
            |tk_main tk_parentesisabre tk_parentesiscierra tk_llaveabre SENTENCIAS tk_llavecierra
;

SENTENCIAS: tk_id OP_ID tk_puntocoma SENTENCIAS
           |S_FOR SENTENCIAS
           |S_WHILE SENTENCIAS
           |S_DO SENTENCIAS
           |S_IMP SENTENCIAS
           |S_B SENTENCIAS
           |S_R SENTENCIAS
           |S_C SENTENCIAS
           |S_IF SENTENCIAS
           |S_SWICH SENTENCIAS
           |
;

S_FOR: tk_for tk_parentesisabre INI tk_igual VAL_FOR tk_puntocoma tk_id OP_FOR VAL_FOR tk_puntocoma tk_id AD tk_parentesiscierra tk_llaveabre SENTENCIAS tk_llavecierra
;

INI: tk_int tk_id
    |tk_id
;

VAL_FOR: tk_id
        |tk_digito
;

OP_FOR: tk_mayork
       |tk_menork
       |tk_mayorigualk
       |tk_menorigualk
;

AD: tk_incremento
   |tk_decremento
;

S_WHILE: tk_while tk_parentesisabre CONDICION tk_parentesiscierra tk_llaveabre SENTENCIAS tk_llavecierra
;

S_DO: tk_do tk_llaveabre SENTENCIAS tk_llavecierra tk_while tk_parentesisabre  tk_id OP_WH VAL_WH tk_parentesiscierra tk_puntocoma

S_IMP: tk_System tk_punto tk_out tk_punto TIPO_PRINT tk_parentesisabre VAL_IMP SUM tk_parentesiscierra tk_puntocoma
;

TIPO_PRINT: tk_print
           |tk_println
;

VAL_IMP: tk_digito
        |tk_id OPCION_IMP
        |tk_cadena
        |tk_caracter
;

OPCION_IMP: tk_parentesisabre tk_id LISTA_PARAMETRO tk_parentesiscierra
           |
;

SUM: tk_mas VAL_IMP SUM
    |
;

S_R: tk_return S_RF tk_puntocoma
;

S_RF: VAL ART
     |
;

S_B: tk_break tk_puntocoma
;

S_C: tk_continue tk_puntocoma
;

S_IF: tk_if tk_parentesisabre CONDICION tk_parentesiscierra tk_llaveabre SENTENCIAS tk_llavecierra ELSE
;

CONDICION: UNA
          |tk_parentesisabre UNA tk_parentesiscierra LOG
;

UNA: tk_not tk_id
    |tk_id OP_IF
;

LOG: tk_or tk_parentesisabre UNA tk_parentesiscierra LOG
    |tk_and tk_parentesisabre UNA tk_parentesiscierra LOG
    |
;

OP_IF: tk_mayork VAL_IF
     | tk_menork VAL_IF
     | tk_mayorigualk VAL_IF
     | tk_menorigualk VAL_IF
     | tk_igualdad VAL_IF
     | tk_distinto VAL_IF
;

VAL_IF: tk_id
       |tk_digito
;

ELSE: tk_else IF tk_llaveabre SENTENCIAS tk_llaveabre ELSE
     |
;

IF: tk_if tk_parentesisabre CONDICION tk_parentesiscierra
   |
;

S_SW: tk_switch tk_parentesisabre CAD tk_parentesiscierra tk_llaveabre tk_case CASE DEF tk_llavecierra
;

CAD: tk_not tk_id
    |tk_id SW_OP
;

SW_OP: tk_mas VAL_SW SW_OP
      |tk_menos VAL_SW SW_OP
      |tk_div VAL_SW SW_OP
      |tk_mult VAL_SW SW_OP
      |tk_eleva VAL_SW SW_OP
      |tk_porcen VAL_SW SW_OP
      |tk_parentesisabre tk_id LISTA_PARAMETRO tk_parentesiscierra
      |
;

CASE: VAL_CASE tk_dospuntos CONTEN tk_break tk_puntocoma REP
;

VAL_CASE: tk_id
         |tk_cadena
         |tk_digito
;

CONTEN: tk_id tk_igual IGUAL_CASE tk_puntocoma
       |SENTENCIAS
       |
;

IGUAL_CASE: tk_cadena
           |VAL ART
;

REP: tk_case CASE
    |
;

DEF: tk_default tk_dospuntos CONTEN
    |
;
