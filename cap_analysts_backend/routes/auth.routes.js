import { Router } from "express";
import { signin, signout, signup, checkAuth } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";


 const authRouter = Router();

 authRouter.post('/sign-up', signup)
 authRouter.post('/sign-in', signin)
 authRouter.post('/sign-out', signout)
 authRouter.get('/check-auth', authorize, checkAuth)


 export default authRouter;