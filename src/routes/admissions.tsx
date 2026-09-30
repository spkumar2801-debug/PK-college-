import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  FileText,
  GraduationCap,
  HelpCircle,
  Phone,
  Mail,
  Send,
  AlertCircle,
} from "lucide-react";
import { site, admissionsInfo, departments } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: `Admissions 2026-27 | ${site.name}` },
      {
        name: "description",
        content: `Apply for B.Tech engineering admissions 2026-27 at ${site.name}, Vijayawada. Check eligibility criteria, seat matrix, documents required, and submit your admission enquiry.`,
      },
      { property: "og:title", content: `Admissions | ${site.name}` },
    ],
  }),
  component: AdmissionsPage,
});

function AdmissionsPage() {
  const store = useCollegeStore();
  const { submitEnquiry, departments, siteSettings } = store;
  const site = siteSettings;
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newEnquiry = submitEnquiry({
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      branch: String(formData.get("branch") || "Computer Science & Engineering"),
      qualification: String(formData.get("qualification") || ""),
      city: String(formData.get("city") || ""),
      message: String(formData.get("message") || ""),
    });

    setSubmittedId(newEnquiry.id);
    setBusy(false);
    form.reset();
  };

  return (
    <>
      <InstitutionalPageBanner
        title="B.Tech Admissions 2026-27"
        subtitle="Admission procedures, eligibility benchmarks, branch seat matrices, and online enquiry for undergraduate engineering."
        breadcrumbs={[{ label: "Admissions" }]}
      />

      {/* Overview & Counseling Code Callout */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="college-container">
          <div className="p-4 sm:p-6 bg-amber-50 border-2 border-amber-300 rounded shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">State Admissions & Counseling</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0b224d] mt-1">{site.counselingCode}</h2>
              <p className="text-xs text-slate-700 mt-1">
                Official counseling code and reporting schedules are subject to notification by competent admissions authorities.
              </p>
            </div>
            <div className="text-left md:text-right flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-200 w-full md:w-auto">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">Admissions Desk Helpline</span>
              <span className="text-sm sm:text-base font-extrabold text-[#0b224d]">{site.admissionsPhone}</span>
            </div>
          </div>

          <SectionHeader
            eyebrow="Admission Pathways"
            title="Undergraduate Engineering Seat Allocation"
            subtitle="Admissions are conducted strictly as per statutory guidelines issued by competent government authorities."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-[#0b224d] rounded">
              <span className="text-xs font-bold uppercase text-[#b45309] block mb-1">Category - A</span>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Convener Quota</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allocated through State Web Counseling based on rank secured in state engineering common entrance examinations as per regulatory guidelines.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-[#b45309] rounded">
              <span className="text-xs font-bold uppercase text-[#b45309] block mb-1">Category - B</span>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Institutional Quota</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Admissions for candidates who meet prescribed statutory eligibility criteria under competent authority regulations.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-emerald-700 rounded">
              <span className="text-xs font-bold uppercase text-[#b45309] block mb-1">Lateral Entry</span>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Direct 2nd Year B.Tech</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eligible Diploma holders with qualifying entrance benchmarks are admitted directly into the second year (3rd semester) as per state council norms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seat Matrix & Approved Intake */}
      <section id="intake" className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Approved Intake Matrix"
            title="B.Tech Branch Wise Seat Distribution"
            subtitle="Annual student intake approved by regulatory technical education authorities."
          />

          <div className="max-w-4xl mx-auto overflow-x-auto border border-slate-200 rounded-lg shadow-sm bg-white -mx-1 sm:mx-auto">
            <table className="w-full text-left text-xs md:text-sm min-w-[560px]">
              <thead>
                <tr className="bg-[#0b224d] text-white">
                  <th className="p-3.5 font-bold">Branch Code</th>
                  <th className="p-3.5 font-bold">Branch / Specialization</th>
                  <th className="p-3.5 font-bold">Category-A (70%)</th>
                  <th className="p-3.5 font-bold">Category-B (30%)</th>
                  <th className="p-3.5 font-bold">Total Intake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {departments.map((prog) => {
                  const intake = Number(prog.intake) || 60;
                  const catA = Math.round(intake * 0.7);
                  const catB = intake - catA;
                  return (
                    <tr key={prog.code} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-[#b45309]">{prog.code}</td>
                      <td className="p-3.5 font-semibold text-[#0b224d]">{prog.title}</td>
                      <td className="p-3.5 text-slate-700">{catA} Seats</td>
                      <td className="p-3.5 text-slate-700">{catB} Seats</td>
                      <td className="p-3.5 font-bold text-slate-900">{intake} Seats</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Eligibility & Documents Required */}
      <section id="eligibility" className="py-12 bg-white">
        <div className="college-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Eligibility */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded">
              <h3 className="text-xl font-bold text-[#0b224d] mb-4 flex items-center gap-2">
                <GraduationCap className="text-[#b45309]" />
                <span>Eligibility Criteria</span>
              </h3>
              <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">1. First Year B.Tech (4 Years)</h4>
                  <p>{admissionsInfo.eligibility.btechFirstYear}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">2. Lateral Entry 2nd Year B.Tech (3 Years)</h4>
                  <p>{admissionsInfo.eligibility.lateralEntry}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">3. Institutional / Management Quota</h4>
                  <p>{admissionsInfo.eligibility.categoryB}</p>
                </div>
              </div>
            </div>

            {/* Documents Required */}
            <div id="documents" className="p-6 bg-slate-50 border border-slate-200 rounded">
              <h3 className="text-xl font-bold text-[#0b224d] mb-4 flex items-center gap-2">
                <FileText className="text-[#0b224d]" />
                <span>Documents for Verification</span>
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                {admissionsInfo.documentsRequired.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Enquiry Form */}
      <section id="enquiry" className="py-14 bg-slate-100 border-t border-slate-200">
        <div className="college-container max-w-4xl">
          <SectionHeader
            eyebrow="Direct Application"
            title="Online Admission Enquiry Form 2026-27"
            subtitle="Submit your details for branch counseling assistance, fee guidelines, and seat vacancy status."
          />

          <div className="bg-white p-5 sm:p-8 md:p-10 border border-slate-200 rounded shadow-sm">
            {submittedId ? (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-400 rounded text-center">
                <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-emerald-900 mb-1">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="text-xs text-emerald-800 mb-3">
                  Reference ID: <strong className="font-mono bg-emerald-100 px-2 py-0.5 rounded">{submittedId}</strong>
                </p>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in {site.name}. Our admissions desk coordinator will contact you shortly on your provided phone number with branch guidance and counseling dates.
                </p>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="mt-5 bg-[#0b224d] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      name="fullName"
                      required
                      placeholder="Enter student full name"
                      className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
                      className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Enter active email address"
                      className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Branch of Interest *
                    </label>
                    <select
                      name="branch"
                      required
                      className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none bg-white"
                    >
                      {departments.map((d) => (
                        <option key={d.code} value={d.shortTitle}>
                          {d.shortTitle} (Branch {d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Qualifying Examination & Marks/Rank
                    </label>
                    <input
                      name="qualification"
                      placeholder="Enter qualifying exam & score/rank"
                      className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Town / District *
                    </label>
                    <input
                      name="city"
                      required
                      placeholder="Enter your town or district"
                      className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Specific Query or Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Ask regarding fee structure, hostel availability, bus routes, or Category-B seats..."
                    className="w-full p-3 text-sm border border-slate-300 rounded focus:border-[#0b224d] focus:ring-1 focus:ring-[#0b224d] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-[#0b224d] hover:bg-[#102a5c] text-white py-3.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Send size={14} />
                    <span>{busy ? "Submitting Enquiry..." : "Submit Admission Enquiry"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
