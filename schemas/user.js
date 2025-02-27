const $schema_hunter = {
  address: {
    address: "",
    city: "",
    postalCode: "",
  },
  birthdate: "",
  birthplace: "",
  bio: "",
  connections: [],
  createdAt: "",
  education: [],
  email: "",
  gender: "",
  id: "",
  fullName: {
    first: "",
    last: "",
    middle: "",
  },
  phone: "",
  skillPrimary: "",
  skillSecondary: [],
  socialMediaLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  type: "",
  updatedAt: "",
  username: "",
};

const $schema_provisioner = {
  address: {
    physicalAddress: "",
    city: "",
    postalCode: "",
  },
  alternativeNames: [],
  companySize: "",
  companyType: "",
  contactInformation: {
    email: "",
    phone: "",
  },
  foundingYear: 0,
  fullDescription: "",
  id: "",
  industryType: "",
  jobPostings: [],
  legalName: "",
  shortDescription: "",
  socialProfiles: {
    facebook: "",
    github: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
  tags: [],
  type: "",
  website: "",
};

const $prov_companyType = [
  "Companies Limited by Shares",
  "Companies Limited by Guarantee",
  "Unlimited Companies",
  "One Person Companies (OPC)",
  "Private Companies",
  "Public Companies",
  "Holding and Subsidiary Companies",
  "Associate Companies",
  "Companies in terms of Access to Capital",
  "Government Companies",
  "Foreign Companies",
  "Charitable Companies",
  "Dormant Companies",
  "Nidhi Companies",
  "Public Financial Institutions",
];

const $prov_industryType = [
  "Agriculture, Forestry, Fishing and Hunting",
  "Mining, Quarrying, and Oil and Gas Extraction",
  "Utilities",
  "Construction",
  "Manufacturing",
  "Wholesale Trade",
  "Retail Trade",
  "Transportation and Warehousing",
  "Information",
  "Finance and Insurance",
  "Real Estate and Rental and Leasing",
  "Professional, Scientific, and Technical Services",
  "Management of Companies and Enterprises",
  "Administrative and Support and Waste Management and Remediation Services",
  "Educational Services",
  "Health Care and Social Assistance",
  "Arts, Entertainment, and Recreation",
  "Accommodation and Food Services",
  "Other Services (except Public Administration)",
  "Public Administration",
];

const $prov_companySize = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
  "10001-50000",
  "50001-100000",
  "100001-500000",
  "50000+",
];

const $prov_tags = [
  "Accounting",
  "Aerospace",
  "Agriculture",
  "Apparel",
  "Architecture",
  "Automotive",
  "Banking",
  "Biotechnology",
  "Business Services",
  "Chemicals",
  "Communications",
  "Construction",
  "Consulting",
  "Consumer Goods",
  "Cosmetics",
  "Defense",
  "Education",
  "Electronics",
  "Energy",
  "Engineering",
  "Entertainment",
  "Environmental",
  "Finance",
  "Food & Beverage",
  "Government",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Internet",
  "Legal",
  "Manufacturing",
  "Marketing",
  "Media",
  "Not For Profit",
  "Pharmaceuticals",
  "Public Relations",
  "Real Estate",
  "Retail",
  "Shipping",
  "Technology",
  "Telecommunications",
  "Transportation",
  "Utilities",
  "Venture Capital",
  "Other",
];

const $job_details = {
  id: "", // job id (uuid v4)
  uploader_id: "", // provisioner id
  job_title: "", // job title
  full_description: "", // markdown text
  short_description: "", // truncated from full_description (max 200 chars)
  job_location: "", // city
  job_type: "", // full-time, part-time, contract, internship
  job_qualifications: [], // array of strings
};

export {
  $schema_hunter,
  $schema_provisioner,
  $prov_companyType,
  $prov_industryType,
  $prov_companySize,
  $prov_tags,
  $job_details,
};
