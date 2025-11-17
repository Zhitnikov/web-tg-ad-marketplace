#!/bin/sh
set -e

echo "Pulling phi3.5 model..."
ollama pull phi3.5

echo "Starting Ollama server..."
exec ollama serve
