  import { config } from "dotenv";

  config({ path: `.env.${process.env.NODE_ENV || 'developmen'}.local`}); // Options is an object with the following properties

  export const {PORT, MONGO_URI} = process.env; // Destructure the process.env object to get the PORT and MONGO_URI variables