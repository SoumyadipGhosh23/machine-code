import { Router } from "express";
import { shortenUrl, getUrl } from "../controller/url.controller";

const router = Router();

router.post("/data/shorten", shortenUrl);
router.get("/:shortUrl", getUrl);


export default router;