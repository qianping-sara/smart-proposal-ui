/** Shared types and constants for Solution Package (standard template). */

export type SolutionPackageServiceRow = {
  id: string
  scopeOfWork: string
  monthlyQuarterly: string
  annual: string
  onceOff: string
}

export type SolutionPackage = {
  id: string
  name: string
  services: SolutionPackageServiceRow[]
}

function genId(): string {
  return `sp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const ROW1_SCOPE = `3.1   Preparation and electronic lodgement of annual financial statements and company income tax return, including the following: · Preparation of special purpose financial statements; · Preparation and lodgement of company tax return; · Year-end review of shareholder loans and dividend payments (where necessary), including preparation of dividend statements and resolutions; and · Preparation of closing adjustment journals.`

const ROW1_ANNUAL = `Tiered by Revenue Tier by Revenue subject to Appendix
$5,000.00 - $8,500.00+`

const ROW2_SCOPE = `3.2   Outsourced tax compliance services, including:· Periodic review of accounting file prepared by bookkeeper, including key account reconciliations, adjusting journals and feedback;· Preparation and lodgement of quarterly Business Activity Statement ("BAS") returns with the Australian Taxation Office.`

const ROW2_MONTHLY_QUARTERLY = `$750.00 Quarterly payment`

/** Returns a new Tax & Compliance Services package with generated ids. */
export function createTaxCompliancePackage(): SolutionPackage {
  return {
    id: genId(),
    name: 'Tax & Compliance Services',
    services: [
      {
        id: genId(),
        scopeOfWork: ROW1_SCOPE,
        monthlyQuarterly: '',
        annual: ROW1_ANNUAL,
        onceOff: '',
      },
      {
        id: genId(),
        scopeOfWork: ROW2_SCOPE,
        monthlyQuarterly: ROW2_MONTHLY_QUARTERLY,
        annual: '',
        onceOff: '',
      },
    ],
  }
}

export const STANDARD_SERVICE_CATALOG = ['Tax & Compliance Services'] as const
