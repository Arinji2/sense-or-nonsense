package cronjobs

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/Arinji2/sense-backend/api"
	"github.com/Arinji2/sense-backend/pocketbase"
)

type VerifiedWord struct {
	ID   string
	Word string
}

func VerifyFakeWords() {
	token := pocketbase.PocketbaseAdminLogin()
	pbClient := api.NewApiClient()
	pbAddress := "/api/collections/fake_words/records"

	totalWorkers := 3

	workerPool := make(chan VerifiedWord, totalWorkers)
	var wg sync.WaitGroup

	for range totalWorkers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			fetchWord(pbClient, pbAddress, token, workerPool)
		}()
	}

	go func() {
		wg.Wait()
		close(workerPool)
	}()

	recordPool := make(chan []bool, totalWorkers)

	for word := range workerPool {
		wg.Add(1)
		go func(word VerifiedWord) {
			defer wg.Done()

			isReal := verifyWord(word)

			if isReal {
				deleteWord(word.ID, token, pbClient)
				recordPool <- []bool{false}

			} else {
				updateVerification(word.ID, token, pbClient)
				recordPool <- []bool{true}
			}
		}(word)
	}

	go func() {
		wg.Wait()
		close(recordPool)
	}()
	totalDeleted := 0
	totalVerified := 0

	for record := range recordPool {
		for _, isVerified := range record {
			if isVerified {
				totalVerified++
			} else {
				totalDeleted++
			}
		}
	}

	fmt.Println("Total verified", totalVerified)
	fmt.Println("Total deleted", totalDeleted)
}

func fetchWord(pbClient *api.ApiClient, pbAddress, token string, workerPool chan<- VerifiedWord) {
	data, err := pbClient.SendRequestWithQuery("GET", pbAddress, map[string]string{
		"page":    "1",
		"perPage": "1",
		"sort":    "@random",
		"filter":  "verified=false",
	}, map[string]string{
		"AUTHORIZATION": token,
	})
	if err != nil {
		fmt.Println("Error in fetching fake words:", err)
		return
	}

	items, ok := data["items"].([]interface{})
	if len(items) == 0 {
		fmt.Println("No items found")
		return
	}
	if !ok {
		fmt.Println("Error in parsing items ")
		return
	}

	item := items[0].(map[string]interface{})

	id, ok := item["id"].(string)
	if !ok {
		fmt.Println("Error in parsing id")
		return
	}

	wordString, ok := item["word"].(string)
	if !ok {
		fmt.Println("Error in parsing word")
		return
	}

	word := VerifiedWord{
		Word: wordString,
		ID:   id,
	}
	workerPool <- word
}

func verifyWord(word VerifiedWord) bool {
	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.dictionaryapi.dev/api/v2/entries/en/%s", word.Word), nil)
	if err != nil {
		fmt.Println("error in creating request", err)
		return false
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println("error in sending request", err)
		return false
	}
	defer res.Body.Close()

	return res.StatusCode == 200
}

func deleteWord(id, token string, pbClient *api.ApiClient) {
	_, err := pbClient.SendRequestWithBody("DELETE", fmt.Sprintf("/api/collections/fake_words/records/%s", id), nil, map[string]string{
		"AUTHORIZATION": token,
	})
	if err != nil {
		fmt.Println("Error in deleting word", err)
	}
}

func updateVerification(id, token string, pbClient *api.ApiClient) {
	_, err := pbClient.SendRequestWithBody("PATCH", fmt.Sprintf("/api/collections/fake_words/records/%s", id), map[string]string{
		"verified": "true",
	}, map[string]string{
		"AUTHORIZATION": token,
	})
	if err != nil {
		fmt.Println("Error in updating verification", err)
	}
}
