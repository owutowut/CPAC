export interface CompanyI {
    companyId: string;
    taxNumber: string;
    employerNumber: string;
    branchNumber: string;
    employerName: string;
    position: string;
    companyName: string;
    address: string;
    status: string;
    employeeSocialSecurityRates: number[];
    employerSocialSecurityRates: number[];
}

export interface EmployeeI {
    data2: number;
    data1: number;
    employeeId: string;
    companyId: string;
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

export interface EmployeePaymentI {
    paymentId: string;
    employeeId: string;
    year: number;
    month: number;
    data1: number;
    data2: number;
    data3: number;
    data4: number;
    data5: number;
    data6: number;
    data7: number;
    data8: number;
    data9: number;
    data10: number;
    data11: number;
    data12: number;
}

export interface CompanyPaymentI {
    paymentId: string;
    companyId: string;
    year: number;
    data1: number;
    data2: number;
    data3: number;
    data4: number;
    data5: number;
    data6: number;
    data7: number;
    data8: number;
    data9: number;
    data10: number;
    data11: number;
    data12: number;
}