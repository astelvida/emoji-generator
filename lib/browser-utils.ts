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
    .then((blob) => forceDownload(window.URL.createObjectURL(blob), fileName));
}

export function copyToClipboard(imageUrl: string) {
  return fetch(imageUrl, {
    headers: new Headers({ Origin: location.origin }),
    mode: "cors",
  })
    .then((response) => response.blob())
    .then((blob) => navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]));
}

export function downloadImageWithFilename(url: string, filename?: string) {
  console.log("downloadImageWithFilename", url, filename);
  return fetch(url, {
    headers: new Headers({ Origin: location.origin }),
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      console.log("response", Array.from(response.headers.entries()));
      // Extract filename from Content-Disposition if available
      const disposition = response.headers.get("Content-Disposition");
      console.log("disposition", disposition);
      filename = filename || "downloaded-image"; // Default filename
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="([^"]+)"/);
        if (match) {
          filename = match[1];
        }
      }

      return response.blob().then((blob) => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
      const url = URL.createObjectURL(blob);
      console.log("url", url);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading image:", error));
}

// Usage
// downloadImageWithFilename("https://attic.sh/fzfpzdlvhow4kmzg8xsd6lg4sxia");
