package cronjobs

import (
	"fmt"
	"strings"

	"github.com/Arinji2/sense-backend/api"
)

func generateWord(level int, fake bool, accessKey string, response chan<- GeneratedWord, retries int) {

	client := api.NewApiClient("https://ai.arinji.com")

	var content string
	if fake {
		content = fmt.Sprintf(
			"Take a word from the english language, modify it in a way so that the new word is a fake made-up word but sounds like a real word. Modify the definition of the old word to make it match the new word and compress it to a maximum of 6 words. Respond with the new word and the definition in a line separated by a semicolon. The amount of modifications must be of a level of difficulty suitable for %s. Make sure the word starts with %s. Make sure the word also has %s in it somewhere.",
			getDifficultyLevel(level),
			getRandomLetter(),
			getRandomLetter(),
		)
	} else {
		content = fmt.Sprintf(
			"Generate a random word with its definition from the English Dictionary. Edit the definition of the word by compressing it to a maximum of 6 words. Respond with the word and the definition in a line separated by a semicolon. The word must be of a level of difficulty suitable for %s. Make sure the word starts with %s. Make sure the word also has %s in it somewhere.",

			getDifficultyLevel(level),
			getRandomLetter(),
			getRandomLetter(),
		)
	}

	body := []map[string]string{
		{
			"role":    "user",
			"content": content,
		},
	}
	headers := map[string]string{
		"Content-Type":  "application/json",
		"Authorization": accessKey,
	}

	res, err := client.SendRequestWithBody("POST", "/completions", body, headers)
	if err != nil {

		if retries > 0 {
			generateWord(level, fake, accessKey, response, retries-1)
		} else {

			response <- GeneratedWord{Word: "FAIL", Definition: "FAIL", IsFake: fake}
		}
		return
	}

	message, ok := res["message"].(string)

	if !ok {
		if retries > 0 {
			generateWord(level, fake, accessKey, response, retries-1)
		} else {
			response <- GeneratedWord{Word: "FAIL", Definition: "FAIL", IsFake: fake}
		}
		return
	}

	parts := strings.SplitN(message, ";", 2)
	if len(parts) < 2 {
		if retries > 0 {
			generateWord(level, fake, accessKey, response, retries-1)
		} else {
			response <- GeneratedWord{Word: "FAIL", Definition: "FAIL", IsFake: fake}
		}
		return
	}

	word := strings.TrimSpace(parts[0])
	definition := strings.TrimSpace(parts[1])

	response <- GeneratedWord{
		Word:       word,
		Definition: definition,
		IsFake:     fake,
		Level:      level,
	}
}
