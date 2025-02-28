package cronjobs

import (
	"fmt"
	"log"
	"strconv"
	"sync"

	"os"

	"github.com/Arinji2/sense-backend/api"
	"github.com/Arinji2/sense-backend/pocketbase"
	"github.com/joho/godotenv"
)

func ResetWords() {
	token := pocketbase.PocketbaseAdminLogin()
	var wg sync.WaitGroup
	tables := []string{"fake_words", "real_words"}
	client := api.NewApiClient()

	godotenv.Load()
	wordsToDelete := os.Getenv("WORDS_TO_DELETE")
	if wordsToDelete == "" {
		wordsToDelete = "200"
	}

	wordsToDeleteInt, err := strconv.Atoi(wordsToDelete)
	if err != nil {
		log.Fatal("Error converting WORDS_TO_DELETE to int")
	}

	for _, table := range tables {
		address := fmt.Sprintf("/api/collections/%s/records", table)

		levels := []int{1, 2, 3}

		for _, level := range levels {
			wg.Add(1)
			fmt.Println("Deleting words for level", level)
			go levelDeletion(level, address, client, token, &wg, table, float64(wordsToDeleteInt))
		}

	}

	wg.Wait()

}
