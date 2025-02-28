package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	cronjobs "github.com/Arinji2/sense-backend/cron-jobs"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"github.com/joho/godotenv"
)

func main() {
	r := chi.NewRouter()

	err := godotenv.Load()
	if err != nil {
		isProduction := os.Getenv("ENVIRONMENT") == "PRODUCTION"
		if !isProduction {
			log.Fatal("Error loading .env file")
		} else {
			fmt.Println("Using Production Environment")
		}
	} else {
		fmt.Println("Using Development Environment")
	}

	r.Group(func(r chi.Router) {
		// Only routes within this group will be logged. We don't want to log health checks, as they
		// are too frequent.
		r.Use(middleware.Logger)

		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			key := r.URL.Query()["key"]
			if len(key) != 0 {
				if key[0] == os.Getenv("ACCESS_KEY") {
					fmt.Println("RUNNING TASKS")
					cronjobs.InsertWords()
					cronjobs.ResetWords()
				}
			}
			fmt.Println("Sense Backend: Request Received")
			w.Write([]byte("Sense Backend: Request Received"))
			render.Status(r, 200)
		})
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {

		w.Write([]byte("Sense Backend: Health Check"))
		render.Status(r, 200)
	})

	go startCronJob()

	if err := http.ListenAndServe(":8080", r); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("listen: %s\n", err)
	}
}

func startCronJob() {
	go func() {
		ticker := time.NewTicker(30 * time.Minute)
		defer ticker.Stop()

		for range ticker.C {
			fmt.Println("Running 30 mins cron job")
			cronjobs.InsertWords()
			cronjobs.ResetWords()
		}
	}()

	go func() {
		cleanupTicker := time.NewTicker(1 * time.Minute)
		defer cleanupTicker.Stop()

		for range cleanupTicker.C {
			fmt.Println("Running cleanup cron job")
			cronjobs.VerifyFakeWords()
		}
	}()
}
