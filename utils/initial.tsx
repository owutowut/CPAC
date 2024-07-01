import { CompanyI, EmployeeI } from "@/interfaces/company";

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

export const initialEmployee: EmployeeI = {
  companyId:'',
  IDcardNumber: '',
  titleName: '',
  firstName: '',
  lastName: '',
  address: '',
  position: '',
  workStartDate: '',
  resignationDate: '',
  status: 'active',
}