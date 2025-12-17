export type CryptoNewsArticle = {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  pubDate: string | null;
  source_name: string | null;
  coin: string[] | null;
};

type CryptoNewsApiArticle = {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  pubDate: string | null;
  source_name: string | null;
  coin: string[] | null;
};

type CryptoNewsApiResponse = {
  status: string;
  results?: CryptoNewsApiArticle[];
};

const NEWS_API_BASE_URL = "https://newsdata.io/api/1/crypto";
const DEFAULT_PARAMS: Record<string, string> = {
  language: "en",
  timezone: "asia/kolkata",
  image: "1",
  removeduplicate: "1",
};

const newsApiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY as string;

export async function fetchCryptoNews(): Promise<CryptoNewsArticle[]> {
  const apiKey = newsApiKey?.trim();
  if (!apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_NEWSDATA_API_KEY environment variable"
    );
  }

  const searchParams = new URLSearchParams({
    apikey: apiKey,
    ...DEFAULT_PARAMS,
  });
  const response = await fetch(
    `${NEWS_API_BASE_URL}?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch crypto news (${response.status})`);
  }

  const data = (await response.json()) as CryptoNewsApiResponse;
  if (data.status !== "success") {
    throw new Error("News API returned unsuccessful status");
  }

  return (data.results ?? []).map((article) => ({
    article_id: article.article_id,
    title: article.title,
    description: article.description,
    link: article.link,
    image_url: article.image_url,
    pubDate: article.pubDate,
    source_name: article.source_name,
    coin: article.coin ?? null,
  }));
}
