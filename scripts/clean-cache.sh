rm -rf node_modules
pnpm cache clean --force
pnpm install
watchman watch-del-all
rm -rf %localappdata%Temphaste-map-*
rm -rf %localappdata%Tempmetro-cache
npx expo start --clear