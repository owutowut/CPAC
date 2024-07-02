export interface CompanyI {
    companyId: string,
    taxNumber: string;
    employerNumber: string;
    branchNumber: string;
    employerName: string;
    position: string;
    companyName: string;
    address: string;
    status: string;
    employeeSocialSecurityRates: number[],
    employerSocialSecurityRates: number[],
}

export interface EmployeeI {
    employeeId: string,
    companyId: string,
    IDcardNumber: string;
    titleName: string;
    firstName: string;
    lastName: string;
    address: string;
    position: string;
    workStartDate: string;
    resignationDate: string;
    status: string;
}