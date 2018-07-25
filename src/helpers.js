export function formatBodyContent(body) {
  return typeof body === "object" ? JSON.stringify(body) : body;
}

export function getUrl(baseUrl, pathOrAbsolute) {
  if (pathOrAbsolute.substring(0, 4) === "http") return pathOrAbsolute;
  const parsedUrl =
    pathOrAbsolute.charAt(0) === "/"
      ? pathOrAbsolute.substring(1)
      : pathOrAbsolute;

  return `${baseUrl}/${parsedUrl}`;
}
