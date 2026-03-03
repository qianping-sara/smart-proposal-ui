/** Shared types and constants for Solution Package (standard template). */

export type SolutionPackageServiceRow = {
  id: string
  scopeOfWork: string
  monthly: string
  quarterly: string
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

const ROW1_ANNUAL = `$5,000.00`

const ROW2_SCOPE = `3.2   Outsourced tax compliance services, including:· Periodic review of accounting file prepared by bookkeeper, including key account reconciliations, adjusting journals and feedback;· Preparation and lodgement of quarterly Business Activity Statement ("BAS") returns with the Australian Taxation Office.`

/** Returns a new Tax & Compliance Services package with generated ids. */
export function createTaxCompliancePackage(): SolutionPackage {
  return {
    id: genId(),
    name: 'Tax & Compliance Services',
    services: [
      {
        id: genId(),
        scopeOfWork: ROW1_SCOPE,
        monthly: '',
        quarterly: '',
        annual: ROW1_ANNUAL,
        onceOff: '',
      },
      {
        id: genId(),
        scopeOfWork: ROW2_SCOPE,
        monthly: '',
        quarterly: '$750.00',
        annual: '',
        onceOff: '',
      },
    ],
  }
}

const INITIAL_STRUCTURING_ROW1_SCOPE = `1.1 Incorporation of Pty Ltd, including: 
· Incorporation with the Australian Securities & Investments Commission ("ASIC"); 
· Attending to various registrations including Australian Business Number ("ABN"), Tax File Number ("TFN"), Goods & Services Tax ("GST") and Pay As You Go Withholding ("PAYG"); 
· Provision of corporate register including company constitution, directors' minutes, consents and share certificates; and 
Registration as agent for ASIC and ATO purposes.`

const INITIAL_STRUCTURING_ROW2_SCOPE = `1.2 Application for Substituted Accounting Period to synchronise the Australian entity's fiscal year-end to Parent entity's foreign reporting period.`

/** Returns a new Initial Structuring – Pty Ltd Company package with generated ids. */
export function createInitialStructuringPackage(): SolutionPackage {
  return {
    id: genId(),
    name: 'Initial Structuring – Pty Ltd Company',
    services: [
      {
        id: genId(),
        scopeOfWork: INITIAL_STRUCTURING_ROW1_SCOPE,
        monthly: '',
        quarterly: '',
        annual: '',
        onceOff: '$2,500.00',
      },
      {
        id: genId(),
        scopeOfWork: INITIAL_STRUCTURING_ROW2_SCOPE,
        monthly: '',
        quarterly: '',
        annual: '',
        onceOff: '$600.00',
      },
    ],
  }
}

export const STANDARD_SERVICE_CATALOG = ['Tax & Compliance Services', 'Initial Structuring – Pty Ltd Company'] as const
