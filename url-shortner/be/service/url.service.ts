import crc32 from "crc/crc32";
import pool from "../db/db";

const HASH_PREFIX = "url_";

export const generateShortUrl = async (
  longUrl: string
): Promise<{ exists: boolean; shortUrl: string }> => {
  // First check if this long URL already exists
  const existingUrl = await pool.query(
    `SELECT short_url FROM urls WHERE long_url = $1`,
    [longUrl]
  );

  if (existingUrl.rows.length > 0) {
    return {
      exists: true,
      shortUrl: existingUrl.rows[0].short_url,
    };
  }

  let input = longUrl;

  while (true) {
    // Generate CRC32
    const crc = crc32(input).toString();

    // Take first 7 characters
    const shortUrl = crc.slice(0, 7);

    // Check whether generated short URL already exists
    const existingShortUrl = await pool.query(
      `SELECT id FROM urls WHERE short_url = $1`,
      [shortUrl]
    );

    if (existingShortUrl.rows.length === 0) {
      // Unique short URL, insert it
      await pool.query(
        `INSERT INTO urls (long_url, short_url)
         VALUES ($1, $2)`,
        [longUrl, shortUrl]
      );

      return {
        exists: false,
        shortUrl,
      };
    }

    // Collision → change input and hash again
    input = HASH_PREFIX + input;
  }
};


export const getLongUrl = async (
  shortUrl: string
): Promise<string | undefined> => {
  console.log(shortUrl);
  const result = await pool.query(
    `SELECT long_url FROM urls WHERE short_url = $1`,
    [shortUrl]
  );
  if(result.rows.length !== 0) await pool.query(`UPDATE urls
  SET click_count = click_count + 1
  WHERE short_url = $1`,[shortUrl])
  console.log(result)
  return result.rows.length > 0 ? result.rows[0].long_url : undefined;
}