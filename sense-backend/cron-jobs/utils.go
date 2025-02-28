package cronjobs

import (
	"fmt"
	"log"
	"math/rand"

	"strings"

	"sync"

	"github.com/Arinji2/sense-backend/api"
)

func getRandomLetter() string {

	letters := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	randomIndex := rand.Intn(len(letters))
	return string(letters[randomIndex])
}

func getDifficultyLevel(level int) string {
	switch level {
	case 3:
		return "PHD Researchers"
	case 2:
		return "University Professors"
	default:
		return "Secondary Education Teachers"
	}
}

func filterWords(words []GeneratedWord) []GeneratedWord {
	var filteredWords []GeneratedWord

	for _, word := range words {
		if word.Word == "FAIL" {
			continue
		}
		filteredWords = append(filteredWords, word)
	}

	return filteredWords
}

func difficultyAmount(difficulty int, address string, client *api.ApiClient, token string, response chan difficultyChannel, wg *sync.WaitGroup) {
	defer wg.Done()

	result, err := client.SendRequestWithQuery("GET", address, map[string]string{
		"perPage": "1",
		"filter":  fmt.Sprintf("level='%d'", difficulty)}, map[string]string{
		"AUTHORIZATION": token})

	if err != nil {
		log.Printf("error in fetching for difficulty %d: %v", difficulty, err)
		return
	}

	totalItems, ok := result["totalItems"].(float64)
	if !ok {
		log.Println("Error in parsing totalItems")
		return
	}

	difficultyData := difficultyChannel{
		totalItems: int(totalItems),
		difficulty: difficulty,
	}

	response <- difficultyData
}

func getLevel(table string, token string) difficultyChannel {

	client := api.NewApiClient()

	address := fmt.Sprintf("/api/collections/%s/records", table)

	response := make(chan difficultyChannel)
	var wg sync.WaitGroup

	levels := []int{1, 2, 3}

	for _, level := range levels {
		wg.Add(1)
		go difficultyAmount(level, address, client, token, response, &wg)
	}

	go func() {
		wg.Wait()
		close(response)
	}()

	var selectedDifficulty difficultyChannel
	var isFirst bool

	for data := range response {
		if !isFirst {
			selectedDifficulty = data
			isFirst = true
			continue
		}
		if selectedDifficulty.totalItems > data.totalItems {
			selectedDifficulty = data
		}
	}

	return selectedDifficulty
}

func levelDeletion(level int, address string, client *api.ApiClient, token string, wg *sync.WaitGroup, tableName string, wordsToDelete float64) {
	defer wg.Done()

	deleteWg := sync.WaitGroup{}
	result, err := client.SendRequestWithQuery("GET", address, map[string]string{
		"perPage": "1",
		"page":    "1",
		"filter":  fmt.Sprintf("level='%d'", level)}, map[string]string{
		"AUTHORIZATION": token})

	if err != nil {
		log.Printf("error in fetching for level %d: %v", level, err)
		return
	}

	totalItems, ok := result["totalItems"].(float64)
	if !ok {
		log.Println("Error in parsing totalItems")
		return
	}

	fmt.Printf("Total words for level %d for table %s : %f\n", level, tableName, totalItems)

	if totalItems <= wordsToDelete {
		return
	}

	result, err = client.SendRequestWithQuery("GET", address, map[string]string{
		"perPage": "30",
		"page":    "1",
		"sort":    "created",
		"fields":  "id",
		"filter":  fmt.Sprintf("level='%d'", level)}, map[string]string{
		"AUTHORIZATION": token})

	if err != nil {
		log.Printf("error in fetching for level %d: %v", level, err)
		return
	}
	fmt.Println(result)
	items, ok := result["items"].([]interface{})
	if !ok {
		log.Println("Error in parsing items")
		return
	}

	// Slice to store the extracted IDs
	var ids []string

	for _, item := range items {
		itemMap, ok := item.(map[string]interface{})
		if !ok {
			log.Println("Error in parsing item map")
			continue
		}

		id, ok := itemMap["id"].(string)
		if !ok {
			log.Println("Error in parsing item id")
			continue
		}

		// Add the ID to the slice
		ids = append(ids, id)
	}

	fmt.Println("IDs:", ids)

	fmt.Printf("Deleting %d words for level %d\n", len(ids), level)

	for _, item := range ids {
		deleteWg.Add(1)
		go func(wordID string) {

			defer deleteWg.Done()
			_, err := client.SendRequestWithBody("DELETE", fmt.Sprintf("%s/%s", address, item), nil, map[string]string{
				"AUTHORIZATION": token})

			if err != nil {
				log.Printf("error in deleting word %s: %v", item, err)
			}

			fmt.Println("Deleted word", item)

		}(item)
	}

	deleteWg.Wait()

}

func wordCheck(word GeneratedWord, token string, table string) bool {
	client := api.NewApiClient()
	res, err := client.SendRequestWithQuery("GET", fmt.Sprintf("/api/collections/%s/records", table), map[string]string{
		"page":    "1",
		"perPage": "1",
		"filter":  fmt.Sprintf(`word="%s"`, strings.ToLower(word.Word)),
	}, map[string]string{
		"Authorization": token,
	})
	if err != nil {
		return true
	}

	totalItems, ok := res["totalItems"].(float64)
	if !ok {
		return true
	}
	return totalItems > 0
}
