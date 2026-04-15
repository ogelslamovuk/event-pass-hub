import type { AppState, Application, EventRecord, OrganizerSaleRecord } from "@/lib/store";
import { getCurrentOrganizer, getMyApplications, getMyEvents, getMyOrganizerDocuments, getMySales } from "@/lib/store";

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
