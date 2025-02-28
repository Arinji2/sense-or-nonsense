package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type ApiClient struct {
	BaseURL string
	Client  HTTPClient
}

func NewApiClient(baseURL ...string) *ApiClient {
	var url string
	if len(baseURL) > 0 {
		url = baseURL[0]
	} else {
		url = ""
	}

	if url == "" {
		godotenv.Load()
		url = os.Getenv("PB_LINK")
	}

	return &ApiClient{
		BaseURL: url,
		Client:  &http.Client{},
	}
}

func (c *ApiClient) doRequest(req *http.Request, headers map[string]string) (map[string]interface{}, error) {

	req.Header.Set("Content-Type", "application/json")
	for key, val := range headers {
		req.Header.Set(key, val)
	}
	resp, err := c.Client.Do(req)

	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result map[string]interface{}

	if resp.StatusCode == http.StatusNoContent {
		return result, nil
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return result, nil

}

func (c *ApiClient) SendRequestWithBody(method, path string, body interface{}, headers map[string]string) (map[string]interface{}, error) {

	address := fmt.Sprintf("%s%s", c.BaseURL, path)
	jsonBody, err := json.Marshal(body)

	if err != nil {
		return nil, fmt.Errorf("error marshalling json %w", err)
	}

	req, err := http.NewRequest(method, address, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	result, err := c.doRequest(req, headers)

	if err != nil {
		return nil, fmt.Errorf("error from request doer %w", err)
	}

	return result, nil

}

func (c *ApiClient) SendRequestWithQuery(method, path string, query map[string]string, headers map[string]string) (map[string]interface{}, error) {

	queryParams := url.Values{}
	for key, value := range query {
		queryParams.Add(key, value)
	}

	address, err := url.JoinPath(c.BaseURL, path)
	if err != nil {
		return nil, fmt.Errorf("error joining URL paths: %w", err)
	}

	fullURL := fmt.Sprintf("%s?%s", address, queryParams.Encode())
	req, err := http.NewRequest(method, fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}
	result, err := c.doRequest(req, headers)

	if err != nil {
		return nil, fmt.Errorf("error from request doer %w", err)
	}

	return result, nil

}
