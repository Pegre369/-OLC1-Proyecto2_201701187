package main

import (
	"fmt"
	"net/http"
	"text/template"
)

func index(w http.ResponseWriter, r *http.Request) {

	template, err := template.ParseFiles("index.html")

	if err != nil {
		fmt.Fprintf(w, "Pagina no encontrada")
	} else {
		template.Execute(w, nil)
	}

}

func Reporte_Errores(w http.ResponseWriter, r *http.Request) {

	template, err := template.ParseFiles("Reporte_Errores.html")

	if err != nil {
		fmt.Fprintf(w, "Pagina no encontrada")
	} else {
		template.Execute(w, nil)
	}

}

func Reporte_AST(w http.ResponseWriter, r *http.Request) {

	template, err := template.ParseFiles("Reporte_AST.html")

	if err != nil {
		fmt.Fprintf(w, "Pagina no encontrada")
	} else {
		template.Execute(w, nil)
	}

}

func Reporte_clas(w http.ResponseWriter, r *http.Request) {

	template, err := template.ParseFiles("Reporte_Clases.html")

	if err != nil {
		fmt.Fprintf(w, "Pagina no encontrada")
	} else {
		template.Execute(w, nil)
	}

}

func Reporte_funs(w http.ResponseWriter, r *http.Request) {

	template, err := template.ParseFiles("Reporte_Fun.html")

	if err != nil {
		fmt.Fprintf(w, "Pagina no encontrada")
	} else {
		template.Execute(w, nil)
	}

}

func main() {
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/"))))
	http.Handle("/codemirror/", http.StripPrefix("/codemirror/", http.FileServer(http.Dir("codemirror/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))

	http.HandleFunc("/", index)
	http.HandleFunc("/Reporte_Errores", Reporte_Errores)
	http.HandleFunc("/Reporte_AST", Reporte_AST)
	http.HandleFunc("/Reporte_Clases", Reporte_clas)
	http.HandleFunc("/Reporte_Funciones", Reporte_funs)

	fmt.Printf("Servidor escuchando en: http://localhost:4000/")
	http.ListenAndServe(":4000", nil)
}
