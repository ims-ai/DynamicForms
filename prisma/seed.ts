import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const autoSchema = {
  steps: [
    {
      id: "personal",
      title: "Personal Info",
      description: "Tell us who you are",
      fields: [
        { id: "name", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email", type: "email", required: true },
        { id: "phone", label: "Phone", type: "phone", required: true },
        { id: "dob", label: "Date of Birth", type: "date" }
      ]
    },
    {
      id: "vehicle",
      title: "Vehicle Details",
      description: "Your vehicle",
      fields: [
        { id: "vehicleYear", label: "Year", type: "number", required: true },
        { id: "vehicleMake", label: "Make", type: "text", required: true },
        { id: "vehicleModel", label: "Model", type: "text", required: true },
        { id: "vin", label: "VIN", type: "text" }
      ]
    },
    {
      id: "coverage",
      title: "Coverage",
      fields: [
        { id: "currentInsurer", label: "Current Insurer", type: "text" },
        { id: "currentPremium", label: "Current Premium", type: "currency" }
      ]
    },
    {
      id: "documents",
      title: "Documents",
      fields: [
        { id: "driversLicense", label: "Driver's License", type: "file" },
        { id: "currentPolicy", label: "Current Policy", type: "file" }
      ]
    }
  ],
  settings: { progressIndicator: "steps", allowFileUpload: true }
};

const homeSchema = {
  steps: [
    {
      id: "personal",
      title: "Personal Info",
      fields: [
        { id: "name", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email", type: "email", required: true },
        { id: "phone", label: "Phone", type: "phone", required: true }
      ]
    },
    {
      id: "property",
      title: "Property Details",
      fields: [
        { id: "propertyAddress", label: "Property Address", type: "text", required: true },
        {
          id: "propertyType",
          label: "Property Type",
          type: "select",
          options: [
            { label: "Single Family", value: "single" },
            { label: "Condo", value: "condo" },
            { label: "Townhome", value: "townhome" }
          ],
          required: true
        },
        { id: "yearBuilt", label: "Year Built", type: "number" },
        { id: "squareFootage", label: "Square Footage", type: "number" },
        { id: "hasPool", label: "Has Pool?", type: "yesno" }
      ]
    },
    {
      id: "coverage",
      title: "Coverage Needs",
      fields: [
        { id: "currentInsurer", label: "Current Insurer", type: "text" },
        { id: "desiredCoverage", label: "Desired Coverage", type: "currency" }
      ]
    },
    {
      id: "documents",
      title: "Documents",
      fields: [{ id: "propertyPhotos", label: "Property Photos", type: "file" }]
    }
  ],
  settings: { progressIndicator: "steps", allowFileUpload: true }
};

const lifeSchema = {
  steps: [
    {
      id: "personal",
      title: "Personal Info",
      fields: [
        { id: "name", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email", type: "email", required: true },
        { id: "phone", label: "Phone", type: "phone", required: true },
        { id: "dob", label: "Date of Birth", type: "date" }
      ]
    },
    {
      id: "health",
      title: "Health Info",
      fields: [
        { id: "smoker", label: "Smoker", type: "yesno" },
        {
          id: "healthConditions",
          label: "Health Conditions",
          type: "checkboxGroup",
          options: [
            { label: "Diabetes", value: "diabetes" },
            { label: "Heart Disease", value: "heart" },
            { label: "Cancer", value: "cancer" }
          ]
        }
      ]
    },
    {
      id: "coverage",
      title: "Coverage Needs",
      fields: [
        { id: "coverageAmount", label: "Coverage Amount", type: "currency" },
        { id: "beneficiaryName", label: "Beneficiary Name", type: "text" },
        { id: "additionalNotes", label: "Additional Notes", type: "textarea" }
      ]
    }
  ],
  settings: { progressIndicator: "steps" }
};

const contactSchema = {
  steps: [
    {
      id: "contact",
      title: "Contact",
      fields: [
        { id: "name", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email", type: "email", required: true },
        { id: "phone", label: "Phone", type: "phone" },
        {
          id: "subject",
          label: "Subject",
          type: "select",
          options: [
            { label: "General", value: "general" },
            { label: "Billing", value: "billing" },
            { label: "Claims", value: "claims" }
          ]
        },
        { id: "message", label: "Message", type: "textarea", required: true },
        { id: "attachment", label: "Attachment", type: "file" }
      ]
    }
  ],
  settings: { progressIndicator: "none", allowFileUpload: true }
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "hani@selectfirstinsurance.com";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Platform Admin",
      role: "ADMIN"
    }
  });

  const templates = [
    { name: "Auto Insurance Quote", slug: "auto-insurance-quote", schema: autoSchema },
    { name: "Home Insurance Quote", slug: "home-insurance-quote", schema: homeSchema },
    { name: "Life Insurance Inquiry", slug: "life-insurance-inquiry", schema: lifeSchema },
    { name: "General Contact", slug: "general-contact", schema: contactSchema }
  ];

  for (const template of templates) {
    await prisma.formTemplate.upsert({
      where: { slug: template.slug },
      update: {},
      create: {
        name: template.name,
        slug: template.slug,
        schema: template.schema,
        settings: template.schema.settings ?? {},
        status: "ACTIVE"
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
