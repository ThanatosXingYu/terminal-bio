type JsonRecord = Record<string, unknown>;

type LocationProvider = {
  url: string;
  parse: (data: unknown) => string | null;
};

type LocationCache = {
  version: 1;
  location: string;
  expiresAt: number;
};

const CACHE_KEY = "terminal-bio:visitor-location:v1";
const CACHE_DURATION_MS = 60 * 60 * 1000;
const PROVIDER_TIMEOUT_MS = 3000;

let pendingLocationRequest: Promise<string | null> | null = null;

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === "object" ? (value as JsonRecord) : null;

const asLocationPart = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized && normalized.length <= 100 ? normalized : null;
};

export const formatVisitorLocation = (
  city: unknown,
  region: unknown,
  country: unknown
): string | null => {
  const uniqueParts: string[] = [];

  [city, region, country].forEach(value => {
    const part = asLocationPart(value);
    if (
      part &&
      !uniqueParts.some(
        existing => existing.toLowerCase() === part.toLowerCase()
      )
    ) {
      uniqueParts.push(part);
    }
  });

  return uniqueParts.length > 0 ? uniqueParts.join(", ") : null;
};

const locationProviders: LocationProvider[] = [
  {
    url: "https://get.geojs.io/v1/ip/geo.json",
    parse: data => {
      const record = asRecord(data);
      return record
        ? formatVisitorLocation(record.city, record.region, record.country)
        : null;
    },
  },
  {
    url: "https://api.ipapi.is/",
    parse: data => {
      const location = asRecord(asRecord(data)?.location);
      return location
        ? formatVisitorLocation(location.city, location.state, location.country)
        : null;
    },
  },
  {
    url: "https://ipwho.is/",
    parse: data => {
      const record = asRecord(data);
      if (!record || record.success === false) return null;

      return formatVisitorLocation(record.city, record.region, record.country);
    },
  },
];

const fetchProviderLocation = async (
  provider: LocationProvider,
  fetcher: typeof fetch
): Promise<string | null> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    PROVIDER_TIMEOUT_MS
  );

  try {
    const response = await fetcher(provider.url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return provider.parse(await response.json());
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
};

export const findVisitorLocation = async (
  fetcher: typeof fetch = globalThis.fetch
): Promise<string | null> => {
  for (const provider of locationProviders) {
    const location = await fetchProviderLocation(provider, fetcher);
    if (location) return location;
  }

  return null;
};

const getSessionStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const readCachedLocation = (): string | null => {
  const storage = getSessionStorage();
  if (!storage) return null;

  try {
    const cached = JSON.parse(
      storage.getItem(CACHE_KEY) ?? "null"
    ) as LocationCache | null;

    if (
      cached?.version === 1 &&
      cached.expiresAt > Date.now() &&
      asLocationPart(cached.location)
    ) {
      return cached.location;
    }
  } catch {
    return null;
  }

  return null;
};

const cacheLocation = (location: string) => {
  const storage = getSessionStorage();
  if (!storage) return;

  const cached: LocationCache = {
    version: 1,
    location,
    expiresAt: Date.now() + CACHE_DURATION_MS,
  };

  try {
    storage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Storage can be unavailable in privacy-focused browser modes.
  }
};

export const getVisitorLocation = (): Promise<string | null> => {
  const cachedLocation = readCachedLocation();
  if (cachedLocation) return Promise.resolve(cachedLocation);

  if (!pendingLocationRequest) {
    pendingLocationRequest = findVisitorLocation()
      .then(location => {
        if (location) cacheLocation(location);
        return location;
      })
      .finally(() => {
        pendingLocationRequest = null;
      });
  }

  return pendingLocationRequest;
};
