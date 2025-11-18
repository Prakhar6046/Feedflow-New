# Production Manager data flows (Stock, Transfer, Harvest, Mortalities, Sample)

This document explains how each action in the Production Manager modal writes to the database, which API routes are called, and how the information is consumed elsewhere in the app.

---

## Core tables involved

- production
  - The current state of a production unit for a batch on a specific day.
  - Key fields: `fishFarmId`, `productionUnitId`, `batchNumberId`, `fishCount`, `biomass`, `meanWeight`, `meanLength`, `stockingDensityKG`, `stockingDensityNM`, `stockingLevel`, `currentDate`, `field`.
- FishManageHistory
  - An immutable audit trail of all actions (stock, transfer, harvest, mortalities, sample). Each action is one row.
  - Mirrors most production columns and adds `field` to label the action.
- FishSupply
  - Hatchery/batch supply metadata connected to a farm and later referenced by `production.batchNumberId`.

Model definitions are in `prisma/schema.prisma` (see models: `production`, `FishManageHistory`, `FishSupply`, `Farm`, `ProductionUnit`).  

---

## Single write entry-point

All five actions are saved through a single API route:

- POST `/api/production/mange`
  - File: `app/api/production/mange/route.ts`
  - Accepts either a single object or `data: []` array. A single request can persist multiple rows (useful for multi-row transfers/harvests).

Payload (per item):
```json
{
  "fishFarm": "<farmId>",
  "productionUnit": "<productionUnitId>",
  "batchNumber": 123,              // optional
  "count": "7500",                 // fishCount (string in DB)
  "biomass": "200",                // kg
  "meanLength": "110",             // mm
  "meanWeight": "5.0",             // g
  "stockingLevel": "Starter",
  "stockingDensityKG": "0.03",
  "stockingDensityNM": "0.07",
  "currentDate": "YYYY-MM-DD",
  "field": "stock | transfer | harvest | mortalities | sample",
  "id": 456                        // optional; if present we UPDATE production, otherwise CREATE a new production row
}
```

On every item the route does two things atomically per item (loop):
1) Inserts an audit record into `FishManageHistory` with the exact values + `field` (the action label).
2) Upserts the current state in `production`:
   - If `id` is present → `production.update({ where: { id }, data: { ... } })`
   - Else → `production.create({ data: { ... } })`

Columns written in both places include farm/unit linkage, fishCount, biomass, averages, stocking metrics, and the `field` tag.

---

## What each action means

The UI shows five options under “Add Row”. The backend doesn’t branch logic per action; instead the action is carried in the `field` column and interpreted by analytics/aggregations. The typical semantics are:

- Stock
  - Record initial or additional stocking for a unit. Usually increases `fishCount` and sets initial `biomass`, mean size, densities.
  - Creates `FishManageHistory` with `field = "stock"` and updates/creates `production` row for the date.

- Transfer
  - Move fish from one unit to another. The UI sends separate rows for source and destination (each with their own farm/unit IDs). Both rows are stored with `field = "transfer"` so the history reflects the move.
  - When source and destination are in one “generate” action, send as `data: [srcRow, dstRow]` so they are saved in one API call and appear on the same date.

- Harvest
  - Remove fish from a unit. Update the unit’s `fishCount`/`biomass` downwards for the given date and insert a `FishManageHistory` row with `field = "harvest"`.

- Mortalities
  - Log mortalities for the date; reduces `fishCount` in `production` and creates a history row with `field = "mortalities"`.

- Sample
  - Record sampling without necessarily changing population—typically updates `meanWeight`, `meanLength`, and densities, and creates a history row with `field = "sample"` for traceability.

Important: The route does not compute deltas; the client sends the values (post-transfer counts, etc.). That keeps the route idempotent and auditable.

---

## Reading back data

- Current production snapshot:
  - GET `/api/production` or project-specific queries read from `production` to display current state per unit/batch.
- Full event history:
  - Query `FishManageHistory` filtered by `fishFarmId`, `productionUnitId`, `batchNumberId` or by `field` to reconstruct a timeline of stock/transfer/harvest/mortalities/sample.

Examples (Prisma):
```ts
// History for a unit
await prisma.fishManageHistory.findMany({
  where: { fishFarmId, productionUnitId },
  orderBy: { createdAt: 'asc' }
});

// Current production rows for a farm
await prisma.production.findMany({
  where: { fishFarmId },
  orderBy: { updatedAt: 'desc' }
});
```

---

## Relations and foreign keys

- `production.fishFarmId` → `Farm.id`
- `production.productionUnitId` → `ProductionUnit.id`
- `production.batchNumberId` → `FishSupply.id`
- History mirrors the same relations so every action is traceable to farm, unit, and (when applicable) batch.

---

## Validation and security

- Most routes use token verification; see `verifyAndRefreshToken` used widely (e.g., `app/api/production/route.ts`).
- The manage route currently does not gate by token; add the same check if needed.
- All IDs are stored as strings/ints per schema and we coerce where necessary (e.g., `Number(data.batchNumber)`).

---

## Where this is used in the UI

- The Production Manager modal (Add Row) builds the payload described above and posts to `/api/production/mange`.
- The dashboard and reports pages read from `production` for the latest snapshot and `FishManageHistory` for historical analytics.

---

## Operational notes

- Because each action also writes a corresponding `FishManageHistory` row, you can safely recompute analytics without risking loss of information.
- For multi-step actions (like transfer), always submit both sides together in `data: []` so counts remain consistent for the date.

---

## Quick reference

- Write endpoint: `POST /api/production/mange` → writes `FishManageHistory` + upserts `production`
- Read current: query `production`
- Read history: query `FishManageHistory` (filter by `field` to isolate action types)

This keeps the system simple: one write path, two read models (snapshot + audit trail). 


