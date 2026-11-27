/**
 * All the words on the About page, in one place.
 *
 * WHY a data file: the company story and team bios will change over time.
 * Editing text here is safer than digging through page layout code, and
 * the page (src/Pages/About.jsx) only decides how it LOOKS.
 *
 * Source: the company's existing "About us" content. Only typos and small
 * grammar points were fixed (e.g. "automobila" -> "automobile", "Orissa" ->
 * its official name "Odisha"); the meaning is unchanged.
 */
import shriyalThakreyPhoto from "../assets/team/shriyal-thakrey.webp";
import venkateshTejaPhoto from "../assets/team/venkatesh-teja.webp";

export const company = {
  legalName: "Green Fuel Alternatives Pvt. Ltd.",
  intro:
    "EKOTEJAS is the electric vehicle brand of Green Fuel Alternatives Pvt. Ltd., an EV company established in 2017. We are headquartered in Gooty, Anantapur Dist, Andhra Pradesh, with our corporate office in Erandawane, Pune.",
  story:
    "Green Fuel Alternatives Pvt. Ltd. is an EV start-up looking to make a difference in the transportation space through its brand 'EKOTEJAS'. We at Green Fuels intend to disrupt the automotive industry by making transportation economical and environment friendly.",
};

// `count: false` = show as-is (a year shouldn't count up from 0 like a number).
export const aboutStats = [
  { value: "2017", label: "Established", count: false },
  { value: "100", label: "Dealers (nearly)" },
  { value: "10", label: "States with dealers" },
  { value: "720", label: "E-bikes per month today" },
];

/*
 * Vision and mission share ONE shape (title, summary, 4 points), so the two
 * cards on the page look and read the same.
 * Vision points 1-3 come from the original vision sentence:
 *   "EKOTEJAS aims to become a trusted brand in the EV segment, by serving
 *    customers efficiently, creating a platform to build wealth for its
 *    stakeholders, employees, dealers and more."
 * Point 4 was added to balance the card, drawn from the mission and the
 * dealer-network story. Edit freely.
 */
export const vision = {
  title: "Where we're going",
  summary: "To become a trusted brand in India's EV segment.",
  points: [
    "Become a trusted name in the EV segment, known for dependable vehicles.",
    "Serve every customer efficiently, from the first test drive to after-sales service.",
    "Build a platform that creates wealth for our stakeholders, employees and dealers.",
    "Make electric the everyday choice for families and businesses across India.",
  ],
};

export const mission = {
  title: "How we'll get there",
  summary: "Clean, affordable electric mobility for everyone.",
  points: [
    "Develop products that lower carbon emissions and reduce dependence on conventional fuels.",
    "Develop EV automobiles affordable to all classes of people, including the masses, with low running costs.",
    "Grow continuously to become a top EV company representing the Indian EV industry on the global platform.",
    "Become a platform that contributes to the wealth building of employees, dealers and everyone associated with us.",
  ],
};

export const parentGroup = {
  name: "KPS Group of Companies",
  text: "Green Fuel Alternatives Pvt. Ltd. is a part of the KPS Group of Companies, one of the renowned industrial organizations with a presence in the Kurnool, Nandyal and Anantapur districts of Andhra Pradesh. We are a 30-year-old industrial organization with experience in diversified industries.",
  industries: [
    "Edible oil milling",
    "5.5 MW biomass power plant",
    "1,250 TPD sugar plant",
    "Transformer manufacturing (25,000 / annum)",
    "100 TPD mini-integrated steel plant",
    "Real estate and housing development",
  ],
};

export const factory = {
  text: "Our manufacturing base in Anantapur Dist, Andhra Pradesh was established with an investment of Rs. 10 crores. It has a current capacity of 720 e-bikes and 100 e-carts per month, and the basic infrastructure to produce up to 15,000 e-bikes per month.",
  facts: [
    { value: "₹10 Cr", label: "Investment" },
    { value: "Ac. 12.00", label: "Land area" },
    { value: "25,000 sq ft", label: "Built-up area" },
    { value: "15,000 / month", label: "E-bike infrastructure capacity" },
  ],
};

export const dealerNetwork = {
  text: "We have an established dealer presence of nearly 100 dealers. We are one of the fastest growing brands, especially in the states of Maharashtra and Andhra Pradesh.",
  states: [
    "Maharashtra",
    "Madhya Pradesh",
    "West Bengal",
    "Haryana",
    "Odisha",
    "Uttar Pradesh",
    "Andhra Pradesh",
    "Telangana",
    "Karnataka",
    "Tamil Nadu",
  ],
};

export const team = [
  {
    name: "K. Venkatesh Teja",
    role: "Founder of EKOTEJAS",
    photo: venkateshTejaPhoto,
    bio: [
      "K. Venkatesh Teja is the founder of EKOTEJAS. In 2017, he started EKOTEJAS, an e-cargo manufacturing brand, with an aim to bring electric mobility to the poor. He holds a Master's Degree from the University of Westminster, London and graduated from the University of Madras, Chennai.",
      "Mr. Venkatesh Teja belongs to an industrial family business house that has been operating diversified manufacturing industries for over two decades, such as steel, edible oil, power generation, sugar and transformers. The business group was one of the top-most edible oil extractors in southern Andhra Pradesh. Their experience helped them take over a 30-year defunct sugar plant from the Govt. of AP in 2003, which was brought into operation within just 180 days of taking over.",
      "During his tenure, Mr. Teja paid special attention to by-product value addition and spearheaded a particle board manufacturing industry, using sugarcane bagasse as raw material. He also played a key role in operating and managing the family-owned steel plant, which he recently took over completely from his predecessors. His notable achievement in the unit lies in updating its management and information system to a completely automated, cloud-based system.",
      "He later joined hands with Mr. Shriyal Thakrey, who is currently serving as Director (Sales) at EKOTEJAS. The duo diversified the product portfolio to EV 2-wheelers in 2021. Within just one year, the company had dealer presence in over 10 states.",
    ],
  },
  {
    name: "Mr. Shriyal M. Thakrey",
    role: "Director (Sales)",
    photo: shriyalThakreyPhoto,
    bio: [
      "Mr. Shriyal M. Thakrey joined EKOTEJAS as Director (Sales) in 2021, heading the company's Corporate Office in Pune. Under his leadership, the company has grown manifold, increasing its presence PAN India.",
      "Mr. Thakrey started his working career as a full-time consultant at M/s Adecco India HR Solutions, a Fortune 500 recruitment company. He entered the business world in 2009 by starting his own recruitment firm, M/s SMT HR Management. The firm went on to place over 7,500 job seekers and highly skilled professionals in diversified industries such as automobile, automobile components, banking and retail. His candidates now include top-level managers in various MNCs and private banks such as ICICI and HDFC.",
      "His entrance into the EV industry was in 2018, when he joined M/s Tunwal E-vehicles Private Limited, Pune as Chief Executive Officer (CEO). He was responsible for the complete end-to-end management of Tunwal, with a higher contribution towards marketing, sales, dealer development and overseas sales, apart from supply chain, HR and production. Noting his contribution, he was promoted to Additional Director within just one year, in 2019. During his tenure, Tunwal saw a 7X YoY increase in sales and developed a PAN India dealer network, and the brand also built a presence in overseas markets like Sri Lanka and Nepal.",
      "At EKOTEJAS, Mr. Thakrey is responsible for all of the company's sales, marketing and allied activities, including end-to-end management of the dealer network: dealer development, sales, service and support PAN India. He heads the Pune division and plays a key role in developing strategic reseller and supplier relationships, ensuring flexibility in an increasingly demanding marketplace. He builds supportive teams and provides end-to-end support with a service-oriented approach.",
    ],
  },
];
