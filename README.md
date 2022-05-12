LHL Node Skeleton
=========
## Description
  
  This is a small app which allows the user to view, create, edit or delete a map.
  Wikimaps relies on the google map api to render maps to the user and allows 
  them to save custom versions of these maps with unique markers.

## Final Product

This is a demo of the app in a mobile display

!["Page Layout mobile"](https://github.com/Baila3/tweeter/blob/master/docs/mobile.gif)

This shows a desktop view of the tweeter app!

!["Page Layout Desktop"](https://github.com/Baila3/tweeter/blob/master/docs/desktop-view.png)

This is a tablet sized display of the tweeter app!

!["Page Layout Tablet"](https://github.com/Baila3/tweeter/blob/master/docs/tablet-view.png)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`


## Dependencies

  -   Node 10.x or above
  -   NPM 5.x or above
  -   PG 6.x
  -   body-parser: ^1.20.0",
  -   chalk: ^2.4.2,
  -   cookie-parser: ^1.4.6,
  -   cookie-session: ^2.0.0,
  -   dotenv: ^2.0.0,
  -   ejs: ^3.1.7,
  -   express: ^4.17.1,
  -   morgan: ^1.9.1,
  -   request: ^2.88.2,
  -   request-promise-native: ^1.0.9,
  -   sass: ^1.35.1

