require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const { BigQuery } = require('@google-cloud/bigquery');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'infra-backend-489717';

// ── BigQuery Config ───────────────────────────────────────────────────────────
const BQ_PROJECT = process.env.BIGQUERY_PROJECT || PROJECT_ID;
const BQ_DATASET = process.env.BIGQUERY_DATASET || 'billing_export';
const BQ_TABLE = process.env.BIGQUERY_TABLE || 'gcp_billing_export_v1';
const BQ_FULL_TABLE = `\`${BQ_PROJECT}.${BQ_DATASET}.${BQ_TABLE}\``;

const KEY_FILE_ABS = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : path.resolve(__dirname, '../google_oauth2.json');

const bigquery = new BigQuery({
    projectId: BQ_PROJECT,
    keyFilename: KEY_FILE_ABS,
});

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

// ── GCP Auth Helper ───────────────────────────────────────────────────────────
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : path.resolve(__dirname, '../google_oauth2.json');

/**
 * Get a scoped OAuth2 access token using the service account.
 * @param {string[]} scopes - GCP OAuth2 scopes
 */
async function getAccessToken(scopes) {
    const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
}

/**
 * Make an authenticated GCP REST API call.
 */
async function gcpFetch(url, scopes) {
    const token = await getAccessToken(scopes);
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`GCP API error ${res.status}: ${errText}`);
    }
    return res.json();
}

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/gcp/projects
 * Lists all GCP projects visible to the service account.
 * Uses: Cloud Resource Manager API v1
 */
app.get('/api/gcp/projects', async (req, res) => {
    try {
        const SCOPE = ['https://www.googleapis.com/auth/cloudplatforms'];
        const data = await gcpFetch(
            'https://cloudresourcemanager.googleapis.com/v1/projects?filter=lifecycleState:ACTIVE',
            ['https://www.googleapis.com/auth/cloud-platform.read-only']
        );
        const projects = (data.projects || []).map((p) => ({
            projectId: p.projectId,
            name: p.name,
            projectNumber: p.projectNumber,
            lifecycleState: p.lifecycleState,
            createTime: p.createTime,
            labels: p.labels || {},
        }));
        res.json({ projects, total: projects.length });
    } catch (err) {
        console.error('[/api/gcp/projects]', err.message);
        res.status(500).json({ error: err.message, projects: [], total: 0 });
    }
});

/**
 * GET /api/gcp/billing
 * Lists billing accounts and their linked projects.
 * Uses: Cloud Billing API v1
 */
app.get('/api/gcp/billing', async (req, res) => {
    try {
        const scopes = ['https://www.googleapis.com/auth/cloud-billing.readonly'];

        // 1. List billing accounts
        const billingData = await gcpFetch(
            'https://cloudbilling.googleapis.com/v1/billingAccounts',
            scopes
        );
        const accounts = (billingData.billingAccounts || []).map((a) => ({
            name: a.name,
            displayName: a.displayName,
            open: a.open,
            masterBillingAccount: a.masterBillingAccount,
        }));

        // 2. For each account, fetch linked projects (up to first account only to avoid rate limits)
        let linkedProjects = [];
        if (accounts.length > 0) {
            try {
                const projectsData = await gcpFetch(
                    `https://cloudbilling.googleapis.com/v1/${accounts[0].name}/projects`,
                    scopes
                );
                linkedProjects = (projectsData.projectBillingInfo || []).map((p) => ({
                    projectId: p.projectId,
                    billingAccountName: p.billingAccountName,
                    billingEnabled: p.billingEnabled,
                }));
            } catch (e) {
                console.warn('[billing/projects]', e.message);
            }
        }

        // 3. Also get current project's billing info
        let currentProjectBilling = null;
        try {
            currentProjectBilling = await gcpFetch(
                `https://cloudbilling.googleapis.com/v1/projects/${PROJECT_ID}/billingInfo`,
                scopes
            );
        } catch (e) {
            console.warn('[billing/currentProject]', e.message);
        }

        res.json({ accounts, linkedProjects, currentProjectBilling });
    } catch (err) {
        console.error('[/api/gcp/billing]', err.message);
        res.status(500).json({ error: err.message, accounts: [], linkedProjects: [] });
    }
});

/**
 * GET /api/gcp/compute/instances
 * Lists all Compute Engine VM instances across all zones.
 * Uses: Compute Engine API v1 (aggregated list)
 */
app.get('/api/gcp/compute/instances', async (req, res) => {
    try {
        const data = await gcpFetch(
            `https://compute.googleapis.com/compute/v1/projects/${PROJECT_ID}/aggregated/instances`,
            ['https://www.googleapis.com/auth/compute.readonly']
        );

        const instances = [];
        const items = data.items || {};
        for (const [zone, zoneData] of Object.entries(items)) {
            if (zoneData.instances) {
                for (const inst of zoneData.instances) {
                    instances.push({
                        id: inst.id,
                        name: inst.name,
                        zone: zone.replace('zones/', ''),
                        machineType: inst.machineType ? inst.machineType.split('/').pop() : 'unknown',
                        status: inst.status,
                        creationTimestamp: inst.creationTimestamp,
                        networkInterfaces: (inst.networkInterfaces || []).map((n) => ({
                            name: n.name,
                            networkIP: n.networkIP,
                        })),
                        disks: (inst.disks || []).length,
                        tags: (inst.tags && inst.tags.items) || [],
                    });
                }
            }
        }

        const running = instances.filter((i) => i.status === 'RUNNING').length;
        const stopped = instances.filter((i) => i.status === 'TERMINATED').length;

        res.json({ instances, total: instances.length, running, stopped });
    } catch (err) {
        console.error('[/api/gcp/compute/instances]', err.message);
        res.status(500).json({ error: err.message, instances: [], total: 0, running: 0, stopped: 0 });
    }
});

/**
 * GET /api/gcp/resources
 * Lists all GCP assets (resource inventory) grouped by type.
 * Uses: Cloud Asset API v1
 */
app.get('/api/gcp/resources', async (req, res) => {
    try {
        const assetTypes = [
            'compute.googleapis.com/Instance',
            'compute.googleapis.com/Disk',
            'compute.googleapis.com/Network',
            'storage.googleapis.com/Bucket',
            'container.googleapis.com/Cluster',
            'cloudfunctions.googleapis.com/CloudFunction',
            'run.googleapis.com/Service',
            'sqladmin.googleapis.com/Instance',
            'iam.googleapis.com/ServiceAccount',
        ];

        const url = new URL(`https://cloudasset.googleapis.com/v1/projects/${PROJECT_ID}/assets`);
        url.searchParams.set('contentType', 'RESOURCE');
        url.searchParams.set('pageSize', '500');
        assetTypes.forEach((t) => url.searchParams.append('assetTypes', t));

        const data = await gcpFetch(url.toString(), [
            'https://www.googleapis.com/auth/cloud-platform.read-only',
        ]);

        const assets = data.assets || [];
        const byType = {};
        for (const asset of assets) {
            const typeParts = asset.assetType ? asset.assetType.split('/') : ['unknown'];
            const shortType = typeParts[typeParts.length - 1];
            byType[shortType] = (byType[shortType] || 0) + 1;
        }

        res.json({
            total: assets.length,
            byType,
            assetList: assets.map((a) => ({
                name: a.name,
                assetType: a.assetType,
                updateTime: a.updateTime,
            })),
        });
    } catch (err) {
        console.error('[/api/gcp/resources]', err.message);
        res.status(500).json({ error: err.message, total: 0, byType: {} });
    }
});

/**
 * GET /api/gcp/summary
 * Aggregated summary for the dashboard cards.
 * Calls projects, billing, compute, and resources in parallel.
 */
app.get('/api/gcp/summary', async (req, res) => {
    try {
        // Run all data fetches in parallel for speed
        const [projectsRes, computeRes, resourcesRes, billingRes] = await Promise.allSettled([
            fetch(`http://localhost:${PORT}/api/gcp/projects`).then((r) => r.json()),
            fetch(`http://localhost:${PORT}/api/gcp/compute/instances`).then((r) => r.json()),
            fetch(`http://localhost:${PORT}/api/gcp/resources`).then((r) => r.json()),
            fetch(`http://localhost:${PORT}/api/gcp/billing`).then((r) => r.json()),
        ]);

        const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : { projects: [], total: 0 };
        const compute = computeRes.status === 'fulfilled' ? computeRes.value : { instances: [], total: 0, running: 0 };
        const resources = resourcesRes.status === 'fulfilled' ? resourcesRes.value : { total: 0, byType: {} };
        const billing = billingRes.status === 'fulfilled' ? billingRes.value : { accounts: [], linkedProjects: [] };

        // Build cost distribution from resource byType for pie chart
        const costDistribution = Object.entries(resources.byType || {}).map(([name, value]) => ({
            name,
            value,
        }));

        // Billing account display name
        const billingAccount = billing.accounts && billing.accounts.length > 0
            ? billing.accounts[0].displayName
            : 'Unknown';

        const billingEnabled = billing.currentProjectBilling
            ? billing.currentProjectBilling.billingEnabled
            : null;

        res.json({
            projectCount: projects.total,
            projectId: PROJECT_ID,
            totalResources: resources.total,
            resourcesByType: resources.byType,
            costDistribution,
            vms: {
                total: compute.total,
                running: compute.running,
                stopped: compute.stopped,
            },
            billing: {
                accountName: billingAccount,
                enabled: billingEnabled,
                linkedProjectCount: billing.linkedProjects ? billing.linkedProjects.length : 0,
            },
            fetchedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[/api/gcp/summary]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/health
 * Health check to verify the server and GCP auth are working.
 */
app.get('/api/health', async (req, res) => {
    try {
        const auth = new GoogleAuth({
            keyFile: KEY_FILE,
            scopes: ['https://www.googleapis.com/auth/cloud-platform.read-only'],
        });
        const client = await auth.getClient();
        await client.getAccessToken();
        res.json({ status: 'ok', gcpAuth: 'connected', projectId: PROJECT_ID });
    } catch (err) {
        res.status(500).json({ status: 'error', gcpAuth: 'failed', error: err.message });
    }
});

// ── BigQuery Routes ───────────────────────────────────────────────────────────

// ── Stats Tracking Routes ─────────────────────────────────────────────────────

app.post('/api/stats/view', async (req, res) => {
    try {
        const { clerkId, email, name, pageName } = req.body;
        if (!clerkId) return res.status(400).json({ error: 'Missing clerkId' });
        if (!pageName) return res.status(400).json({ error: 'Missing pageName' });

        const user = await prisma.user.upsert({
            where: { clerkId },
            update: { lastActive: new Date() }, // Optional if I add lastActive
            create: { clerkId, email: email || '', name: name || '' }
        });

        const stat = await prisma.pageStat.upsert({
            where: { userId_pageName: { userId: user.id, pageName } },
            update: { viewCount: { increment: 1 }, lastVisited: new Date() },
            create: { userId: user.id, pageName, viewCount: 1 }
        });

        res.json({ success: true, stat });
    } catch (err) {
        console.error('[/api/stats/view]', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/stats/action', async (req, res) => {
    try {
        const { clerkId, actionType, metadata } = req.body;
        if (!clerkId) return res.status(400).json({ error: 'Missing clerkId' });
        if (!actionType) return res.status(400).json({ error: 'Missing actionType' });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const action = await prisma.userAction.create({
            data: {
                userId: user.id,
                actionType,
                metadata: metadata ? JSON.stringify(metadata) : null
            }
        });

        res.json({ success: true, action });
    } catch (err) {
        console.error('[/api/stats/action]', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/stats/:clerkId', async (req, res) => {
    try {
        const { clerkId } = req.params;
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { pageStats: true, actions: { orderBy: { timestamp: 'desc' }, take: 20 } }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ user });
    } catch (err) {
        console.error('[/api/stats/:clerkId]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/bigquery/status
 * Checks whether the BigQuery billing export table is accessible and has data.
 */
app.get('/api/bigquery/status', async (req, res) => {
    try {
        const query = `SELECT COUNT(*) as row_count FROM ${BQ_FULL_TABLE} LIMIT 1`;
        const [rows] = await bigquery.query({ query, location: 'US' });
        const rowCount = Number(rows[0]?.row_count ?? 0);
        res.json({
            ready: rowCount > 0,
            rowCount,
            dataset: BQ_DATASET,
            table: BQ_TABLE,
            project: BQ_PROJECT,
        });
    } catch (err) {
        console.error('[/api/bigquery/status]', err.message);
        res.json({
            ready: false,
            rowCount: 0,
            error: err.message,
            dataset: BQ_DATASET,
            table: BQ_TABLE,
            project: BQ_PROJECT,
        });
    }
});

/**
 * GET /api/bigquery/cost-trend
 * Monthly total cost (USD) for the past 6 months.
 */
app.get('/api/bigquery/cost-trend', async (req, res) => {
    try {
        const query = `
            SELECT
                FORMAT_DATE('%Y-%m', DATE(usage_start_time)) AS month,
                ROUND(SUM(cost) + SUM(IFNULL((SELECT SUM(a.amount) FROM UNNEST(credits) a), 0)), 2) AS cost
            FROM ${BQ_FULL_TABLE}
            WHERE DATE(usage_start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        `;
        const [rows] = await bigquery.query({ query, location: 'US' });
        const data = rows.map(r => ({ month: r.month, cost: Number(r.cost) }));
        res.json({ data, ready: data.length > 0 });
    } catch (err) {
        console.error('[/api/bigquery/cost-trend]', err.message);
        res.json({ data: [], ready: false, error: err.message });
    }
});

/**
 * GET /api/bigquery/daily-cost
 * Daily total cost (USD) for the past 30 days.
 */
app.get('/api/bigquery/daily-cost', async (req, res) => {
    try {
        const query = `
            SELECT
                FORMAT_DATE('%Y-%m-%d', DATE(usage_start_time)) AS date,
                ROUND(SUM(cost) + SUM(IFNULL((SELECT SUM(a.amount) FROM UNNEST(credits) a), 0)), 4) AS cost
            FROM ${BQ_FULL_TABLE}
            WHERE DATE(usage_start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
            GROUP BY date
            ORDER BY date ASC
        `;
        const [rows] = await bigquery.query({ query, location: 'US' });
        const data = rows.map(r => ({ date: r.date, cost: Number(r.cost) }));
        res.json({ data, ready: data.length > 0 });
    } catch (err) {
        console.error('[/api/bigquery/daily-cost]', err.message);
        res.json({ data: [], ready: false, error: err.message });
    }
});

/**
 * GET /api/bigquery/top-services
 * Top 10 GCP services by cost for the current calendar month.
 */
app.get('/api/bigquery/top-services', async (req, res) => {
    try {
        const query = `
            SELECT
                service.description AS service,
                ROUND(SUM(cost) + SUM(IFNULL((SELECT SUM(a.amount) FROM UNNEST(credits) a), 0)), 2) AS cost
            FROM ${BQ_FULL_TABLE}
            WHERE DATE(usage_start_time) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
            GROUP BY service
            ORDER BY cost DESC
            LIMIT 10
        `;
        const [rows] = await bigquery.query({ query, location: 'US' });
        const data = rows.map(r => ({ service: r.service, cost: Number(r.cost) }));
        res.json({ data, ready: data.length > 0 });
    } catch (err) {
        console.error('[/api/bigquery/top-services]', err.message);
        res.json({ data: [], ready: false, error: err.message });
    }
});

/**
 * GET /api/bigquery/project-costs
 * Cost per project for the current calendar month.
 */
app.get('/api/bigquery/project-costs', async (req, res) => {
    try {
        const query = `
            SELECT
                project.id AS project,
                ROUND(SUM(cost) + SUM(IFNULL((SELECT SUM(a.amount) FROM UNNEST(credits) a), 0)), 2) AS cost
            FROM ${BQ_FULL_TABLE}
            WHERE DATE(usage_start_time) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
            GROUP BY project
            ORDER BY cost DESC
        `;
        const [rows] = await bigquery.query({ query, location: 'US' });
        const data = rows.map(r => ({ project: r.project, cost: Number(r.cost) }));
        res.json({ data, ready: data.length > 0 });
    } catch (err) {
        console.error('[/api/bigquery/project-costs]', err.message);
        res.json({ data: [], ready: false, error: err.message });
    }
});

// ── AI Recommendations (Gemini 3.1 Flash-Lite) ───────────────────────────────

const FLASH_LITE_MODEL = 'gemini-3.1-flash-lite-preview';

/**
 * POST /api/ai/chat
 * Handles chat queries for the AI Recommendations tab using Gemini.
 */
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here') {
            return res.status(500).json({ error: 'GEMINI_API_KEY is missing or invalid in backend/.env' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `
You are Infra AI, an expert cloud optimization assistant for the "Nexus Solo" dashboard.
Your job is to analyze cloud infrastructure (GCP/AWS/Azure), identify cost and security issues, and provide actionable recommendations.
Be brief, precise, and professional. 

When the user asks about specific problems like cost increases or security risks, use realistic simulated data if none is provided in the prompt to explain the situation clearly. Point out exactly which instances or buckets have the issue.
Keep your responses concise as they will be displayed in a small chat window. Do not use overly long paragraphs.
        `.trim();

        // Convert the simple format to GenAI format if needed
        // Assuming the frontend sends [{ role: 'user'|'model', parts: [{text: '...'}] }]
        // or just strings. The SDK handles history for generateContent? Actually, no, let's just 
        // stringify the chat history or manually call generateContent with the history.
        // For simplicity, we just take the last user message and pass it as the prompt,
        // or format the whole conversation. Let's format the conversation.
        const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');

        const response = await ai.models.generateContent({
            model: FLASH_LITE_MODEL,
            contents: conversationText,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        res.json({ reply: response.text });
    } catch (err) {
        console.error('[/api/ai/chat]', err);
        res.status(500).json({ error: err.message });
    }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 GCP proxy server running on http://localhost:${PORT}`);
    console.log(`   Project ID : ${PROJECT_ID}`);
    console.log(`   Key file   : ${KEY_FILE_ABS}`);
    console.log(`   BigQuery   : ${BQ_FULL_TABLE}`);
    console.log(`\nEndpoints:`);
    console.log(`   GET /api/health`);
    console.log(`   GET /api/gcp/projects`);
    console.log(`   GET /api/gcp/billing`);
    console.log(`   GET /api/gcp/compute/instances`);
    console.log(`   GET /api/gcp/resources`);
    console.log(`   GET /api/gcp/summary`);
    console.log(`   GET /api/bigquery/status`);
    console.log(`   GET /api/bigquery/cost-trend`);
    console.log(`   GET /api/bigquery/daily-cost`);
    console.log(`   GET /api/bigquery/top-services`);
    console.log(`   GET /api/bigquery/project-costs`);
});

