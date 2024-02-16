package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	chromedpUrl, _ := url.Parse("http://localhost:9222")
	chromedpProxy := httputil.NewSingleHostReverseProxy(chromedpUrl)

	http.HandleFunc("/vnc/ws", novncHandler)
	http.Handle("/vnc/", http.StripPrefix("/vnc", http.FileServer(http.Dir("/vnc"))))
	http.Handle("/", chromedpProxy)

	fmt.Println("Server started at :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
