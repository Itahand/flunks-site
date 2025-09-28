#!/bin/bash

# Switch between flunks-build and flunks-public Vercel configurations

if [ "$1" == "build" ]; then
    echo "🔧 Switching to BUILD mode deployment..."
    if [ -d ".vercel-build-backup" ]; then
        if [ -d ".vercel" ]; then
            mv .vercel .vercel-public-backup
        fi
        mv .vercel-build-backup .vercel
        echo "✅ Switched to flunks-build project"
        echo "📝 Run 'vercel --prod --yes' to deploy to build mode"
    else
        echo "❌ Build mode backup not found"
    fi
elif [ "$1" == "public" ]; then
    echo "🌐 Switching to PUBLIC mode deployment..."
    if [ -d ".vercel-public-backup" ]; then
        if [ -d ".vercel" ]; then
            mv .vercel .vercel-build-backup
        fi
        mv .vercel-public-backup .vercel
        echo "✅ Switched to flunks-public project"
        echo "📝 Run 'vercel --prod --yes' to deploy to public mode"
    else
        echo "❌ Public mode backup not found (current config should be public)"
    fi
else
    echo "🚀 Vercel Project Switcher"
    echo "========================="
    echo "Usage: ./switch-vercel-project.sh [build|public]"
    echo ""
    echo "Current project:"
    if [ -f ".vercel/project.json" ]; then
        cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4
    else
        echo "No Vercel project configured"
    fi
    echo ""
    echo "Available commands:"
    echo "  ./switch-vercel-project.sh build   - Switch to flunks-build project"
    echo "  ./switch-vercel-project.sh public  - Switch to flunks-public project"
fi