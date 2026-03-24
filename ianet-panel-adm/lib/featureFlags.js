export function getPaidFeatures() {
  const raw = (process.env.NEXT_PUBLIC_PAID_FEATURES || process.env.PAID_FEATURES || "").trim()
  if (!raw) return []
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}

export function isFeatureEnabled(feature) {
  const features = getPaidFeatures()
  return features.includes(feature)
}


