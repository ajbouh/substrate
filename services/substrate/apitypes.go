package substrate

import (
	"database/sql"
	"sync"
)

type API struct {
	API string

	Mu *sync.RWMutex
	DB *sql.DB
}



type LaunchResult struct {
	URL       string `json:"url"`
	Name      string `json:"name"`
	ReadyURL  string `json:"ready_url"`
	StatusURL string `json:"status_url"`
	UIURL     string `json:"ui_url"`
}
