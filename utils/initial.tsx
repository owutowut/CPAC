import { CompanyI } from "@/interfaces/company";

export const initialCompany: CompanyI = {
  taxNumber: '',
  employerNumber: '',
  branchNumber: '',
  employerName: '',
  position: '',
  companyName: '',
  address: '',
  status: 'active',
  employeeSocialSecurityRates: [],
  employerSocialSecurityRates: [],
}