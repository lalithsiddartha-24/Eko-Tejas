import { ArrowDown, ArrowRight, Bike, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  VehicleColorSelector,
  VehicleGallery,
  VehicleSpecifications,
} from "../Components/VehicleShowcase";
import { getVehicleMedia } from "../Components/vehicleShowcaseUtils";
import { readApiJson } from "../utils/api";

const nameFields = ["name", "vehicle name", "model", "model name", "title"];
const categoryFields = ["category", "vehicle category", "type", "vehicle type"];
const rangeFields = ["range", "driving range", "range per charge"];
const powerFields = ["power", "rated power", "motor power"];

const excludedSpecificationFields = new Set([
  "id",
  "createdat",
  "updatedat",
  "name",
  "vehiclename",
  "model",
  "modelname",
  "title",
  "vehicle",
  "category",
  "vehiclecategory",
  "type",
  "vehicletype",
  "tagline",
  "description",
  "shortdescription",
  "image",
  "imageurl",
  "vehicleimage",
  "photo",
  "photourl",
  "images",
  "gallery",
  "photos",
  "vehicleimages",
  "imageurls",
  "pictures",
  "availablecolors",
  "colors",
  "coloroptions",
  "vehiclecolors",
  "color",
  "colour",
  "specifications",
  "specs",
]);

const fieldUnits = [
  { fields: ["range", "driving range", "range per charge"], unit: "km" },
  { fields: ["power", "rated power", "motor power"], unit: "kW" },
  { fields: ["battery capacity"], unit: "kWh" },
  { fields: ["maximum speed", "max speed", "top speed"], unit: "km/h" },
  { fields: ["payload capacity", "payload"], unit: "kg" },
];

const pageSections = [
  { label: "Overview", id: "overview" },
  { label: "Specifications", id: "specifications" },
  { label: "Features", id: "features" },
  { label: "Gallery", id: "gallery" },
  { label: "Service & Support", id: "support" },
];

function normalizedKey(key) {
  return key.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function getVehicleValue(vehicle, fieldNames) {
  const normalizedFields = new Set(fieldNames.map(normalizedKey));
  return Object.entries(vehicle || {}).find(
    ([key, value]) =>
      normalizedFields.has(normalizedKey(key)) &&
      value !== null &&
      value !== undefined &&
      value !== "",
  )?.[1];
}

function formatFieldLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toLocaleUpperCase());
}

function formatFieldValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function formatSpecificationValue(key, value) {
  const formattedValue = formatFieldValue(value).trim();
  const unit = fieldUnits.find(({ fields }) =>
    fields.some((field) => normalizedKey(field) === normalizedKey(key)),
  )?.unit;
  if (!unit || !/^-?\d+(?:[.,]\d+)?$/.test(formattedValue)) {
    return formattedValue;
  }
  return `${formattedValue} ${unit}`;
}

function getSpecificationEntries(vehicle) {
  const nestedSpecifications = Object.entries(vehicle || {}).find(
    ([key, value]) =>
      ["specifications", "specs"].includes(normalizedKey(key)) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value),
  )?.[1];
  const entries = [
    ...Object.entries(vehicle || {}).filter(
      ([key]) => !excludedSpecificationFields.has(normalizedKey(key)),
    ),
    ...Object.entries(nestedSpecifications || {}),
  ];

  return entries
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({
      label: formatFieldLabel(key),
      value: formatSpecificationValue(key, value),
    }));
}

function VehiclePresentation() {
  const { vehicleCategory: routeCategory, vehicleName } = useParams();
  const [presentation, setPresentation] = useState({
    vehicleName: "",
    vehicle: null,
    error: "",
  });
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (!vehicleName) return undefined;

    const controller = new AbortController();
    fetch(
      `/api/vehicle-presentations/${encodeURIComponent(vehicleName)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const payload = await readApiJson(response);
        if (!payload.success || !payload.vehicle) {
          throw new Error(payload.message || `HTTP ${response.status}`);
        }
        return payload.vehicle;
      })
      .then((data) => {
        setPresentation({ vehicleName, vehicle: data, error: "" });
        setSelectedColor("");
      })
      .catch((fetchError) => {
        if (fetchError.name === "AbortError") return;
        console.error("Failed to load vehicle presentation:", fetchError);
        setPresentation({
          vehicleName,
          vehicle: null,
          error: fetchError.message || "Failed to load vehicle details.",
        });
      });

    return () => controller.abort();
  }, [vehicleName]);

  const isCurrentVehicle = presentation.vehicleName === vehicleName;
  const vehicle = isCurrentVehicle ? presentation.vehicle : null;
  const loading = Boolean(vehicleName) && !isCurrentVehicle;
  const error = vehicleName
    ? isCurrentVehicle
      ? presentation.error
      : ""
    : "Select a vehicle to view its presentation.";
  const vehicleCategory = getVehicleValue(vehicle || {}, categoryFields);
  const category = vehicleCategory || routeCategory || "";
  const isThreeWheeler = /three|3\s*-?\s*wheel/i.test(String(category));
  const categoryLabel = category || "Electric Vehicle";
  const listPath = isThreeWheeler ? "/vehicles" : "/twowheelers";

  const media = getVehicleMedia(vehicle);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-[#f4f7f3] px-6 text-[#173c34]">
        <div
          role="status"
          className="h-2 w-40 animate-pulse rounded-full bg-[#dce6df]"
        >
          <span className="sr-only">Loading vehicle details...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-[#f4f7f3] px-6 text-center text-[#173c34]">
        <p role="alert">{error}</p>
        <Link to={listPath} className="font-semibold underline">
          Back to {isThreeWheeler ? "three-wheelers" : "two-wheelers"}
        </Link>
      </main>
    );
  }
  if (!vehicle) return null;

  const name = getVehicleValue(vehicle, nameFields) || vehicleName;
  const tagline = getVehicleValue(vehicle, ["tagline", "short description", "description"]);
  const range = getVehicleValue(vehicle, rangeFields);
  const power = getVehicleValue(vehicle, powerFields);
  const categoryIcon = isThreeWheeler ? Truck : Bike;
  const categoryValue = formatFieldValue(category || categoryLabel);
  const specificationEntries = getSpecificationEntries(vehicle);
  const keySpecifications = [
    range && {
      label: "Range",
      value: formatSpecificationValue("range", range),
    },
    power && {
      label: "Motor power",
      value: formatSpecificationValue("power", power),
    },
    ...specificationEntries.filter((item) =>
      ["batterycapacity", "maximumspeed", "maxspeed", "topspeed", "chargingtime", "payloadcapacity", "payload"]
        .includes(normalizedKey(item.label)),
    ),
  ].filter(Boolean).filter(
    (item, index, items) =>
      items.findIndex((candidate) => normalizedKey(candidate.label) === normalizedKey(item.label)) === index,
  );
  const selectedColorData =
    media.colors.find((color) => color.key === selectedColor) ||
    (!selectedColor
      ? media.colors.find((color) => media.colorImages.has(color.key))
      : undefined);
  const activeColor = selectedColorData?.key || "";
  const selectedColorImages = activeColor
    ? media.colorImages.get(activeColor) || []
    : [];
  const galleryImages = selectedColorImages.length
    ? selectedColorImages
    : media.images;

  return (
    <main className="min-h-screen bg-[#f4f7f3] text-[#171b19]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.23em] text-[#31705f]">
              Eko Tejas <span className="px-1 text-[#9ba8a0]">/</span> {categoryLabel}
            </p>
            <h1 className="mt-3 font-[Manrope,sans-serif] text-4xl font-extrabold tracking-[-0.06em] text-[#173c34] sm:text-5xl lg:text-6xl">
              {name}
            </h1>
            {tagline && (
              <p className="mt-3 max-w-xl text-base leading-7 text-[#52635d]">
                {formatFieldValue(tagline)}
              </p>
            )}
          </div>
          <Link
            to={listPath}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d3ded6] bg-white px-5 py-3 text-sm font-semibold text-[#173c34] transition hover:border-[#aabbb0] hover:bg-[#fafffb]"
          >
            Browse vehicles <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <section
          id="gallery"
          aria-label={`${name} image gallery`}
          className="grid scroll-mt-28 gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.75fr)] lg:gap-10"
        >
          <div className="min-w-0">
            <VehicleGallery
              key={`${name}-${activeColor || "default"}`}
              images={galleryImages}
              vehicleName={name}
              colorName={selectedColorData?.name}
            />
            <div className="mt-6">
              <VehicleColorSelector
                colors={media.colors}
                selectedColor={activeColor}
                onSelect={(color) =>
                  setSelectedColor(
                    media.colors.some((availableColor) => availableColor.key === color)
                      ? color
                      : "",
                  )
                }
              />
            </div>
          </div>

          <aside className="flex flex-col gap-7 rounded-[28px] border border-[#e1e7e2] bg-white p-6 sm:p-8 lg:p-9">
            <div className="flex items-center gap-3">
              {categoryIcon && (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf3ee] text-[#31705f]">
                  {isThreeWheeler ? (
                    <Truck aria-hidden="true" size={19} />
                  ) : (
                    <Bike aria-hidden="true" size={19} />
                  )}
                </span>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#748078]">
                  Vehicle category
                </p>
                <p className="mt-1 text-sm font-semibold text-[#173c34]">
                  {categoryValue}
                </p>
              </div>
            </div>

            {keySpecifications.length > 0 ? (
              <section aria-label={`${name} key specifications`}>
                <h2 className="mb-3 text-sm font-semibold text-[#173c34]">
                  Key specifications
                </h2>
                <VehicleSpecifications items={keySpecifications} compact />
              </section>
            ) : (
              <p className="text-sm leading-6 text-[#748078]">
                Detailed specifications are listed below when available.
              </p>
            )}

            <a
              href="#specifications"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0b4b40] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#173c34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705f]"
            >
              Explore specifications <ArrowDown size={16} aria-hidden="true" />
            </a>
          </aside>
        </section>

        <nav
          aria-label="Vehicle details"
          className="sticky top-[86px] z-20 mt-8 border-y border-[#dfe5df] bg-[#f4f7f3]/95 backdrop-blur"
        >
          <div className="flex gap-7 overflow-x-auto sm:gap-10">
            {pageSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 border-b-2 border-transparent py-4 text-sm font-semibold text-[#727873] transition hover:border-[#173c34] hover:text-[#173c34]"
              >
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="overview"
          className="grid scroll-mt-28 gap-8 border-b border-[#dfe5df] py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-16"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#31705f]">
              Overview
            </p>
            <h2 className="mt-3 font-[Manrope,sans-serif] text-3xl font-bold tracking-[-0.045em] text-[#173c34] sm:text-4xl">
              Made for the way you move.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-base leading-7 text-[#555e58]">
              {tagline
                ? formatFieldValue(tagline)
                : `Explore the ${name} and its technical specifications.`}
            </p>
          </div>
        </section>

        <section
          id="specifications"
          className="scroll-mt-28 border-b border-[#dfe5df] py-12 md:py-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#31705f]">
            Technical details
          </p>
          <h2 className="mt-3 font-[Manrope,sans-serif] text-3xl font-bold tracking-[-0.045em] text-[#173c34] sm:text-4xl">
            Specifications
          </h2>
          {specificationEntries.length ? (
            <div className="mt-8">
              <VehicleSpecifications items={specificationEntries} />
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#555e58]">
              No specifications are available for this vehicle.
            </p>
          )}
        </section>

        <section
          id="features"
          className="scroll-mt-28 border-b border-[#dfe5df] py-12 md:py-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#31705f]">
            The details
          </p>
          <h2 className="mt-3 font-[Manrope,sans-serif] text-3xl font-bold tracking-[-0.045em] text-[#173c34] sm:text-4xl">
            Designed around your everyday.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-[#555e58]">
            Explore the vehicle photos, available finishes, and specifications above.
          </p>
        </section>

        <section
          id="support"
          className="scroll-mt-28 py-12 md:py-16"
        >
          <div className="rounded-[28px] bg-[#102f27] px-6 py-9 text-white sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b7cec1]">
                Service & Support
              </p>
              <h2 className="mt-3 font-[Manrope,sans-serif] text-3xl font-bold tracking-[-0.045em]">
                Looking for your next ride?
              </h2>
            </div>
            <Link
              to={listPath}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#102f27] transition hover:bg-[#e8eee9] md:mt-0"
            >
              Browse {isThreeWheeler ? "three-wheelers" : "two-wheelers"}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default VehiclePresentation;
