export function getPercentageFromLine(line: string) {
  const match = line.trim().match(/^(\d+)%/);
  return match ? match[1] : null;
}

export function extractLatestPercentage(logs: string) {
  // Split the logs into individual lines
  const lastLine = logs.trim().split("\n").pop()?.trim();
  const lastPercentage = getPercentageFromLine(lastLine || "");
  return lastPercentage;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Download photo functions
function forceDownload(blobUrl: string, filename: string) {
  const a: HTMLAnchorElement = document.createElement("a");
  a.download = filename;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadImage(url: string, fileName: string) {
  return fetch(url, {
    headers: new Headers({ Origin: location.origin }),
    mode: "cors",
  })
    .then((response) => response.blob())
    .then((blob) => forceDownload(window.URL.createObjectURL(blob), fileName))
    .catch((e) => console.error(e));
}

/**
 * Measures the execution time of an asynchronous function
 * @param fn The async function to measure
 * @param args Arguments to pass åå
 * 
 to the function
 * @returns Object containing the function result and execution time in milliseconds
 */
export async function measureExecutionTime<T>(
  fn: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<{ result: T; executionTime: number }> {
  const start = performance.now();
  const result = await fn(...args);
  const end = performance.now();
  const executionTime = end - start;

  console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
  return { result, executionTime };
}

export const formatPrompt = (prompt: string) =>
  prompt.replace(/ /g, "-").replace(/-+/g, "-").toLocaleLowerCase();

export const getRandomIndex = <T>(items: T[]) =>
  Math.floor(Math.random() * items.length);

export const getRandomItem = <T>(items: T[]): T => items[getRandomIndex(items)];
