/**
 * gcpApi.ts — Centralized GCP data-fetching layer.
 * All functions call the Express proxy backend at /api/gcp/... and /api/bigquery/...
 * They return null on error so callers can show graceful error states.
 */

// ── GCP Types ─────────────────────────────────────────────────────────────────

export interface GcpProject {
    projectId: string;
    name: string;
    projectNumber: string;
    lifecycleState: string;
    createTime: string;
}

export interface GcpBillingAccount {
    name: string;
    displayName: string;
    open: boolean;
}

export interface GcpInstance {
    id: string;
    name: string;
    zone: string;
    machineType: string;
    status: 'RUNNING' | 'TERMINATED' | 'STAGING' | 'SUSPENDED';
    creationTimestamp: string;
    networkInterfaces: { name: string; networkIP: string }[];
    disks: number;
    tags: string[];
}

export interface GcpResourcesByType {
    total: number;
    byType: Record<string, number>;
    assetList?: { name: string; assetType: string; updateTime: string }[];
}

export interface GcpSummary {
    projectCount: number;
    projectId: string;
    totalResources: number;
    resourcesByType: Record<string, number>;
    costDistribution: { name: string; value: number }[];
    vms: { total: number; running: number; stopped: number };
    billing: { accountName: string; enabled: boolean | null; linkedProjectCount: number };
    fetchedAt: string;
}

// ── BigQuery Types ─────────────────────────────────────────────────────────────

export interface BqStatus {
    ready: boolean;
    rowCount: number;
    dataset: string;
    table: string;
    project: string;
    error?: string;
}

export interface BqCostTrend {
    data: { month: string; cost: number }[];
    ready: boolean;
}

export interface BqDailyCost {
    data: { date: string; cost: number }[];
    ready: boolean;
}

export interface BqTopServices {
    data: { service: string; cost: number }[];
    ready: boolean;
}

export interface BqProjectCosts {
    data: { project: string; cost: number }[];
    ready: boolean;
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function safeFetch<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`[gcpApi] ${url} → HTTP ${res.status}`);
            return null;
        }
        const data = await res.json() as T;
        if ((data as { error?: string }).error) {
            console.error(`[gcpApi] ${url} → API error: ${(data as { error: string }).error}`);
            return null;
        }
        return data;
    } catch (err) {
        console.error(`[gcpApi] ${url} → Network error:`, err);
        return null;
    }
}

// ── GCP API functions ─────────────────────────────────────────────────────────

/** Fetches all visible GCP projects. */
export async function fetchGcpProjects(): Promise<{ projects: GcpProject[]; total: number } | null> {
    return safeFetch('/api/gcp/projects');
}

/** Fetches billing accounts and linked project info. */
export async function fetchGcpBilling(): Promise<{
    accounts: GcpBillingAccount[];
    linkedProjects: { projectId: string; billingEnabled: boolean }[];
    currentProjectBilling: { billingEnabled: boolean; billingAccountName: string } | null;
} | null> {
    return safeFetch('/api/gcp/billing');
}

/** Fetches all GCP compute VM instances. */
export async function fetchGcpInstances(): Promise<{
    instances: GcpInstance[];
    total: number;
    running: number;
    stopped: number;
} | null> {
    return safeFetch('/api/gcp/compute/instances');
}

/** Fetches resource inventory counts by type. */
export async function fetchGcpResources(): Promise<GcpResourcesByType | null> {
    return safeFetch('/api/gcp/resources');
}

/** Fetches the aggregated dashboard summary (projects + VMs + billing + resources). */
export async function fetchGcpSummary(): Promise<GcpSummary | null> {
    return safeFetch('/api/gcp/summary');
}

/** Health check — returns true if the backend is reachable and GCP auth is working. */
export async function checkGcpHealth(): Promise<boolean> {
    try {
        const res = await fetch('/api/health');
        if (!res.ok) return false;
        const data = await res.json() as { status: string };
        return data.status === 'ok';
    } catch {
        return false;
    }
}

// ── BigQuery API functions ────────────────────────────────────────────────────

/**
 * Checks if the BigQuery billing export table is accessible and has data.
 * Always returns an object — `ready: false` means not configured yet, not an error.
 */
export async function fetchBqStatus(): Promise<BqStatus> {
    try {
        const res = await fetch('/api/bigquery/status');
        if (!res.ok) return { ready: false, rowCount: 0, dataset: '', table: '', project: '', error: `HTTP ${res.status}` };
        return res.json();
    } catch (err) {
        return { ready: false, rowCount: 0, dataset: '', table: '', project: '', error: String(err) };
    }
}

/** Monthly cost trend for the last 6 months from BigQuery. */
export async function fetchBqCostTrend(): Promise<BqCostTrend> {
    try {
        const res = await fetch('/api/bigquery/cost-trend');
        if (!res.ok) return { data: [], ready: false };
        return res.json();
    } catch { return { data: [], ready: false }; }
}

/** Daily cost totals for the last 30 days from BigQuery. */
export async function fetchBqDailyCost(): Promise<BqDailyCost> {
    try {
        const res = await fetch('/api/bigquery/daily-cost');
        if (!res.ok) return { data: [], ready: false };
        return res.json();
    } catch { return { data: [], ready: false }; }
}

/** Top 10 GCP services by cost for the current month from BigQuery. */
export async function fetchBqTopServices(): Promise<BqTopServices> {
    try {
        const res = await fetch('/api/bigquery/top-services');
        if (!res.ok) return { data: [], ready: false };
        return res.json();
    } catch { return { data: [], ready: false }; }
}

/** Per-project cost totals for the current month from BigQuery. */
export async function fetchBqProjectCosts(): Promise<BqProjectCosts> {
    try {
        const res = await fetch('/api/bigquery/project-costs');
        if (!res.ok) return { data: [], ready: false };
        return res.json();
    } catch { return { data: [], ready: false }; }
}
