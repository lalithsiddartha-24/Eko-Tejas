import { ArrowLeft, ArrowRight, CalendarCheck, ChevronRight, MessageCircle, PhoneCall, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageMeta from "../Components/PageMeta";
import TestDriveForm from "../Components/TestDriveForm";
import {
  VehicleColorSelector,
  VehicleGallery,
  VehicleKeySpecs,
  VehicleSpecifications,
} from "../Components/VehicleShowcase";
import { getVehicleMedia } from "../Components/vehicleShowcaseUtils";
import Button from "../Components/ui/Button";
import Container from "../Components/ui/Container";
import Reveal from "../Components/ui/Reveal";
import SectionHeading from "../Components/ui/SectionHeading";
import { readApiJson } from "../utils/api";
import {
  formatFieldValue,
  formatSpecificationValue,
  isThreeWheelerCategory,
  normalizedKey,
} from "../utils/vehicleFormat";

const nameFields = ["name", "vehicle name", "model", "model name", "title"];
const categoryFields = ["category", "vehicle category", "type", "vehicle type"];
const rangeFields = ["range", "driving range", "range per charge"];
const powerFields = ["power", "rated power", "motor power"];

// Fields that are shown elsewhere on the page, so they don't belong in the spec list.
const excludedSpecificationFields = new Set([
  "id", "createdat", "updatedat",
  "name", "vehiclename", "model", "modelname", "title", "vehicle",
  "category", "vehiclecategory", "type", "vehicletype",
  "tagline", "description", "shortdescription",
  "image", "imageurl", "vehicleimage", "photo", "photourl",
  "images", "gallery", "photos", "vehicleimages", "imageurls", "pictures",
  "availablecolors", "colors", "coloroptions", "vehiclecolors", "color", "colour",
  "specifications", "specs",
]);

const pageSections = [
  { label: "Overview", id: "overview" },
  { label: "Specifications", id: "specifications" },
  { label: "Test drive", id: "book" },
  { label: "Support", id: "support" },
];

function getVehicleValue(vehicle, fieldNames) {
  const normalizedFields = new Set(fieldNames.map(normalizedKey));
  return Object.entries(vehicle || {}).find(
    ([key, value]) =>
      normalizedFields.has(normalizedKey(key)) && value !== null && value !== undefined && value !== "",
  )?.[1];
}

// Friendly names for the spec sheet columns (backend: vehicle_specifications).
// WHY: turning "dimensions_mm_detail" into words automatically gives
// "Dimensions Mm Detail". Customers should read "Dimensions (mm)".
// Any column not listed here still gets an automatic label below.
const specificationLabels = {
  top_speed: "Top speed",
  voltage: "Voltage",
  rated_power: "Rated power",
  motor_type: "Motor type",
  motor_type_detail: "Motor type",
  motor_power_options: "Motor power options",
  battery_options_and_range: "Battery options & range",
  battery_type_detail: "Battery type",
  battery_quantity: "Number of batteries",
  charging_duration: "Charging time",
  charger_specifications: "Charger",
  controller: "Controller",
  controller_detail: "Controller",
  transmission_mode: "Transmission",
  brakes: "Brakes",
  suspension: "Suspension",
  wheels_and_tyre_size: "Wheels & tyre size",
  dimensions_mm: "Dimensions (mm)",
  dimensions_mm_detail: "Dimensions (mm)",
  ground_clearance_mm: "Ground clearance (mm)",
  ground_clearance_detail: "Ground clearance",
  boot_space_liters: "Boot space (litres)",
  loading_capacity: "Loading capacity",
  carrying_capacity_detail: "Carrying capacity",
  cargo_dimensions: "Cargo box size",
  curb_weight: "Kerb weight",
  gradeability: "Gradeability",
  lighting: "Lighting",
  speedometer: "Speedometer",
  smart_features: "Smart features",
  additional_fittings: "Additional fittings",
};

function formatFieldLabel(key) {
  if (specificationLabels[key]) return specificationLabels[key];
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toLocaleUpperCase());
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
    ...Object.entries(vehicle || {}).filter(([key]) => !excludedSpecificationFields.has(normalizedKey(key))),
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
  const [presentation, setPresentation] = useState({ vehicleName: "", vehicle: null, error: "" });
  const [selectedColor, setSelectedColor] = useState("");

  // --- Data loading: unchanged. GET /api/vehicles/:name, read with readApiJson. ---
  useEffect(() => {
    if (!vehicleName) return undefined;

    const controller = new AbortController();
    fetch(`/api/vehicles/${encodeURIComponent(vehicleName)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await readApiJson(response);
        if (!payload.success || !payload.data) {
          throw new Error(payload.message || `HTTP ${response.status}`);
        }
        return payload.data;
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
    : "Select a vehicle to view its details.";
  const category = getVehicleValue(vehicle || {}, categoryFields) || routeCategory || "";
  const isThreeWheeler = isThreeWheelerCategory(category);
  const listPath = isThreeWheeler ? "/vehicles" : "/twowheelers";
  const listLabel = isThreeWheeler ? "3-Wheelers" : "2-Wheelers";

  const media = getVehicleMedia(vehicle);

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5 py-20">
        <PageMeta title="Vehicle not found" />
        <div role="alert" className="flex max-w-md flex-col items-center rounded-[2rem] border border-forest-900/8 bg-white px-8 py-14 text-center shadow-soft">
          <h1 className="font-display text-2xl font-bold text-forest-900">We couldn&apos;t find that vehicle</h1>
          <p className="mt-2 text-muted">{error}</p>
          <Button to={listPath} variant="dark" className="mt-7">
            <ArrowLeft size={16} /> Back to {listLabel.toLowerCase()}
          </Button>
        </div>
      </main>
    );
  }
  if (!vehicle) return null;

  const name = getVehicleValue(vehicle, nameFields) || vehicleName;
  const tagline = getVehicleValue(vehicle, ["tagline", "short description", "description"]);
  const range = getVehicleValue(vehicle, rangeFields);
  const power = getVehicleValue(vehicle, powerFields);
  const specificationEntries = getSpecificationEntries(vehicle);
  const keySpecifications = [
    range && { label: "Range", value: formatSpecificationValue("range", range) },
    power && { label: "Motor power", value: formatSpecificationValue("power", power) },
    ...specificationEntries.filter((item) =>
      ["batterycapacity", "maximumspeed", "maxspeed", "topspeed", "chargingtime", "payloadcapacity", "payload"].includes(
        normalizedKey(item.label),
      ),
    ),
  ]
    .filter(Boolean)
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => normalizedKey(candidate.label) === normalizedKey(item.label)) === index,
    );
  const selectedColorData =
    media.colors.find((color) => color.key === selectedColor) ||
    (!selectedColor ? media.colors.find((color) => media.colorImages.has(color.key)) : undefined);
  const activeColor = selectedColorData?.key || "";
  const selectedColorImages = activeColor ? media.colorImages.get(activeColor) || [] : [];
  const galleryImages = selectedColorImages.length ? selectedColorImages : media.images;
  const taglineText = tagline ? formatFieldValue(tagline) : "";

  return (
    <main>
      <PageMeta title={`${name}${isThreeWheeler ? " electric three-wheeler" : " electric scooter"}`} />
      {/* ---------- 1. Product hero: gallery + buy box ---------- */}
      <section className="pb-12 pt-6 sm:pt-10">
        <Container>
          {/* Breadcrumb: shows where you are and gives a quick way back. */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <li><Link to="/" className="hover:text-forest-900">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link to={listPath} className="hover:text-forest-900">{listLabel}</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li aria-current="page" className="font-semibold text-forest-900">{name}</li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)] lg:gap-10">
            <div id="gallery" className="min-w-0">
              <VehicleGallery
                key={`${name}-${activeColor || "default"}`}
                images={galleryImages}
                vehicleName={name}
                colorName={selectedColorData?.name}
                isThreeWheeler={isThreeWheeler}
              />
            </div>

            {/* "Buy box": on desktop it sticks while the gallery scrolls past. */}
            <aside className="flex flex-col gap-7 self-start rounded-[2rem] border border-forest-900/8 bg-white p-6 shadow-soft sm:p-8 lg:sticky lg:top-28">
              <div>
                <p className="inline-flex rounded-full bg-mint-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-forest-600">
                  {formatFieldValue(category || "Electric vehicle")}
                </p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-forest-950 sm:text-5xl">
                  {name}
                </h1>
                {taglineText && <p className="mt-3 text-base leading-7 text-muted">{taglineText}</p>}
              </div>

              {(range || power) && (
                <dl className="grid grid-cols-2 gap-2">
                  {keySpecifications.slice(0, 2).map((item) => (
                    <div key={item.label} className="rounded-2xl bg-mint-50 p-4">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{item.label}</dt>
                      <dd className="mt-1 font-display text-xl font-bold text-forest-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <VehicleColorSelector
                colors={media.colors}
                selectedColor={activeColor}
                onSelect={(color) =>
                  setSelectedColor(media.colors.some((availableColor) => availableColor.key === color) ? color : "")
                }
              />

              <div className="flex flex-col gap-2.5">
                <Button href="#book" size="lg">
                  <CalendarCheck size={18} /> Book a test drive
                </Button>
                <Button to="/#contact" state={{ enquiryType: "pricing" }} variant="outline" size="lg">
                  <MessageCircle size={18} /> Ask about pricing
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ---------- 2. In-page navigation (sticks under the navbar) ---------- */}
      {/* When the main navbar hides (html has data-nav-hidden), these tabs slide up to the very top. */}
      <nav
        aria-label="Vehicle sections"
        className="sticky top-[5.25rem] z-30 border-y border-forest-900/8 bg-mint-50/90 backdrop-blur-lg transition-[top] duration-300 ease-out motion-reduce:transition-none sm:top-[5.5rem] [[data-nav-hidden]_&]:top-0"
      >
        <Container className="flex gap-6 overflow-x-auto sm:gap-9">
          {pageSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 border-b-2 border-transparent py-3.5 text-sm font-semibold text-muted transition-colors hover:border-forest-900 hover:text-forest-900"
            >
              {section.label}
            </a>
          ))}
        </Container>
      </nav>

      {/* ---------- 3. Overview + big numbers ---------- */}
      <section id="overview" className="bg-mint-50 py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionHeading eyebrow="Overview" title="Made for the way" accent="you move." />
            <p className="text-lg leading-8 text-muted">
              {taglineText || `Explore the ${name}, its photos, finishes and full technical specifications.`}
            </p>
          </div>
          {keySpecifications.length > 0 && (
            <Reveal className="mt-12">
              <VehicleKeySpecs items={keySpecifications} />
            </Reveal>
          )}
        </Container>
      </section>

      {/* ---------- 4. Full specifications ---------- */}
      <section id="specifications" className="py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Technical details" title="Specifications" />
          {specificationEntries.length ? (
            <Reveal className="mt-10 rounded-[2rem] border border-forest-900/8 bg-white px-6 py-3 shadow-soft sm:px-9 sm:py-5">
              <VehicleSpecifications items={specificationEntries} />
            </Reveal>
          ) : (
            <p className="mt-6 text-muted">Detailed specifications for this vehicle are coming soon.</p>
          )}
        </Container>
      </section>

      {/* ---------- 5. Book a test drive ---------- */}
      <section id="book" className="bg-white py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Test drive"
              title={`Try the ${name}`}
              accent="for yourself."
              description="Pick a day and a time that suits you. It's free, and there's no obligation to buy."
            />
            <ol className="mt-10 space-y-5">
              {[
                { icon: CalendarCheck, title: "Choose a date", text: "Any day in the next 60 days." },
                { icon: PhoneCall, title: "We call to confirm", text: "Our team confirms the time and place." },
                { icon: ShieldCheck, title: "Take it for a ride", text: "Feel the quiet, smooth electric drive." },
              ].map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-4">
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-100 text-forest-700">
                    <Icon size={19} aria-hidden="true" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-forest-950 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </span>
                  <div>
                    <p className="font-display font-bold text-forest-900">{title}</p>
                    <p className="text-sm text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-forest-900/8 bg-mint-50 p-6 sm:p-9">
            {vehicle.id ? (
              <TestDriveForm vehicleId={vehicle.id} vehicleName={name} />
            ) : (
              // A booking needs the vehicle's id. Without it, offer the contact form instead.
              <div className="py-10 text-center">
                <p className="text-muted">Online booking isn&apos;t available for this model yet.</p>
                <Button to="/#contact" variant="dark" className="mt-5">Contact us to book</Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ---------- 6. Support call to action ---------- */}
      <section id="support" className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-8 rounded-[2rem] border border-forest-900/8 bg-mint-50 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-5">
              <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-forest-600 sm:grid">
                <Wrench size={24} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-forest-600">Service &amp; support</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-forest-950">Care that comes with every ride.</h2>
                <p className="mt-2 max-w-md text-muted">Expert mechanics, genuine spare parts and service plans for every budget.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/#service" variant="primary">See care plans</Button>
              <Button to={listPath} variant="outline">
                More {listLabel.toLowerCase()} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/** Page-shaped placeholder while the vehicle loads. */
function DetailSkeleton() {
  return (
    <main className="pb-16 pt-6 sm:pt-10">
      <Container>
        <div role="status" className="sr-only">Loading vehicle details…</div>
        <div aria-hidden="true">
          <div className="h-4 w-48 animate-pulse rounded-full bg-mint-200" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)] lg:gap-10">
            <div className="aspect-[4/3] animate-pulse rounded-[2rem] bg-mint-100 lg:aspect-[4/3.4]" />
            <div className="space-y-5 rounded-[2rem] border border-forest-900/8 bg-white p-8">
              <div className="h-5 w-28 animate-pulse rounded-full bg-mint-100" />
              <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-mint-100" />
              <div className="h-4 w-full animate-pulse rounded-full bg-mint-100" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-20 animate-pulse rounded-2xl bg-mint-50" />
                <div className="h-20 animate-pulse rounded-2xl bg-mint-50" />
              </div>
              <div className="h-13 animate-pulse rounded-full bg-mint-100" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default VehiclePresentation;
