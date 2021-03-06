# create-svelte

## Seed the database
To upload data to the database from a CSV file, run the seed script:
```bash
npm run seed
```

## Before running

Make sure to install dependencies

`npm install`

Run migrations and create the client for Prisma
```bash
npx prisma generate

npx prisma migrate dev
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
