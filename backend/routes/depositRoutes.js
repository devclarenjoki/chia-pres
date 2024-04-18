import express from 'express'
import {deposit} from "../controllers/depositController.js"
const router = express.Router()



import {accessToken} from "../middleware/generateAccessToken.js";

router.route('/stkPush').post(deposit)

export default router

