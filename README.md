
[] https://www.raywenderlich.com/485-react-native-tutorial-building-ios-apps-with-javascript verder volgens als tutorial.

# Starting

On device

    react-native run-ios --device basphone --configuration Release 

On simulator

    react-native run-ios --simulator "iPhone 6" --configuration Debug

## Warnings

Disable by editing `third-party.xcconfig` and adding `-w` to `OTHER_CFLAGS`. https://www.appcoda.com/xcconfig-guide/
 
    OTHER_CFLAGS = -DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -w 

https://github.com/andpor/react-native-sqlite-storage. Read-only database moet in ./ios/Project/www staan en geopend worden met `SQLite.openDatabase({name: "chinook.db", readOnly: true, createFromLocation: 1 }`
