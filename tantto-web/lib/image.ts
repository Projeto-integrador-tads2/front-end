export const toDataUrl = (
  base64OrData: string | undefined | null,
  mime = "image/png"
) => {
  if (!base64OrData) return undefined;
  if (base64OrData === "null") return undefined;
  // already a data URL
  if (base64OrData.startsWith("data:")) return base64OrData;
  // otherwise assume it's raw base64 and build a data URL
  return `data:${mime};base64,${base64OrData}`;
};

export const base64ToObjectUrl = (
  base64OrData: string | undefined | null,
  mime = "image/png"
) => {
  if (!base64OrData) return undefined;
  if (base64OrData === "null") return undefined;
  // extract raw base64 if it's already a data url
  const clean = base64OrData.startsWith("data:")
    ? base64OrData.split(",")[1]
    : base64OrData;
  try {
    const byteChars = atob(clean);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    // if atob fails, return undefined
    return undefined;
  }
};
