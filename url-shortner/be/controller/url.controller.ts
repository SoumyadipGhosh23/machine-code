import { Request, Response } from "express";
import { generateShortUrl, getLongUrl } from "../service/url.service";

export const shortenUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const result = await generateShortUrl(url);

    if (result.exists) {
      return res.status(200).json({ message: "URL was already shortened", url: result.shortUrl });
    }
    res.status(201).json({ message: "URL shortened successfully", url: result.shortUrl });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUrl = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params as { shortUrl: string };
    console.log(shortUrl);
    const longUrl = await getLongUrl(shortUrl);
    if(!longUrl) return res.status(404).json({ message: "URL not found" });
    res.status(302).redirect(longUrl);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};