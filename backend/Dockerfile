# Use the official Go image as a build stage
FROM golang:1.23.0-alpine AS builder

# Add a label to the Repo
LABEL org.opencontainers.image.source="https://github.com/Arinji2/sense-or-nonsense"

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application
RUN go build -o main .

# Use a minimal image to run the Go application
FROM alpine:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the built Go binary from the builder stage
COPY --from=builder /app/main .

# Expose the port your application runs on
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
