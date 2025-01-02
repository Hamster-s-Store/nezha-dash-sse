// @auto-i18n-check. Please do not delete the line.

export const localeItems = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "zh-t", name: "中文繁體" },
  { code: "zh", name: "中文简体" },
]

export const locales = localeItems.map((item) => item.code)
export const defaultLocale = "zh"
