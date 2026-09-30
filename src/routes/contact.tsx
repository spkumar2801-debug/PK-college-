import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Navigation,
  CheckCircle2,
  Bus,
  Train,
  Plane,
} from "lucide-react";
import { site as staticSite } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & Campus Location | ${staticSite.name}` },
      {
        name: "description",
        content: `Contact ${staticSite.name}. Information desk, official email addresses, office hours, and online enquiry desk.`,
      },
      { property: "og:title", content: `Contact | ${staticSite.name}` },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const { siteSettings } = useCollegeStore();
  const site = siteSettings;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setSubmitted(true);
      setBusy(false);
    }, 400);
  };

  return (
    <>
      <InstitutionalPageBanner
        title="Contact & Location"
        subtitle="Administrative office contacts, department extensions, route guidance, and feedback enquiry desk."
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <section className="py-8 sm:py-14 bg-white">
        <div className="college-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            {/* Contact Details & Helplines */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-[#0b224d] rounded shadow-sm">
                <h3 className="text-lg font-bold text-[#0b224d] mb-4">
                  Campus Postal Address
                </h3>

                <div className="space-y-4 text-xs md:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#b45309] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">{site.name}</strong>
                      <p className="text-slate-600 mt-0.5">{site.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-[#b45309] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Telephone / Helpdesk:</strong>
                      <p className="text-slate-600">{site.phone}</p>
                      <p className="text-slate-600 font-bold text-amber-700">Admissions: {site.admissionsPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#b45309] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Official Electronic Mail:</strong>
                      <p className="text-slate-600">General: {site.email}</p>
                      <p className="text-slate-600">Admissions: {site.admissionsEmail}</p>
                      <p className="text-slate-600">Examinations: {site.examCellEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-[#b45309] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Office Working Hours:</strong>
                      <p className="text-slate-600">{site.workingHours}</p>
                      <p className="text-slate-400 text-xs">Sunday & Public Holidays Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Directions */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded shadow-sm">
                <h3 className="text-base font-bold text-[#0b224d] mb-3 flex items-center gap-2">
                  <Navigation size={18} className="text-[#b45309]" />
                  <span>Transit & Location Guidance</span>
                </h3>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>
                    Campus transit details and official route guidance will be updated by the administration.
                  </p>
                  <p className="text-slate-500 italic">
                    Visitors and parents traveling for admissions counseling may contact the admissions desk for assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Query Form & Interactive Map Info */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200 rounded p-4 sm:p-6 md:p-8 shadow-sm mb-6">
                <h3 className="text-xl font-bold text-[#0b224d] mb-1">
                  Send an Official Enquiry / Message
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  For administrative information, verification requests, or general campus guidance.
                </p>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 rounded text-center">
                    <CheckCircle2 size={38} className="text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-bold text-emerald-900 text-base">Message Sent Successfully</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Thank you for contacting {site.name}. Our administrative team will respond to your query.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-xs font-bold text-[#0b224d] underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Full Name *
                        </label>
                        <input
                          required
                          placeholder="Your Name"
                          className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Your Mobile Number"
                          className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@domain.com"
                          className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Department / Subject
                        </label>
                        <select className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none bg-white">
                          <option>General Administration</option>
                          <option>Admissions Enquiry</option>
                          <option>Examinations & Transcripts</option>
                          <option>Training & Placements</option>
                          <option>Alumni Affairs</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Your Detailed Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your query or message in detail..."
                        className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={busy}
                      className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Send size={14} />
                      <span>{busy ? "Sending..." : "Submit Message"}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Map Location Placeholder Card */}
              <div className="p-6 bg-slate-100 border border-slate-200 rounded text-center">
                <MapPin size={28} className="mx-auto text-[#0b224d] mb-2" />
                <h4 className="font-bold text-sm text-[#0b224d]">Campus Geolocation</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Official campus location coordinates and navigation routes will be published.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
