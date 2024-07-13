import { Client, Account, Databases, Teams } from "appwrite";

// const client = new sdk.Client()
//   .setEndpoint("https://cms.itexpertnow.com/v1")
//   .setProject("6610481f003bf0704275")
//   .setKey(
//     "186ee91829e626b37fe0b88178f036f53a45a16833cdc5a21099a30a1cf19bc753187ffd3d27c9038bc56846f6e2b28f26f374c32ab331228ab7a33d196eaeaacc2350eade60fcf9a02b5f8b69655249b49f574d9c000e68aeea38f57fd4cf91cf34e509f0faa231cf867ad597d087bad7d29904bf88a875323cc391946e2306"
//   );

export const webclient = new Client()
.setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
.setProject(process.env.NEXT_PUBLIC_CMS_PROJECT);

export const database = new Databases(webclient);
export const account = new Account(webclient);
export const team = new Teams(webclient);

// export const users = new sdk.Users(client);



// import sdk from 'node-appwrite';
// // const sdk = require('node-appwrite');
// // import { Client, Account, Databases, Teams } from "appwrite";


// // const sdk = require("node-appwrite");

// export const client = new sdk.Client().setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT).setProject(process.env.NEXT_PUBLIC_CMS_PROJECT).setKey(process.env.CMS_API_KEY)


// // const client = new sdk.Client()
// //   .setEndpoint("https://cms.itexpertnow.com/v1")
// //   .setProject("6610481f003bf0704275")
// //   .setKey(
// //     "186ee91829e626b37fe0b88178f036f53a45a16833cdc5a21099a30a1cf19bc753187ffd3d27c9038bc56846f6e2b28f26f374c32ab331228ab7a33d196eaeaacc2350eade60fcf9a02b5f8b69655249b49f574d9c000e68aeea38f57fd4cf91cf34e509f0faa231cf867ad597d087bad7d29904bf88a875323cc391946e2306"
// //   );

// // export const webclient = new Client().setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT).setProject(process.env.NEXT_PUBLIC_CMS_PROJECT);
// // export const database = new Databases(webclient);
// // export const account = new Account(webclient);
// // export const team = new Teams(webclient);
// export const users = new sdk.Users(client);

// export const databases = new sdk.Databases(client);
// export const storage = new sdk.Storage(client);

