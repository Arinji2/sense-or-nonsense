package pocketbase

import (
	"log"
	"os"
	"sync"
	"time"

	"github.com/Arinji2/sense-backend/api"
	"github.com/joho/godotenv"
)

var (
	tokenCache  string
	expiryCache time.Time
	mu          sync.Mutex
)

const tokenValidity = 604800 * time.Second // 7 days

func PocketbaseAdminLogin() string {
	mu.Lock()
	defer mu.Unlock()

	if time.Now().Before(expiryCache) && tokenCache != "" {
		return tokenCache
	}
	godotenv.Load()
	identityEmail := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")

	if identityEmail == "" || password == "" {
		log.Fatal("Environment Variables not present to authenticate Admin")
	}

	body := map[string]string{
		"identity": identityEmail,
		"password": password,
	}

	client := api.NewApiClient()
	result, err := client.SendRequestWithBody("POST", "/api/collections/_superusers/auth-with-password", body, nil)
	if err != nil {
		log.Fatalf("Login failed: %v", err)
	}
	token, ok := result["token"].(string)
	if !ok || token == "" {
		log.Fatalf("Token not found or not a string")
	}

	tokenCache = token
	expiryCache = time.Now().Add(tokenValidity)

	return token
}
