#!/bin/bash

# Start the dev servers in the background
pnpm dev &
DEV_PID=$!

# Wait for Metro to be up (port 8081)
echo "Waiting for Metro Bundler to start on port 8081..."
while ! nc -z localhost 8081; do
  sleep 1
done

echo "Metro Bundler is up! Launching iOS app..."

# Launch the iOS app (this will exit after opening the simulator)
pnpm --filter ./apps/mobile... exec -- npx expo run:ios

# Wait for the dev servers to finish
wait $DEV_PID