# Chạy ứng dụng ở chế độ realease mode
Dành cho android
>
> npx react-native run-android --variant release #android 
>
Dành cho ios
>
> npx react-native run-ios --configuration Release --device "Your Device Name"
>
# Chạy ứng dụng 
> npm run android
>
> npm run ios
# Buld file abb để upload google store
> cd android
>
> ./gradlew assembleRelease

## bản react 6.9
> cd android
>
> ./gradlew bundleRelease