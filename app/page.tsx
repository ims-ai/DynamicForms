import { FeatureCard } from "@/components/feature-card";
import { prisma } from "@/lib/prisma";

const quickstart = [
  "Run `npm install` then `npm run prisma:generate` to create the client.",
  "Create a PostgreSQL database and set DATABASE_URL in your .env file.",
  "Run `npm run prisma:migrate` followed by `npm run prisma:seed` to load templates and the admin user.",
  "Start the dev server with `npm run dev` to view the dynamic form explorer."
];

export default async function Home() {
  const templates = await prisma.formTemplate.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 sm:p-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">DynamicForms</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Schema-driven insurance form platform</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          This starter lays the groundwork from Requirement.MD: Prisma data model, seed templates, authentication hooks, and a
          roadmap-friendly landing page. Build on top of it to deliver the fully dynamic form engine, admin tools, and lead
          management workflows.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <FeatureCard
          title="Getting started"
          description="Follow these steps to stand up the stack locally."
          items={quickstart}
        />
        <FeatureCard
          title="Tech stack"
          description="Next.js 14 App Router, Prisma + PostgreSQL, NextAuth, Tailwind, Zustand, React Hook Form, Zod."
          items={[
            "Environment variables documented in .env.example",
            "Prisma schema aligned to Requirement.MD",
            "Seed data includes 4 baseline templates and admin user",
            "Server logging configured for development"
          ]}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Available form templates</h2>
            <p className="text-sm text-slate-600">Synced from the Prisma seed. Extend them or add new JSON schemas.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {templates.length} ready
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-700"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{template.name}</p>
                <span className="text-xs uppercase tracking-wide text-slate-500">{template.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">Slug: {template.slug}</p>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-sm text-amber-700">Run the seed script once your database is configured to view templates.</p>
          )}
        </div>
      </section>
    </div>
  );
}
