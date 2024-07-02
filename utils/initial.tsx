import { CompanyI, EmployeeI, EmployeePaymentI } from "@/interfaces/company";

export const initialCompany: CompanyI = {
  companyId: '',
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
  employeeId: '',
  companyId: '',
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

export const initialEmployeePayment: EmployeePaymentI = {
  employeeId: '',
  year: new Date().getFullYear() + 543,
  jan: [],
  feb: [],
  mar: [],
  apr: [],
  may: [],
  jun: [],
  jul: [],
  aug: [],
  sep: [],
  oct: [],
  nov: [],
  dec: []
}

export const initialAlertSuccess = {
  className: 'text-green-700',
  message: 'เพิ่มข้อมูลสำเร็จ',
  type: 'success'
}

export const initialAlertError = {
  className: 'text-red-700',
  message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง',
  type: 'error'
}

export const initialAlertInfo = {
  className: 'text-blue-700',
  message: 'แก้ไขข้อมูลสำเร็จ',
  type: 'info'
}