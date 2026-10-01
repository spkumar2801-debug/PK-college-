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
import { isFirebaseConfigured, collectionNames, db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
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

    const handleListenerError = (collName: string, err: any) => {
      console.warn(`[CollegeStore] Firestore ${collName} listener notice:`, err.code || err.message);
      if (err.code === "permission-denied") {
        console.error(
          `[CollegeStore] Public read access to '${collName}' is blocked by Cloud Firestore rules on project pk-college-74f41. ` +
          `Publish firestore.rules in Firebase Console to allow public visitors on production to view live CMS updates.`
        );
      }
    };

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
        }, (err) => handleListenerError("siteSettings", err));
        unsubs.push(unsubSite);

        // 2. Departments listener - Cloud Firestore is authoritative
        const unsubDept = onSnapshot(collection(db, "departments"), (snap) => {
          if (!snap.empty && isMounted) {
            const remoteDepts = snap.docs.map((d) => d.data() as Department);
            setDepartmentsState(remoteDepts);
            setStored(STORAGE_KEYS.departments, remoteDepts);
            notifyAll();
          }
        }, (err) => handleListenerError("departments", err));
        unsubs.push(unsubDept);

        // 3. Homepage listener - Cloud Firestore is authoritative
        const unsubHome = onSnapshot(doc(db, "homepage", "content"), (snap) => {
          if (snap.exists() && isMounted) {
            const data = snap.data() as Partial<HomepageSettings>;
            const merged = { ...defaultHomepage, ...data };
            setHomepageState(merged);
            setStored(STORAGE_KEYS.homepage, merged);
            notifyAll();
          }
        }, (err) => handleListenerError("homepage", err));
        unsubs.push(unsubHome);

        // 4. Facilities listener - Cloud Firestore is authoritative
        const unsubFac = onSnapshot(collection(db, "facilities"), (snap) => {
          if (!snap.empty && isMounted) {
            const remoteFacs = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as CollegeFacility[];
            setFacilitiesState(remoteFacs);
            setStored(STORAGE_KEYS.facilities, remoteFacs);
            notifyAll();
          }
        }, (err) => handleListenerError("facilities", err));
        unsubs.push(unsubFac);

        // 5. Announcements listener
        const unsubAnn = onSnapshot(collection(db, collectionNames.announcements), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Announcement[];
            setAnnouncementsState(list);
            setStored(STORAGE_KEYS.announcements, list);
            notifyAll();
          }
        }, (err) => handleListenerError("announcements", err));
        unsubs.push(unsubAnn);

        // 6. Events listener
        const unsubEvt = onSnapshot(collection(db, collectionNames.events), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as CollegeEvent[];
            setEventsState(list);
            setStored(STORAGE_KEYS.events, list);
            notifyAll();
          }
        }, (err) => handleListenerError("events", err));
        unsubs.push(unsubEvt);

        // 7. Gallery listener
        const unsubGal = onSnapshot(collection(db, collectionNames.gallery), (snap) => {
          if (!snap.empty && isMounted) {
            const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as unknown as GalleryItem[];
            setGalleryState(list);
            setStored(STORAGE_KEYS.gallery, list);
            notifyAll();
          }
        }, (err) => handleListenerError("gallery", err));
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
        }, (err) => handleListenerError("about/leadership", err));
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
        }, (err) => handleListenerError("placements/overview", err));
        unsubs.push(unsubPlace);

        // 10. Enquiries listener (Admin only - attached when authenticated)
        let unsubEnq: (() => void) | null = null;
        const unsubAuth = onAuthStateChanged(auth, (user) => {
          if (user && isMounted && !unsubEnq) {
            unsubEnq = onSnapshot(
              collection(db, "enquiries"),
              (snap) => {
                if (isMounted) {
                  const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as AdmissionEnquiry[];
                  setEnquiriesState(list);
                  setStored(STORAGE_KEYS.enquiries, list);
                  notifyAll();
                }
              },
              (err) => handleListenerError("enquiries", err)
            );
          } else if (!user && unsubEnq) {
            unsubEnq();
            unsubEnq = null;
          }
        });
        unsubs.push(() => {
          unsubAuth();
          if (unsubEnq) unsubEnq();
        });

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

  const syncToFirestore = async (docRef: any, data: any, description: string) => {
    if (!isFirebaseConfigured) {
      const err = new Error("Firebase is not configured on this client.");
      console.error(`[CollegeStore] Firestore write failed for ${description}:`, err);
      return { success: false, cloudSynced: false, error: err };
    }
    try {
      await setDoc(docRef, data, { merge: true });
      console.log(`Firestore write successful for ${description}.`);
      return { success: true, cloudSynced: true };
    } catch (err: any) {
      console.error(`[CollegeStore] Firestore write failed for ${description}:`, err.code || err.message, err);
      if (err.code === "permission-denied") {
        console.error(
          `[CollegeStore] PERMISSION_DENIED on project pk-college-74f41: Firestore security rules blocked the write. ` +
          `Please publish firestore.rules in Firebase Console to enable live CMS synchronization.`
        );
      }
      return { success: false, cloudSynced: false, error: err };
    }
  };

  const deleteFromFirestore = async (docRef: any, description: string) => {
    if (!isFirebaseConfigured) {
      const err = new Error("Firebase is not configured on this client.");
      console.error(`[CollegeStore] Firestore delete failed for ${description}:`, err);
      return { success: false, cloudSynced: false, error: err };
    }
    try {
      await deleteDoc(docRef);
      console.log(`Firestore delete successful for ${description}.`);
      return { success: true, cloudSynced: true };
    } catch (err: any) {
      console.error(`[CollegeStore] Firestore delete failed for ${description}:`, err.code || err.message, err);
      return { success: false, cloudSynced: false, error: err };
    }
  };

  // 1. Site Settings Update
  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    const updated: SiteSettings = {
      ...siteSettings,
      ...updates,
      established: updates.foundedYear ? `Founded in ${updates.foundedYear}` : (updates.established || siteSettings.established),
    };
    const res = await syncToFirestore(doc(db, collectionNames.siteSettings, "general"), updated, "siteSettings/general");
    if (res.success) {
      setSiteSettingsState(updated);
      setStored(STORAGE_KEYS.siteSettings, updated);
      notifyAll();
    }
    return res;
  };

  // 2. Department Management (e.g. change Intake 180 -> 100)
  const updateDepartment = async (codeOrSlug: string, updates: Partial<Department>) => {
    const updated = departments.map((d) => {
      if (d.code === codeOrSlug || d.slug === codeOrSlug) {
        return { ...d, ...updates };
      }
      return d;
    });
    const target = updated.find((d) => d.code === codeOrSlug || d.slug === codeOrSlug);
    if (!target) return { success: false, cloudSynced: false, error: new Error("Department not found") };

    const res = await syncToFirestore(doc(db, "departments", target.slug), target, `departments/${target.slug}`);
    if (res.success) {
      setDepartmentsState(updated);
      setStored(STORAGE_KEYS.departments, updated);
      notifyAll();
    }
    return res;
  };

  const addDepartment = async (newDept: Department) => {
    const updated = [...departments, newDept];
    const res = await syncToFirestore(doc(db, "departments", newDept.slug), newDept, `departments/${newDept.slug}`);
    if (res.success) {
      setDepartmentsState(updated);
      setStored(STORAGE_KEYS.departments, updated);
      notifyAll();
    }
    return res;
  };

  const deleteDepartment = async (slugOrCode: string) => {
    const updated = departments.filter((d) => d.slug !== slugOrCode && d.code !== slugOrCode);
    const res = await deleteFromFirestore(doc(db, "departments", slugOrCode), `departments/${slugOrCode}`);
    if (res.success) {
      setDepartmentsState(updated);
      setStored(STORAGE_KEYS.departments, updated);
      notifyAll();
    }
    return res;
  };

  const updateDepartments = async (list: Department[]) => {
    setDepartmentsState(list);
    setStored(STORAGE_KEYS.departments, list);
    notifyAll();
  };

  // 3. Homepage CMS
  const updateHomepage = async (updates: Partial<HomepageSettings>) => {
    const updated = { ...homepage, ...updates };
    const res = await syncToFirestore(doc(db, "homepage", "content"), updated, "homepage/content");
    if (res.success) {
      setHomepageState(updated);
      setStored(STORAGE_KEYS.homepage, updated);
      notifyAll();
    }
    return res;
  };

  // 4. Leadership & Principal's Message
  const updateLeadership = async (updates: Partial<Leadership>) => {
    const updated = { ...leadership, ...updates };
    const res = await syncToFirestore(doc(db, collectionNames.about, "leadership"), updated, "about/leadership");
    if (res.success) {
      setLeadershipState(updated);
      setStored(STORAGE_KEYS.leadership, updated);
      notifyAll();
    }
    return res;
  };

  // 5. Facilities CMS
  const updateFacilities = async (list: CollegeFacility[]) => {
    setFacilitiesState(list);
    setStored(STORAGE_KEYS.facilities, list);
    notifyAll();
  };

  const updateFacility = async (id: string, updates: Partial<CollegeFacility>) => {
    const updated = facilities.map((f) => (f.id === id ? { ...f, ...updates } : f));
    const target = updated.find((f) => f.id === id);
    if (!target) return { success: false, cloudSynced: false, error: new Error("Facility not found") };

    const res = await syncToFirestore(doc(db, "facilities", id), target, `facilities/${id}`);
    if (res.success) {
      setFacilitiesState(updated);
      setStored(STORAGE_KEYS.facilities, updated);
      notifyAll();
    }
    return res;
  };

  const addFacility = async (item: Omit<CollegeFacility, "id">) => {
    const newItem: CollegeFacility = { ...item, id: `fac-${Date.now()}` };
    const updated = [...facilities, newItem];
    const res = await syncToFirestore(doc(db, "facilities", newItem.id), newItem, `facilities/${newItem.id}`);
    if (res.success) {
      setFacilitiesState(updated);
      setStored(STORAGE_KEYS.facilities, updated);
      notifyAll();
    }
    return res;
  };

  const deleteFacility = async (id: string) => {
    const updated = facilities.filter((f) => f.id !== id);
    const res = await deleteFromFirestore(doc(db, "facilities", id), `facilities/${id}`);
    if (res.success) {
      setFacilitiesState(updated);
      setStored(STORAGE_KEYS.facilities, updated);
      notifyAll();
    }
    return res;
  };

  // 6. Placements CMS
  const updatePlacements = async (updates: Partial<PlacementData>) => {
    const updated = { ...placements, ...updates };
    const res = await syncToFirestore(doc(db, collectionNames.placements, "overview"), updated, "placements/overview");
    if (res.success) {
      setPlacementsState(updated);
      setStored(STORAGE_KEYS.placements, updated);
      notifyAll();
    }
    return res;
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
    const res = await syncToFirestore(doc(db, collectionNames.announcements, newItem.id), newItem, `announcements/${newItem.id}`);
    if (res.success) {
      const updated = [newItem, ...announcements];
      setAnnouncementsState(updated);
      setStored(STORAGE_KEYS.announcements, updated);
      notifyAll();
    }
    return res;
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    const target = announcements.find((a) => a.id === id);
    if (!target) return { success: false, cloudSynced: false, error: new Error("Announcement not found") };
    const merged = { ...target, ...updates };

    const res = await syncToFirestore(doc(db, collectionNames.announcements, id), merged, `announcements/${id}`);
    if (res.success) {
      const updated = announcements.map((a) => (a.id === id ? merged : a));
      setAnnouncementsState(updated);
      setStored(STORAGE_KEYS.announcements, updated);
      notifyAll();
    }
    return res;
  };

  const deleteAnnouncement = async (id: string) => {
    const res = await deleteFromFirestore(doc(db, collectionNames.announcements, id), `announcements/${id}`);
    if (res.success) {
      const updated = announcements.filter((a) => a.id !== id);
      setAnnouncementsState(updated);
      setStored(STORAGE_KEYS.announcements, updated);
      notifyAll();
    }
    return res;
  };

  // 8. Events CRUD
  const addEvent = async (item: Omit<CollegeEvent, "id">) => {
    const newItem: CollegeEvent = { ...item, id: `evt-${Date.now()}` };
    const res = await syncToFirestore(doc(db, collectionNames.events, newItem.id), newItem, `events/${newItem.id}`);
    if (res.success) {
      const updated = [newItem, ...events];
      setEventsState(updated);
      setStored(STORAGE_KEYS.events, updated);
      notifyAll();
    }
    return res;
  };

  const updateEvent = async (id: string, updates: Partial<CollegeEvent>) => {
    const target = events.find((e) => e.id === id);
    if (!target) return { success: false, cloudSynced: false, error: new Error("Event not found") };
    const merged = { ...target, ...updates };

    const res = await syncToFirestore(doc(db, collectionNames.events, id), merged, `events/${id}`);
    if (res.success) {
      const updated = events.map((e) => (e.id === id ? merged : e));
      setEventsState(updated);
      setStored(STORAGE_KEYS.events, updated);
      notifyAll();
    }
    return res;
  };

  const deleteEvent = async (id: string) => {
    const res = await deleteFromFirestore(doc(db, collectionNames.events, id), `events/${id}`);
    if (res.success) {
      const updated = events.filter((e) => e.id !== id);
      setEventsState(updated);
      setStored(STORAGE_KEYS.events, updated);
      notifyAll();
    }
    return res;
  };

  // 9. Photo Gallery CRUD
  const addGalleryItem = async (item: Omit<GalleryItem, "id">) => {
    const newItem: GalleryItem = { ...item, id: Date.now() };
    const res = await syncToFirestore(doc(db, collectionNames.gallery, String(newItem.id)), newItem, `gallery/${newItem.id}`);
    if (res.success) {
      const updated = [newItem, ...galleryItems];
      setGalleryState(updated);
      setStored(STORAGE_KEYS.gallery, updated);
      notifyAll();
    }
    return res;
  };

  const updateGalleryItem = async (id: number | string, updates: Partial<GalleryItem>) => {
    const target = galleryItems.find((g) => g.id === id);
    if (!target) return { success: false, cloudSynced: false, error: new Error("Gallery item not found") };
    const merged = { ...target, ...updates };

    const res = await syncToFirestore(doc(db, collectionNames.gallery, String(id)), merged, `gallery/${id}`);
    if (res.success) {
      const updated = galleryItems.map((g) => (g.id === id ? merged : g));
      setGalleryState(updated);
      setStored(STORAGE_KEYS.gallery, updated);
      notifyAll();
    }
    return res;
  };

  const deleteGalleryItem = async (id: number | string) => {
    const res = await deleteFromFirestore(doc(db, collectionNames.gallery, String(id)), `gallery/${id}`);
    if (res.success) {
      const updated = galleryItems.filter((g) => g.id !== id);
      setGalleryState(updated);
      setStored(STORAGE_KEYS.gallery, updated);
      notifyAll();
    }
    return res;
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

  // 11. Safe & Idempotent Firestore Synchronization Helper
  // Guarantees:
  // - Never deletes existing Firestore data
  // - Never overwrites an existing Cloudinary URL with an empty string or fallback path
  // - Uses deterministic document IDs to prevent duplicate documents
  // - Safely deep-merges existing documents without clobbering newer remote data
  const seedInitialFirestoreData = async () => {
    if (!isFirebaseConfigured) return { success: false, message: "Firebase is not configured." };

    const isCloudinary = (url?: string): boolean => {
      return typeof url === "string" && (url.includes("cloudinary.com") || url.startsWith("https://res.cloudinary.com"));
    };

    const preserveImage = (remoteVal?: string, localVal?: string): string => {
      if (isCloudinary(remoteVal) && (!localVal || !isCloudinary(localVal))) {
        return remoteVal;
      }
      return localVal !== undefined && localVal !== "" ? localVal : (remoteVal || "");
    };

    try {
      let createdCount = 0;
      let mergedCount = 0;

      // 1. Site Settings (doc: siteSettings/general)
      const siteRef = doc(db, collectionNames.siteSettings, "general");
      const siteSnap = await getDoc(siteRef);
      if (siteSnap.exists()) {
        const remote = siteSnap.data() as Partial<SiteSettings>;
        const safeSite: SiteSettings = {
          ...remote,
          ...siteSettings,
          logoUrl: preserveImage(remote.logoUrl, siteSettings.logoUrl),
          faviconUrl: preserveImage(remote.faviconUrl, siteSettings.faviconUrl),
        };
        await setDoc(siteRef, safeSite, { merge: true });
        mergedCount++;
      } else {
        await setDoc(siteRef, siteSettings, { merge: true });
        createdCount++;
      }

      // 2. Departments (keyed by deterministic slug, e.g. "cse", "ai-ds")
      for (const d of departments) {
        const dRef = doc(db, "departments", d.slug);
        const dSnap = await getDoc(dRef);
        if (dSnap.exists()) {
          const remote = dSnap.data() as Partial<Department>;
          const safeDept: Department = {
            ...remote,
            ...d,
            image: preserveImage(remote.image, d.image),
            hodPhoto: preserveImage(remote.hodPhoto, d.hodPhoto),
          };
          await setDoc(dRef, safeDept, { merge: true });
          mergedCount++;
        } else {
          await setDoc(dRef, d, { merge: true });
          createdCount++;
        }
      }

      // 3. Homepage Settings (doc: homepage/content)
      const homeRef = doc(db, "homepage", "content");
      const homeSnap = await getDoc(homeRef);
      if (homeSnap.exists()) {
        const remote = homeSnap.data() as Partial<HomepageSettings>;
        const safeHome: HomepageSettings = {
          ...remote,
          ...homepage,
          heroImage: preserveImage(remote.heroImage, homepage.heroImage),
        };
        await setDoc(homeRef, safeHome, { merge: true });
        mergedCount++;
      } else {
        await setDoc(homeRef, homepage, { merge: true });
        createdCount++;
      }

      // 4. Facilities (keyed by deterministic facility.id, e.g. "fac-library")
      for (const f of facilities) {
        const fRef = doc(db, "facilities", f.id);
        const fSnap = await getDoc(fRef);
        if (fSnap.exists()) {
          const remote = fSnap.data() as Partial<CollegeFacility>;
          const safeFac: CollegeFacility = {
            ...remote,
            ...f,
            image: preserveImage(remote.image, f.image),
          };
          await setDoc(fRef, safeFac, { merge: true });
          mergedCount++;
        } else {
          await setDoc(fRef, f, { merge: true });
          createdCount++;
        }
      }

      // 5. Announcements (keyed by deterministic announcement.id)
      for (const a of announcements) {
        const aRef = doc(db, collectionNames.announcements, a.id);
        const aSnap = await getDoc(aRef);
        if (aSnap.exists()) {
          const remote = aSnap.data() as Partial<Announcement>;
          await setDoc(aRef, { ...remote, ...a }, { merge: true });
          mergedCount++;
        } else {
          await setDoc(aRef, a, { merge: true });
          createdCount++;
        }
      }

      // 6. Events (keyed by deterministic event.id)
      for (const e of events) {
        const eRef = doc(db, collectionNames.events, e.id);
        const eSnap = await getDoc(eRef);
        if (eSnap.exists()) {
          const remote = eSnap.data() as Partial<CollegeEvent>;
          const safeEvt: CollegeEvent = {
            ...remote,
            ...e,
            image: preserveImage(remote.image, e.image),
          };
          await setDoc(eRef, safeEvt, { merge: true });
          mergedCount++;
        } else {
          await setDoc(eRef, e, { merge: true });
          createdCount++;
        }
      }

      // 7. Gallery (keyed by deterministic String(item.id))
      for (const g of galleryItems) {
        const gRef = doc(db, collectionNames.gallery, String(g.id));
        const gSnap = await getDoc(gRef);
        if (gSnap.exists()) {
          const remote = gSnap.data() as Partial<GalleryItem>;
          const safeGal: GalleryItem = {
            ...remote,
            ...g,
            imageUrl: preserveImage(remote.imageUrl, g.imageUrl),
          };
          await setDoc(gRef, safeGal, { merge: true });
          mergedCount++;
        } else {
          await setDoc(gRef, g, { merge: true });
          createdCount++;
        }
      }

      // 8. Leadership (doc: about/leadership)
      const leadRef = doc(db, collectionNames.about, "leadership");
      const leadSnap = await getDoc(leadRef);
      if (leadSnap.exists()) {
        const remote = leadSnap.data() as Partial<Leadership>;
        const safeLead: Leadership = {
          ...remote,
          ...leadership,
          principal: {
            ...(remote.principal || {}),
            ...(leadership.principal || {}),
            photo: preserveImage(remote.principal?.photo, leadership.principal?.photo),
          },
          chairman: {
            ...(remote.chairman || {}),
            ...(leadership.chairman || {}),
            photo: preserveImage(remote.chairman?.photo, leadership.chairman?.photo),
          },
        };
        await setDoc(leadRef, safeLead, { merge: true });
        mergedCount++;
      } else {
        await setDoc(leadRef, leadership, { merge: true });
        createdCount++;
      }

      // 9. Placements (doc: placements/overview)
      const placeRef = doc(db, collectionNames.placements, "overview");
      const placeSnap = await getDoc(placeRef);
      if (placeSnap.exists()) {
        const remote = placeSnap.data() as Partial<PlacementData>;
        const safePlacements: PlacementData = {
          ...remote,
          ...placements,
          highestPackage: {
            ...(remote.highestPackage || {}),
            ...(placements.highestPackage || {}),
            studentPhoto: preserveImage(
              remote.highestPackage?.studentPhoto,
              placements.highestPackage?.studentPhoto
            ),
          },
          companies: (placements.companies || []).map((localC) => {
            const remoteC = (remote.companies || []).find((rc) => rc.id === localC.id);
            return {
              ...(remoteC || {}),
              ...localC,
              logo: preserveImage(remoteC?.logo, localC.logo),
            };
          }),
          gallery: (placements.gallery || []).map((localG) => {
            const remoteG = (remote.gallery || []).find((rg) => rg.id === localG.id);
            return {
              ...(remoteG || {}),
              ...localG,
              imageUrl: preserveImage(remoteG?.imageUrl, localG.imageUrl),
            };
          }),
        };
        await setDoc(placeRef, safePlacements, { merge: true });
        mergedCount++;
      } else {
        await setDoc(placeRef, placements, { merge: true });
        createdCount++;
      }

      console.log(`[CollegeStore] Idempotent Firestore sync complete: ${createdCount} created, ${mergedCount} merged safely.`);
      return { success: true, createdCount, mergedCount };
    } catch (err: any) {
      console.error("[CollegeStore] Safe Firestore sync notice:", err);
      return { success: false, error: err };
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
