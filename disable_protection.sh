#!/bin/bash

# Script to remove Vercel protection from deployments

for project in bookchaowalit-*-frontend; do
  if [ -d "$project" ]; then
    echo "Checking: $project"
    cd "$project"
    
    # Check if vercel.json exists
    if [ -f "vercel.json" ]; then
      echo "  Found vercel.json"
      # Check if protection is configured
      if grep -q "protection" vercel.json; then
        echo "  Has protection config - need to update"
      fi
    fi
    
    # Check project settings via vercel CLI
    # vercel project ls
    
    cd ..
  fi
done
