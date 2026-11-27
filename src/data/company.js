/**
 * Company facts shown in more than one place (Contact section, About page).
 *
 * WHY one shared file: if an address or number changes, it changes here
 * once, and every page shows the same thing. Before, the office details
 * lived only inside Contact.jsx, so the About page would have needed a
 * second copy that could quietly go out of date.
 */

export const offices = [
  {
    title: "Head office",
    city: "Gooty, Andhra Pradesh",
    address: "1/137, Sreenilayam, KPS Complex, Gooty – 515402, Anantapur Dist",
    emails: ["info@ekotejas.in", "admin@tejasevehicles.com"],
  },
  {
    title: "Corporate office",
    city: "Pune, Maharashtra",
    address: "#2, Tejashree Park Soc, S. No 69, CTS No. 122/A, Erandawane, Pune – 411004",
    emails: ["sales@ekotejas.in", "sales.manager@ekotejas.in", "director.sales@ekotejas.in"],
  },
];


export const mediaEmail = "info@ekotejas.in";
