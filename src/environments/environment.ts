// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBZ8Uc0N_vSrmijl5pUDtI-YOYyHfZgMs4',
    authDomain: 'gtuctwitter.firebaseapp.com',
    databaseURL: 'https://gtuctwitter.firebaseio.com',
    projectId: 'gtuctwitter',
    storageBucket: 'gtuctwitter.appspot.com',
    messagingSenderId: '311254545104'
  }
};
