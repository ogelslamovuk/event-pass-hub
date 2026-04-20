import type {
  AppState,
  Application,
  EventComplianceApplicationRecord,
  EventRecord,
  OrganizerApplicationRecord,
  OrganizerSaleRecord,
} from "@/lib/store";
import {
  getCurrentOrganizer,
  getMyApplications,
  getMyEvents,
  getMyOrganizerDocuments,
  getMySales,
  getOrganizerApplicationByOrganizerId,
  getOrganizerRegistryRecord,
  isOrganizerApproved,
} from "@/lib/store";

export const DEMO_VAT_RATE = 0.2;

export interface OrganizerReportRow {
  saleId: string;
  eventTitle: string;
  soldAt: string;
  quantity: number;
  unitPrice: number;
  saleAmount: number;
  vatAmount: number;
  netRevenue: number;
}

export function selectCurrentOrganizer(state: AppState) {
  return getCurrentOrganizer(state);
}

export function selectMyApplications(state: AppState): Application[] {
  return getMyApplications(state);
}

export function selectMyEvents(state: AppState): EventRecord[] {
  return getMyEvents(state);
}

export function selectMySales(state: AppState): OrganizerSaleRecord[] {
  return getMySales(state);
}

export function selectMyDocuments(state: AppState) {
  return getMyOrganizerDocuments(state);
}

export function selectMyOrganizerApplication(state: AppState): OrganizerApplicationRecord | null {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return null;
  return getOrganizerApplicationByOrganizerId(state, organizer.organizerId);
}

export function selectIsCurrentOrganizerApproved(state: AppState): boolean {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return false;
  return isOrganizerApproved(state, organizer.organizerId);
}

export function selectMyOrganizerRegistryRecord(state: AppState) {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return null;
  return getOrganizerRegistryRecord(state, organizer.organizerId);
}

export function selectMyEventComplianceApplications(state: AppState): EventComplianceApplicationRecord[] {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return [];
  return state.eventComplianceApplications.filter((x) => x.organizerId === organizer.organizerId);
}

export function selectMyReportingRows(state: AppState): OrganizerReportRow[] {
  return selectMySales(state).map((sale) => {
    const saleAmount = sale.amount;
    const vatAmount = Number((saleAmount * DEMO_VAT_RATE).toFixed(2));
    const netRevenue = Number((saleAmount - vatAmount).toFixed(2));
    return {
      saleId: sale.saleId,
      eventTitle: sale.eventTitle,
      soldAt: sale.soldAt,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      saleAmount,
      vatAmount,
      netRevenue,
    };
  });
}
