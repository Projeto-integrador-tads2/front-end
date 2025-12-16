export const toDataUrl = (
  base64OrData: string | undefined | null,
  mime = "image/png"
) => {
  if (!base64OrData) return undefined;
  if (base64OrData === "null") return undefined;
  if (base64OrData.startsWith("data:")) return base64OrData;
  return `data:${mime};base64,${base64OrData}`;
};

export const base64ToObjectUrl = (
  base64OrData: string | undefined | null,
  mime = "image/png"
) => {
  if (!base64OrData) return undefined;
  if (base64OrData === "null") return undefined;
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
    return undefined;
  }
};
