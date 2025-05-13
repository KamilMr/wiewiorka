rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
rm -rf %localappdata%Temphaste-map-*
rm -rf %localappdata%Tempmetro-cache
npx expo start --clear