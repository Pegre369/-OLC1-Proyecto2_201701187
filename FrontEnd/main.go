package main

import (
	"fmt"
	"html/template"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {

	template, err := template.ParseFiles("templates/index.html")

	if err != nil {
		fmt.Fprintf(w, "Pagina no encontrada")
	} else {
		template.Execute(w, nil)
	}

}

func main() {
	http.HandleFunc("/", index)
	fmt.Println("hola")
	http.ListenAndServe(":5000", nil)

}
