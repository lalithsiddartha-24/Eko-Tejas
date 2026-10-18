import axelRearImage from "../assets/vehicle-gallery/axel-rear.png";
import axelSideImage from "../assets/vehicle-gallery/axel-side.png";

const IMAGE_FIELDS = [
  "images",
  "gallery",
  "photos",
  "vehicle images",
  "image urls",
  "pictures",
];
const COLOR_FIELDS = ["available colors", "colors", "color options", "vehicle colors"];
const IMAGE_SOURCE_FIELDS = ["url", "src", "image", "image url", "photo", "photo url"];
const COLOR_NAME_FIELDS = ["name", "color", "colour", "label", "title"];
const COLOR_VALUE_FIELDS = ["hex", "value", "code", "color code", "colour code"];

function normalizedKey(key) {
  return key.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function getEntry(object, fieldNames) {
  if (!object || typeof object !== "object") return undefined;
  const names = new Set(fieldNames.map(normalizedKey));
  return Object.entries(object).find(
    ([key, value]) =>
      names.has(normalizedKey(key)) &&
      value !== null &&
      value !== undefined &&
      value !== "",
  )?.[1];
}

function toImage(image, color) {
  const src =
    typeof image === "string"
      ? image.trim()
      : getEntry(image, IMAGE_SOURCE_FIELDS);
  if (typeof src !== "string" || !src.trim()) return null;
  const imageColor =
    getEntry(image, ["color", "colour", "color name", "colour name"]) || color;
  return {
    src: src.trim(),
    alt: typeof image === "object" ? getEntry(image, ["alt", "description"]) : "",
    color: imageColor ? String(imageColor).trim() : "",
  };
}

function asImages(value, color) {
  const source = Array.isArray(value) ? value : value ? [value] : [];
  return source.map((image) => toImage(image, color)).filter(Boolean);
}

export function getVehicleMedia(vehicle) {
  const colorImages = new Map();
  const colors = [];
  const addColor = (name, value, images = []) => {
    if (!name) return;
    const label = String(name).trim();
    if (!label) return;
    const key = label.toLocaleLowerCase();
    let color = colors.find((item) => item.key === key);
    if (!color) {
      color = {
        key,
        name: label,
        swatch:
          typeof value === "string" && /^#[0-9a-f]{3,8}$/i.test(value)
            ? value
            : typeof value === "string" && /^(rgb|hsl)a?\(/i.test(value)
              ? value
              : label,
      };
      colors.push(color);
    }
    if (images.length) colorImages.set(key, images);
  };

  const generalImages = [];
  for (const [field, value] of Object.entries(vehicle || {})) {
    if (IMAGE_FIELDS.some((name) => normalizedKey(name) === normalizedKey(field))) {
      for (const image of asImages(value)) {
        if (image.color) {
          addColor(image.color, image.color);
          const key = image.color.toLocaleLowerCase();
          colorImages.set(key, [...(colorImages.get(key) || []), image]);
        } else {
          generalImages.push(image);
        }
      }
    }
  }

  for (const [field, value] of Object.entries(vehicle || {})) {
    if (!COLOR_FIELDS.some((name) => normalizedKey(name) === normalizedKey(field))) {
      continue;
    }
    const entries = Array.isArray(value) ? value : value ? [value] : [];
    for (const entry of entries) {
      if (typeof entry === "string") {
        addColor(entry, entry);
        continue;
      }
      if (!entry || typeof entry !== "object") continue;
      const name = getEntry(entry, COLOR_NAME_FIELDS);
      const swatch = getEntry(entry, COLOR_VALUE_FIELDS) || name;
      const images = asImages(
        getEntry(entry, IMAGE_FIELDS) ||
          getEntry(entry, ["image", "image url", "photo", "photo url"]),
        name,
      );
      addColor(name, swatch, images);
    }
  }

  const mainImage = getEntry(vehicle, ["image", "image url", "vehicle image", "photo", "photo url"]);
  const fallbackImages = [...generalImages, ...asImages(mainImage)].filter(
    (image, index, all) =>
      all.findIndex((candidate) => candidate.src === image.src) === index,
  );

  const vehicleName = String(
    getEntry(vehicle, ["name", "vehicle name", "model", "model name", "title"]) || "",
  )
    .trim()
    .toLocaleLowerCase();
  if (vehicleName === "axel") {
    const whiteKey = "white";
    if (!colors.some((color) => color.key === whiteKey)) {
      colors.push({ key: whiteKey, name: "White", swatch: "#ffffff" });
    }
    const whiteImages = [
      ...(colorImages.get(whiteKey) || []),
      { src: axelRearImage, alt: "Rear view of the white Axel scooter" },
      { src: axelSideImage, alt: "Side view of the white Axel scooter" },
    ].filter(
      (image, index, all) =>
        all.findIndex((candidate) => candidate.src === image.src) === index,
    );
    colorImages.set(whiteKey, whiteImages);
  }

  return { colors, colorImages, images: fallbackImages };
}
