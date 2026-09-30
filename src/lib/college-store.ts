import { useState, useEffect } from "react";
import {
  site as defaultSite,
  initialAnnouncements,
  initialEvents,
  gallery as initialGallery,
  departments as initialDepartments,
  collegeFacilities as initialFacilities,
  initialHomepage as defaultHomepage,
  placementDetails as initialPlacements,
  leadership as initialLeadership,
  type SiteSettings,
  type Announcement,
  type CollegeEvent,
  type GalleryItem,
  type AdmissionEnquiry,
  type Department,
  type CollegeFacility,
  type HomepageSettings,
  type PlacementData,
  type PlacementYearStat,
  type HighestPackageFeature,
  type StudentPlacementAchievement,
  type RecruiterCompany,
  type PlacementGalleryItem,
  type Leadership,
} from "@/data/site";
import { isFirebaseConfigured, collectionNames, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const STORAGE_KEYS = {
  announcements: "pkcet_announcements_v4",
  events: "pkcet_events_v4",
  gallery: "pkcet_gallery_v4",
  enquiries: "pkcet_enquiries_v4",
  siteSettings: "pkcet_site_settings_v4",
  departments: "pkcet_departments_v4",
  facilities: "pkcet_facilities_v4",
  homepage: "pkcet_homepage_v4",
  placements: "pkcet_placements_v4",
  leadership: "pkcet_leadership_v4",
};

export type { SiteSettings, PlacementData, PlacementYearStat, HighestPackageFeature, StudentPlacementAchievement, RecruiterCompany, PlacementGalleryItem };

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length > 0) {
      return parsed as unknown as T;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota
  }
}

// Global subscribers so all components stay reactive immediately
type Listener = () => void;
const listeners = new Set<Listener>();
function notifyAll() {
  listeners.forEach((l) => l());
}

export function useCollegeStore() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const listener = () => setVersion((v) => v + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const loadInitialDepartments = (): Department[] => {
    const stored = getStored(STORAGE_KEYS.departments, initialDepartments);
    if (!Array.isArray(stored) || stored.length === 0) return initialDepartments;
    const merged = initialDepartments.map((initD) => {
      const existing = stored.find((s: Department) => s.slug === initD.slug || s.code === initD.code);
      return existing ? { ...initD, ...existing } : initD;
    });
    stored.forEach((s: Department) => {
      if (!merged.some((m) => m.slug === s.slug || m.code === s.code)) {
        merged.push(s);
      }
    });
    return merged;
  };

  const loadInitialFacilities = (): CollegeFacility[] => {
    const stored = getStored(STORAGE_KEYS.facilities, initialFacilities);
    if (!Array.isArray(stored) || stored.length === 0) return initialFacilities;
    const merged = initialFacilities.map((initF) => {
      const existing = stored.find((s: CollegeFacility) => s.id === initF.id);
      return existing
        ? {
            ...initF,
            ...existing,
            image: existing.image || initF.image,
            keyFeatures: Array.isArray(existing.keyFeatures) ? existing.keyFeatures : initF.keyFeatures || [],
          }
        : initF;
    });
    stored.forEach((s: CollegeFacility) => {
      if (!merged.some((m) => m.id === s.id)) {
        merged.push({ ...s, keyFeatures: Array.isArray(s.keyFeatures) ? s.keyFeatures : [] });
      }
    });
    return merged;
  };

  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(() =>
    getStored(STORAGE_KEYS.siteSettings, defaultSite),
  );
  const [departments, setDepartmentsState] = useState<Department[]>(loadInitialDepartments);
  const [facilities, setFacilitiesState] = useState<CollegeFacility[]>(loadInitialFacilities);
  const [homepage, setHomepageState] = useState<HomepageSettings>(() =>
    getStored(STORAGE_KEYS.homepage, defaultHomepage),
  );
  const [placements, setPlacementsState] = useState<PlacementData>(() =>
    getStored(STORAGE_KEYS.placements, initialPlacements),
  );
  const [leadership, setLeadershipState] = useState<Leadership>(() =>
    getStored(STORAGE_KEYS.leadership, initialLeadership),
  );
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(() =>
    getStored(STORAGE_KEYS.announcements, initialAnnouncements),
  );
  const [events, setEventsState] = useState<CollegeEvent[]>(() =>
    getStored(STORAGE_KEYS.events, initialEvents),
  );
  const [galleryItems, setGalleryState] = useState<GalleryItem[]>(() =>
    getStored(STORAGE_KEYS.gallery, initialGallery),
  );
  const [enquiries, setEnquiriesState] = useState<AdmissionEnquiry[]>(() =>
    getStored(STORAGE_KEYS.enquiries, []),
  );

  // Sync state on mount
  useEffect(() => {
    setSiteSettingsState(getStored(STORAGE_KEYS.siteSettings, defaultSite));
    setDepartmentsState(loadInitialDepartments());
    setFacilitiesState(loadInitialFacilities());
    setHomepageState(getStored(STORAGE_KEYS.homepage, defaultHomepage));
    setPlacementsState(getStored(STORAGE_KEYS.placements, initialPlacements));
    setLeadershipState(getStored(STORAGE_KEYS.leadership, initialLeadership));
    setAnnouncementsState(getStored(STORAGE_KEYS.announcements, initialAnnouncements));
    setEventsState(getStored(STORAGE_KEYS.events, initialEvents));
    setGalleryState(getStored(STORAGE_KEYS.gallery, initialGallery));
    setEnquiriesState(getStored(STORAGE_KEYS.enquiries, []));
  }, []);

  // Background fetch & Real-time listeners from Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === "undefined") return;
    let isMounted = true;
    const unsubs: Array<() => void> = [];

    async function initFirestoreListeners() {
      try {
        // 1. Site Settings listener
        const unsubSite = onSnapshot(doc(db, collectionNames.siteSettings, "general"), (snap) => {
          if (snap.exists() && isMounted) {
            const data = snap.data() as Partial<SiteSettings>;
            const merged = { ...defaultSite, ...data };
            setSiteSettingsState(merged);
            setStored(STORAGE_KEYS.siteSettings, merged);
            notifyAll();
          }
        }, (err) => console.warn("Firestore siteSettings notice:", err.message));
        unsubs.push(unsubSite);

        // 2. Departments listener
        const unsubDept = onSnapshot(collection(db, "departments"), (snap) => {
          if (!snap.empty && isMounted) {
            const remoteDepts = snap.docs.map((d) => d.data() as Department);
            const merged = initialDepartments.map((initD) => {
              const found = remoteDepts.find((rd) => rd.slug === initD.slug || rd.code === initD.code);
              return found ? { ...initD, ...found } : initD;
            });
            remoteDepts.forEach((rd) => {
              if (!merged.some((m) => m.slug === rd.slug || m.code === rd.code)) {
                merged.push(rd);
              }
            });
            setDepartmentsState(merged);
            setStored(STORAGE_KEYS.departments, merged);
            notifyAll();
          }
        }, (err) => console.warn("Firestore departments notice:", err.message));
        unsubs.push(unsubDept);

        // 3. Homepage listener
        const unsubHome = onSnapshot(doc(db, "homepage", "content"), (snap) => {
          if (snap.exists() && isMounted) {
            const data = snap.data() as Partial<HomepageSettings>;
            const merged = { ...defaultHomepage, ...data };
            setHomepageState(merged);
            setStored(STORAGE_KEYS.homepage, merged);
            notifyAll();
          }
        }, (err) => console.warn("Firestore homepage notice:", err.message));
        unsubs.push(unsubHome);

        // 4. Facilities listener
        const unsubFac = onSnapshot(collection(db, "facilities"), (snap) => {
          if (!snap.empty && isMounted) {
            const remoteFacs = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as CollegeFacility[];
            const merged = initialFacilities.map((initF) => {
              const found = remoteFacs.find((rf) => rf.id === initF.id);
              return found
                ? {
                    ...initF,
                    ...found,
                    image: found.image || initF.image,
                    keyFeatures: Array.isArray(found.keyFeatures) ? found.keyFeatures : initF.keyFeatures || [],
                  }
                : initF;
            });
            remoteFacs.forEach((rf) => {
              if (!merged.some((m) => m.id === rf.id)) {
                merged.push({ ...rf, keyFeatures: Array.isArray(rf.keyFeatures) ? rf.keyFeatures : [] });
              }
            });
            setFacilitiesState(merged);
            setStored(STORAGE_KEYS.facilities, merged);
            notifyAll();
          }
        }, (err) => console.warn("Firestore facilities notice:", err.message));
        unsubs.push(unsubFac);

        // 5. Announcements listener
        const unsubAnn = onSnapshot(collection(db, collectionNames.announcements), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Announcement[];
            setAnnouncementsState(list);
            setStored(STORAGE_KEYS.announcements, list);
            notifyAll();
          }
        }, (err) => console.warn("Firestore announcements notice:", err.message));
        unsubs.push(unsubAnn);

        // 6. Events listener
        const unsubEvt = onSnapshot(collection(db, collectionNames.events), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as CollegeEvent[];
            setEventsState(list);
            setStored(STORAGE_KEYS.events, list);
            notifyAll();
          }
        }, (err) => console.warn("Firestore events notice:", err.message));
        unsubs.push(unsubEvt);

        // 7. Gallery listener
        const unsubGal = onSnapshot(collection(db, collectionNames.gallery), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as unknown as GalleryItem[];
            setGalleryState(list);
            setStored(STORAGE_KEYS.gallery, list);
            notifyAll();
          }
        }, (err) => console.warn("Firestore gallery notice:", err.message));
        unsubs.push(unsubGal);

        // 8. Leadership listener
        const unsubLead = onSnapshot(doc(db, collectionNames.about, "leadership"), (snap) => {
          if (snap.exists() && isMounted) {
            const data = snap.data() as Partial<Leadership>;
            const merged = { ...initialLeadership, ...data };
            setLeadershipState(merged);
            setStored(STORAGE_KEYS.leadership, merged);
            notifyAll();
          }
        }, (err) => console.warn("Firestore leadership notice:", err.message));
        unsubs.push(unsubLead);

        // 9. Placements listener
        const unsubPlace = onSnapshot(doc(db, collectionNames.placements, "overview"), (snap) => {
          if (snap.exists() && isMounted) {
            const data = snap.data() as Partial<PlacementData>;
            const merged = { ...initialPlacements, ...data };
            setPlacementsState(merged);
            setStored(STORAGE_KEYS.placements, merged);
            notifyAll();
          }
        }, (err) => console.warn("Firestore placements notice:", err.message));
        unsubs.push(unsubPlace);

        // 10. Enquiries listener (Admin)
        const unsubEnq = onSnapshot(collection(db, "enquiries"), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as AdmissionEnquiry[];
            setEnquiriesState(list);
            setStored(STORAGE_KEYS.enquiries, list);
            notifyAll();
          }
        }, (err) => console.warn("Firestore enquiries notice:", err.message));
        unsubs.push(unsubEnq);

      } catch (err) {
        console.warn("Firestore listeners initialization fallback to cached data:", err);
      }
    }

    initFirestoreListeners();

    return () => {
      isMounted = false;
      unsubs.forEach((u) => u());
    };
  }, []);

  // 1. Site Settings Update
  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    const updated: SiteSettings = {
      ...siteSettings,
      ...updates,
      established: updates.foundedYear ? `Founded in ${updates.foundedYear}` : (updates.established || siteSettings.established),
    };
    setSiteSettingsState(updated);
    setStored(STORAGE_KEYS.siteSettings, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.siteSettings, "general"), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore siteSettings sync notice:", err);
      }
    }
  };

  // 2. Department Management (e.g. change Intake 180 -> 100)
  const updateDepartment = async (codeOrSlug: string, updates: Partial<Department>) => {
    const updated = departments.map((d) => {
      if (d.code === codeOrSlug || d.slug === codeOrSlug) {
        return { ...d, ...updates };
      }
      return d;
    });
    setDepartmentsState(updated);
    setStored(STORAGE_KEYS.departments, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        const target = updated.find((d) => d.code === codeOrSlug || d.slug === codeOrSlug);
        if (target) {
          await setDoc(doc(db, "departments", target.slug), target, { merge: true });
        }
      } catch (err) {
        console.warn("Firestore department sync notice:", err);
      }
    }
  };

  const addDepartment = async (newDept: Department) => {
    const updated = [...departments, newDept];
    setDepartmentsState(updated);
    setStored(STORAGE_KEYS.departments, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "departments", newDept.slug), newDept, { merge: true });
      } catch (err) {
        console.warn("Firestore add department error:", err);
      }
    }
  };

  const deleteDepartment = async (slugOrCode: string) => {
    const updated = departments.filter((d) => d.slug !== slugOrCode && d.code !== slugOrCode);
    setDepartmentsState(updated);
    setStored(STORAGE_KEYS.departments, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "departments", slugOrCode));
      } catch (err) {
        console.warn("Firestore delete department error:", err);
      }
    }
  };

  const updateDepartments = async (list: Department[]) => {
    setDepartmentsState(list);
    setStored(STORAGE_KEYS.departments, list);
    notifyAll();
  };

  // 3. Homepage CMS
  const updateHomepage = async (updates: Partial<HomepageSettings>) => {
    const updated = { ...homepage, ...updates };
    setHomepageState(updated);
    setStored(STORAGE_KEYS.homepage, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "homepage", "content"), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore homepage sync notice:", err);
      }
    }
  };

  // 4. Leadership & Principal's Message
  const updateLeadership = async (updates: Partial<Leadership>) => {
    const updated = { ...leadership, ...updates };
    setLeadershipState(updated);
    setStored(STORAGE_KEYS.leadership, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.about, "leadership"), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore leadership sync notice:", err);
      }
    }
  };

  // 5. Facilities CMS
  const updateFacilities = async (list: CollegeFacility[]) => {
    setFacilitiesState(list);
    setStored(STORAGE_KEYS.facilities, list);
    notifyAll();
  };

  const updateFacility = async (id: string, updates: Partial<CollegeFacility>) => {
    const updated = facilities.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setFacilitiesState(updated);
    setStored(STORAGE_KEYS.facilities, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "facilities", id), updates, { merge: true });
      } catch (err) {
        console.warn("Firestore update facility error:", err);
      }
    }
  };

  const addFacility = async (item: Omit<CollegeFacility, "id">) => {
    const newItem: CollegeFacility = { ...item, id: `fac-${Date.now()}` };
    const updated = [...facilities, newItem];
    setFacilitiesState(updated);
    setStored(STORAGE_KEYS.facilities, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "facilities", newItem.id), newItem);
      } catch (err) {
        console.warn("Firestore add facility error:", err);
      }
    }
  };

  const deleteFacility = async (id: string) => {
    const updated = facilities.filter((f) => f.id !== id);
    setFacilitiesState(updated);
    setStored(STORAGE_KEYS.facilities, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "facilities", id));
      } catch (err) {
        console.warn("Firestore delete facility error:", err);
      }
    }
  };

  // 6. Placements CMS
  const updatePlacements = async (updates: Partial<PlacementData>) => {
    const updated = { ...placements, ...updates };
    setPlacementsState(updated);
    setStored(STORAGE_KEYS.placements, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.placements, "overview"), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore placements sync notice:", err);
      }
    }
  };

  const addPlacementYear = async (stat: PlacementYearStat) => {
    const current = placements.yearlyStats || [];
    const filtered = current.filter((y) => y.id !== stat.id && y.year !== stat.year);
    const updatedStats = [stat, ...filtered].sort((a, b) => (b.year > a.year ? 1 : -1));
    await updatePlacements({ yearlyStats: updatedStats });
  };

  const updatePlacementYear = async (id: string, updates: Partial<PlacementYearStat>) => {
    const current = placements.yearlyStats || [];
    const updatedStats = current.map((y) => (y.id === id ? { ...y, ...updates } : y));
    await updatePlacements({ yearlyStats: updatedStats });
  };

  const deletePlacementYear = async (id: string) => {
    const current = placements.yearlyStats || [];
    const updatedStats = current.filter((y) => y.id !== id);
    await updatePlacements({ yearlyStats: updatedStats });
  };

  const updateHighestPackage = async (updates: Partial<HighestPackageFeature>) => {
    const current: HighestPackageFeature = placements.highestPackage || {
      packageAmount: "",
      currency: "₹",
      placementYear: "",
      studentName: "",
      department: "",
      program: "B.Tech",
      batchYear: "",
      companyName: "",
      studentPhoto: "",
      photoPublicId: "",
      description: "",
      isVisible: true,
    };
    await updatePlacements({ highestPackage: { ...current, ...updates } });
  };

  const addRecruiterCompany = async (company: RecruiterCompany) => {
    const current = placements.companies || [];
    const filtered = current.filter((c) => c.id !== company.id);
    const updatedCompanies = [...filtered, company].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    await updatePlacements({ companies: updatedCompanies });
  };

  const updateRecruiterCompany = async (id: string, updates: Partial<RecruiterCompany>) => {
    const current = placements.companies || [];
    const updatedCompanies = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    await updatePlacements({ companies: updatedCompanies });
  };

  const deleteRecruiterCompany = async (id: string) => {
    const current = placements.companies || [];
    const updatedCompanies = current.filter((c) => c.id !== id);
    await updatePlacements({ companies: updatedCompanies });
  };

  const addPlacementGalleryItem = async (item: PlacementGalleryItem) => {
    const current = placements.gallery || [];
    const filtered = current.filter((g) => g.id !== item.id);
    const updatedGallery = [item, ...filtered];
    await updatePlacements({ gallery: updatedGallery });
  };

  const updatePlacementGalleryItem = async (id: string, updates: Partial<PlacementGalleryItem>) => {
    const current = placements.gallery || [];
    const updatedGallery = current.map((g) => (g.id === id ? { ...g, ...updates } : g));
    await updatePlacements({ gallery: updatedGallery });
  };

  const deletePlacementGalleryItem = async (id: string) => {
    const current = placements.gallery || [];
    const updatedGallery = current.filter((g) => g.id !== id);
    await updatePlacements({ gallery: updatedGallery });
  };

  const addPlacementAchievement = async (item: StudentPlacementAchievement) => {
    const current = placements.achievements || [];
    const filtered = current.filter((a) => a.id !== item.id);
    const updatedAchievements = [item, ...filtered];
    await updatePlacements({ achievements: updatedAchievements });
  };

  const updatePlacementAchievement = async (id: string, updates: Partial<StudentPlacementAchievement>) => {
    const current = placements.achievements || [];
    const updatedAchievements = current.map((a) => (a.id === id ? { ...a, ...updates } : a));
    await updatePlacements({ achievements: updatedAchievements });
  };

  const deletePlacementAchievement = async (id: string) => {
    const current = placements.achievements || [];
    const updatedAchievements = current.filter((a) => a.id !== id);
    await updatePlacements({ achievements: updatedAchievements });
  };

  // 7. Announcements CRUD
  const addAnnouncement = async (item: Omit<Announcement, "id">) => {
    const newItem: Announcement = { ...item, id: `ann-${Date.now()}` };
    const updated = [newItem, ...announcements];
    setAnnouncementsState(updated);
    setStored(STORAGE_KEYS.announcements, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.announcements, newItem.id), newItem);
      } catch (err) {
        console.warn("Firestore add announcement error:", err);
      }
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    const updated = announcements.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setAnnouncementsState(updated);
    setStored(STORAGE_KEYS.announcements, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.announcements, id), updates, { merge: true });
      } catch (err) {
        console.warn("Firestore update announcement error:", err);
      }
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncementsState(updated);
    setStored(STORAGE_KEYS.announcements, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, collectionNames.announcements, id));
      } catch (err) {
        console.warn("Firestore delete announcement error:", err);
      }
    }
  };

  // 8. Events CRUD
  const addEvent = async (item: Omit<CollegeEvent, "id">) => {
    const newItem: CollegeEvent = { ...item, id: `evt-${Date.now()}` };
    const updated = [newItem, ...events];
    setEventsState(updated);
    setStored(STORAGE_KEYS.events, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.events, newItem.id), newItem);
      } catch (err) {
        console.warn("Firestore add event error:", err);
      }
    }
  };

  const updateEvent = async (id: string, updates: Partial<CollegeEvent>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setEventsState(updated);
    setStored(STORAGE_KEYS.events, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.events, id), updates, { merge: true });
      } catch (err) {
        console.warn("Firestore update event error:", err);
      }
    }
  };

  const deleteEvent = async (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEventsState(updated);
    setStored(STORAGE_KEYS.events, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, collectionNames.events, id));
      } catch (err) {
        console.warn("Firestore delete event error:", err);
      }
    }
  };

  // 9. Photo Gallery CRUD
  const addGalleryItem = async (item: Omit<GalleryItem, "id">) => {
    const newItem: GalleryItem = { ...item, id: Date.now() };
    const updated = [newItem, ...galleryItems];
    setGalleryState(updated);
    setStored(STORAGE_KEYS.gallery, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.gallery, String(newItem.id)), newItem);
      } catch (err) {
        console.warn("Firestore add gallery error:", err);
      }
    }
  };

  const updateGalleryItem = async (id: number | string, updates: Partial<GalleryItem>) => {
    const updated = galleryItems.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setGalleryState(updated);
    setStored(STORAGE_KEYS.gallery, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, collectionNames.gallery, String(id)), updates, { merge: true });
      } catch (err) {
        console.warn("Firestore update gallery error:", err);
      }
    }
  };

  const deleteGalleryItem = async (id: number | string) => {
    const updated = galleryItems.filter((g) => g.id !== id);
    setGalleryState(updated);
    setStored(STORAGE_KEYS.gallery, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, collectionNames.gallery, String(id)));
      } catch (err) {
        console.warn("Firestore delete gallery error:", err);
      }
    }
  };

  // 10. Admission Enquiries
  const addEnquiry = async (item: Omit<AdmissionEnquiry, "id" | "submittedAt" | "status">) => {
    const newEnquiry: AdmissionEnquiry = {
      ...item,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "Pending",
    };
    const updated = [newEnquiry, ...enquiries];
    setEnquiriesState(updated);
    setStored(STORAGE_KEYS.enquiries, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "enquiries", newEnquiry.id), newEnquiry);
      } catch (err) {
        console.warn("Firestore save enquiry error:", err);
      }
    }
  };

  const updateEnquiryStatus = async (id: string, status: AdmissionEnquiry["status"]) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiriesState(updated);
    setStored(STORAGE_KEYS.enquiries, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "enquiries", id), { status }, { merge: true });
      } catch (err) {
        console.warn("Firestore update enquiry status error:", err);
      }
    }
  };

  const deleteEnquiry = async (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiriesState(updated);
    setStored(STORAGE_KEYS.enquiries, updated);
    notifyAll();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "enquiries", id));
      } catch (err) {
        console.warn("Firestore delete enquiry error:", err);
      }
    }
  };

  // 11. Initial Data Seeding Helper
  const seedInitialFirestoreData = async () => {
    if (!isFirebaseConfigured) return false;
    try {
      // Site settings
      await setDoc(doc(db, collectionNames.siteSettings, "general"), siteSettings, { merge: true });
      // Departments
      for (const d of departments) {
        await setDoc(doc(db, "departments", d.slug), d, { merge: true });
      }
      // Homepage
      await setDoc(doc(db, "homepage", "content"), homepage, { merge: true });
      // Facilities
      for (const f of facilities) {
        await setDoc(doc(db, "facilities", f.id), f, { merge: true });
      }
      // Announcements
      for (const a of announcements) {
        await setDoc(doc(db, collectionNames.announcements, a.id), a, { merge: true });
      }
      // Events
      for (const e of events) {
        await setDoc(doc(db, collectionNames.events, e.id), e, { merge: true });
      }
      // Gallery
      for (const g of galleryItems) {
        await setDoc(doc(db, collectionNames.gallery, String(g.id)), g, { merge: true });
      }
      // Leadership
      await setDoc(doc(db, collectionNames.about, "leadership"), leadership, { merge: true });
      // Placements
      await setDoc(doc(db, collectionNames.placements, "overview"), placements, { merge: true });

      return true;
    } catch (err) {
      console.error("Failed to seed initial Firestore data:", err);
      return false;
    }
  };

  return {
    siteSettings,
    departments,
    facilities,
    homepage,
    placements,
    leadership,
    announcements,
    events,
    galleryItems,
    enquiries,
    // Actions
    updateSiteSettings,
    updateDepartment,
    addDepartment,
    deleteDepartment,
    updateDepartments,
    updateHomepage,
    updateLeadership,
    updateFacilities,
    updateFacility,
    addFacility,
    deleteFacility,
    updatePlacements,
    updateHighestPackage,
    addPlacementYear,
    updatePlacementYear,
    deletePlacementYear,
    addRecruiterCompany,
    updateRecruiterCompany,
    deleteRecruiterCompany,
    addPlacementGalleryItem,
    updatePlacementGalleryItem,
    deletePlacementGalleryItem,
    addPlacementAchievement,
    updatePlacementAchievement,
    deletePlacementAchievement,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addEvent,
    updateEvent,
    deleteEvent,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    addEnquiry,
    submitEnquiry: (item: Omit<AdmissionEnquiry, "id" | "submittedAt" | "status">) => {
      const newEnquiry: AdmissionEnquiry = {
        ...item,
        id: `enq-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: "Pending",
      };
      const updated = [newEnquiry, ...enquiries];
      setEnquiriesState(updated);
      setStored(STORAGE_KEYS.enquiries, updated);
      notifyAll();
      if (isFirebaseConfigured) {
        setDoc(doc(db, "enquiries", newEnquiry.id), newEnquiry).catch(() => {});
      }
      return newEnquiry;
    },
    updateEnquiryStatus,
    deleteEnquiry,
    seedInitialFirestoreData,
  };
}
