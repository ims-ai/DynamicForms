# DynamicForms
Here's your complete, copy-paste-ready prompt for Replit:

------

## **Dynamic Insurance Form Platform - Full Specification**

Build a production-ready, schema-driven insurance lead capture platform where forms are defined via JSON configuration and rendered dynamically. This allows creating unlimited form types without code changes.

------

### **PROJECT OVERVIEW**

An insurance agency needs to collect leads through multiple form types (Auto, Home, Life, Business, etc.). Instead of hardcoding each form, build a dynamic system where:

- Forms are stored as JSON schemas in the database
- A single form engine renders any form based on its schema
- Admins can create/edit forms without touching code
- All submissions are centralized with filtering by form type

------

### **DATABASE SCHEMA (PostgreSQL with Prisma)**

```prisma
model User {
  id            String       @id @default(cuid())
  email         String       @unique
  name          String?
  image         String?
  role          Role         @default(USER)
  accounts      Account[]
  submissions   Submission[]
  createdAt     DateTime     @default(now())
}

enum Role {
  USER
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model FormTemplate {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  description String?
  schema      Json
  settings    Json
  status      FormStatus   @default(DRAFT)
  submissions Submission[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum FormStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

model Submission {
  id             String       @id @default(cuid())
  formTemplate   FormTemplate @relation(fields: [formTemplateId], references: [id])
  formTemplateId String
  user           User?        @relation(fields: [userId], references: [id])
  userId         String?
  guestEmail     String?
  data           Json
  files          Json?
  status         LeadStatus   @default(NEW)
  notes          String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum LeadStatus {
  NEW
  CONTACTED
  IN_PROGRESS
  QUOTED
  CLOSED_WON
  CLOSED_LOST
}

model FieldGroup {
  id     String @id @default(cuid())
  name   String @unique
  fields Json
}
```

------

### **FORM SCHEMA STRUCTURE**

Each FormTemplate's `schema` field contains:

```json
{
  "steps": [
    {
      "id": "step-1",
      "title": "Personal Information",
      "description": "Tell us about yourself",
      "fields": [
        {
          "id": "fullName",
          "type": "text",
          "label": "Full Name",
          "placeholder": "John Doe",
          "required": true,
          "validation": { "minLength": 2, "maxLength": 100 }
        },
        {
          "id": "email",
          "type": "email",
          "label": "Email Address",
          "required": true
        },
        {
          "id": "phone",
          "type": "phone",
          "label": "Phone Number",
          "required": true
        }
      ]
    },
    {
      "id": "step-2",
      "title": "Insurance Details",
      "fields": [
        {
          "id": "insuranceType",
          "type": "select",
          "label": "Type of Insurance",
          "required": true,
          "options": [
            { "value": "auto", "label": "Auto Insurance" },
            { "value": "home", "label": "Home Insurance" },
            { "value": "life", "label": "Life Insurance" }
          ]
        }
      ]
    }
  ],
  "fieldGroups": ["contactInfo", "documentUpload"]
}
```

Each FormTemplate's `settings` field contains:

```json
{
  "notifyEmails": ["hani@selectfirstinsurance.com"],
  "requireAuth": false,
  "allowGuestSubmission": true,
  "successMessage": "Thank you! We will contact you within 24 hours.",
  "redirectUrl": null,
  "submitButtonText": "Submit Request",
  "enableFileUploads": true,
  "maxFileSize": 10485760,
  "allowedFileTypes": [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]
}
```

------

### **SUPPORTED FIELD TYPES**

Build these reusable field components:

| Type            | Component      | Validation                    | Notes                      |
| --------------- | -------------- | ----------------------------- | -------------------------- |
| `text`          | TextInput      | minLength, maxLength, pattern | Standard text              |
| `email`         | EmailInput     | Valid email format            | Auto-validates             |
| `phone`         | PhoneInput     | US phone format               | Auto-format (xxx) xxx-xxxx |
| `select`        | Dropdown       | Required selection            | Options from schema        |
| `multiselect`   | MultiSelect    | Min/max selections            | Checkbox style             |
| `radio`         | RadioGroup     | Required                      | Single selection           |
| `checkbox`      | Checkbox       | Must be checked (for terms)   | Boolean                    |
| `checkboxGroup` | CheckboxGroup  | Min/max selections            | Multiple booleans          |
| `textarea`      | TextArea       | minLength, maxLength          | Multi-line                 |
| `number`        | NumberInput    | min, max                      | Numeric only               |
| `currency`      | CurrencyInput  | min, max                      | Dollar formatting          |
| `date`          | DatePicker     | minDate, maxDate              | Calendar picker            |
| `file`          | FileUpload     | maxSize, accept               | Single or multiple         |
| `address`       | AddressInput   | Required fields               | Street, City, State, Zip   |
| `yesno`         | YesNoToggle    | Required                      | Boolean with labels        |
| `heading`       | DisplayHeading | —                             | Section header (no input)  |
| `paragraph`     | DisplayText    | —                             | Instructions (no input)    |

------

### **CONDITIONAL LOGIC (Important)**

Fields can show/hide based on other field values:

```json
{
  "id": "vehicleCount",
  "type": "number",
  "label": "How many vehicles?",
  "showIf": {
    "field": "insuranceType",
    "operator": "equals",
    "value": "auto"
  }
}
```

Support operators: `equals`, `notEquals`, `contains`, `greaterThan`, `lessThan`, `isEmpty`, `isNotEmpty`

------

### **PAGES & ROUTES**

**Public Routes:**

- `/` — Landing page with list of available forms
- `/forms/[slug]` — Dynamic form page (renders based on schema)
- `/forms/[slug]/success` — Confirmation page after submission
- `/auth/signin` — Sign in with Google or email

**Protected Routes (Auth Required):**

- `/dashboard` — User's own submissions
- `/admin` — Admin dashboard (ADMIN role only)
- `/admin/forms` — Manage form templates
- `/admin/forms/new` — Create new form
- `/admin/forms/[id]/edit` — Edit form schema
- `/admin/forms/[id]/preview` — Preview form
- `/admin/submissions` — All submissions
- `/admin/submissions/[id]` — Submission detail

------

### **CORE FEATURES**

**1. Dynamic Form Renderer**

- Reads schema from database
- Renders multi-step form with progress bar
- Client-side validation using Zod (generated from schema)
- Handles all field types dynamically
- Supports conditional field visibility
- Mobile-first responsive design
- Auto-save draft to localStorage

**2. File Upload System**

- Upload to Cloudflare R2 or S3-compatible storage
- Progress indicator during upload
- File type and size validation
- Multiple files per field if configured
- Secure signed URLs for downloads

**3. Authentication**

- NextAuth.js with Google OAuth provider
- Optional email/password (credentials provider)
- Guest submissions allowed (configurable per form)
- Role-based access (USER, ADMIN)

**4. Email Notifications** On form submission, send email to addresses in form settings containing:

- Form name and submission timestamp
- All submitted field data (formatted nicely)
- List of uploaded files
- Direct link to view in admin: `{BASE_URL}/admin/submissions/{id}`
- Use Resend or SendGrid

**5. Admin Form Builder**

- JSON editor with syntax highlighting
- Visual preview of form
- Duplicate existing form as template
- Import/export form schemas
- Manage reusable field groups
- Form status management (Draft/Active/Archived)

**6. Admin Submissions Manager**

- Data table with all submissions
- Filter by: form type, status, date range
- Search across all fields
- Sort by any column
- Click row to view full details
- Update lead status
- Add internal notes
- Download uploaded files
- Export filtered results to CSV
- Bulk status update

------

### **TECH STACK**

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (Google OAuth + Credentials)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Forms:** React Hook Form + Zod validation
- **File Storage:** Cloudflare R2 (or upload to /uploads folder for MVP)
- **Email:** Resend (or SendGrid)
- **Tables:** TanStack Table (for admin data tables)
- **State:** Zustand (for form state management)

------

### **SEED DATA**

Create these initial form templates:

**1. Auto Insurance Quote**

```
Steps: Personal Info → Vehicle Details → Current Coverage → Documents
Fields: name, email, phone, dob, address, vehicleYear, vehicleMake, vehicleModel, vin, currentInsurer, currentPremium, driversLicense (file), currentPolicy (file)
```

**2. Home Insurance Quote**

```
Steps: Personal Info → Property Details → Coverage Needs → Documents
Fields: name, email, phone, propertyAddress, propertyType (select), yearBuilt, squareFootage, numberOfStories, hasPool (yesno), currentInsurer, desiredCoverage (currency), propertyPhotos (file)
```

**3. Life Insurance Inquiry**

```
Steps: Personal Info → Health Info → Coverage Needs
Fields: name, email, phone, dob, smoker (yesno), healthConditions (checkboxGroup), coverageAmount (currency), beneficiaryName, additionalNotes (textarea)
```

**4. General Contact Form**

```
Steps: Single step
Fields: name, email, phone, subject (select), message (textarea), attachment (file)
```

**Create one admin user:**

- Email: hani@selectfirstinsurance.com
- Role: ADMIN

------

### **UI/UX REQUIREMENTS**

- **Mobile-first** responsive design
- Clean, professional appearance (insurance industry appropriate)
- Trust indicators (secure form badge, privacy note)
- Clear progress indicator for multi-step forms
- Smooth step transitions (animations)
- Inline validation errors (real-time)
- Loading states for submissions
- Success confirmation with next steps
- Accessible (WCAG 2.1 AA compliant)
- Form auto-save to prevent data loss

------

### **ENVIRONMENT VARIABLES NEEDED**

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
ADMIN_EMAIL=hani@selectfirstinsurance.com
```

------

### **PRIORITY ORDER FOR DEVELOPMENT**

1. Database setup with Prisma schema
2. Auth system (NextAuth with Google)
3. Dynamic form renderer (core engine)
4. All field type components
5. File upload system
6. Form submission + email notification
7. Admin submissions list and detail view
8. Admin form template CRUD
9. Seed data for sample forms
10. Polish UI/UX and mobile responsiveness

------

**Start building this application. Set up the database first, then authentication, then the core dynamic form rendering system. Ensure everything is mobile-friendly from the start.**

------

 
