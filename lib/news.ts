"use server";
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
  category?: string[] | null;
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
  prioritydomain: "top",
};

const TRUSTED_SOURCES = new Set([
  "coindesk",
  "cointelegraph",
  "decrypt",
  "theblock",
  "bitcoinmagazine",
  "bloomberg",
  "reuters",
  "forbes",
  "cnbc",
  "cryptonews",
  "u.today",
  "ambcrypto",
  "newsbtc",
  "beincrypto",
  "coingape",
  "cryptopotato",
  "dailyhodl",
  "bitcoinist",
  "cryptobriefing",
  "blockworks",
]);

const SPAM_KEYWORDS = [
  "airdrop",
  "giveaway",
  "free tokens",
  "presale",
  "bonus",
  "limited time",
  "act now",
  "guaranteed returns",
  "get rich",
  "double your",
  "pump",
  "moon",
  "100x",
  "1000x",
  "signal group",
  "join now",
  "exclusive offer",
  "casino",
  "gambling",
];

function isSpamArticle(article: CryptoNewsApiArticle): boolean {
  const titleLower = (article.title ?? "").toLowerCase();
  const descLower = (article.description ?? "").toLowerCase();
  const combinedText = `${titleLower} ${descLower}`;

  for (const keyword of SPAM_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return true;
    }
  }

  return false;
}

function isQualityArticle(article: CryptoNewsApiArticle): boolean {
  if (!article.title || article.title.length < 20) {
    return false;
  }

  if (!article.description || article.description.length < 50) {
    return false;
  }

  if (isSpamArticle(article)) {
    return false;
  }

  const sourceName = (article.source_name ?? "")
    .toLowerCase()
    .replace(/\s+/g, "");
  if (TRUSTED_SOURCES.has(sourceName)) {
    return true;
  }

  const hasRelevantCoins = article.coin && article.coin.length > 0;
  const hasGoodLength = article.description.length >= 100;

  return hasRelevantCoins || hasGoodLength;
}

const newsApiKey = process.env.NEWSDATA_API_KEY as string;

export async function fetchCryptoNews(): Promise<CryptoNewsArticle[]> {
  const apiKey = newsApiKey?.trim();
  if (!apiKey) {
    throw new Error("Missing NEWSDATA_API_KEY environment variable");
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

  const qualityArticles = (data.results ?? []).filter(isQualityArticle);

  return qualityArticles.map((article) => ({
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
