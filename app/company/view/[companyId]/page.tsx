"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import EmployeeTable from '@/components/table/employeeTable'

import { Input, Select } from 'antd'

import { db } from '@/libs/firebase';
import { doc, getDoc } from 'firebase/firestore'

import { initialCompany } from '@/utils/initial'
import { CompanyI } from '@/interfaces/company'

import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'
import { RiAccountPinBoxFill } from 'react-icons/ri'
import { BiSolidFileExport } from 'react-icons/bi'
import { useReactToPrint } from 'react-to-print'
import CompanyPaymentTable from '@/components/table/companyPaymentTable'

export default function ViewCompany() {
  const [loading, setLoading] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<CompanyI>();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() + 543);
  const [isPrintContent, setIsPrintContent] = useState<boolean>(false);

  const { companyId } = useParams();
  const refByID = doc(db, `company/${companyId}`);

  const fetchCompanyByID = async () => {
    setLoading(true)
    const snapshot = await getDoc(refByID);
    if (snapshot.exists()) {
      const data = {
        companyId: snapshot.id,
        ...snapshot.data()
      } as CompanyI;
      setCompanyData(data);
    } else {
      setCompanyData(initialCompany)
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchCompanyByID();
  }, []);

  const [searchEmployee, setSearchEmployee] = useState<string>('')
  const [searchCompanyPayment, setSearchCompanyPayment] = useState<string>('')

  const { Option } = Select;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(year => year + 543);

  return (
    <>
      <div className='space-y-[2rem]'>
        <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
          <div className='flex items-center lg:space-x-4 space-x-2'>
            <FaBuilding className='lg:w-10 lg:h-10 w-8 h-8' />
            <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold'>ข้อมูลสถานประกอบการ</h2>
          </div>
          <Link href={'/'} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
        </div>
        {!loading ?
          <>
            <div className='xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 bg-white rounded-lg text-black p-6 grid gap-4'>
              <p><mark className='bg-transparent font-bold mr-2'> ชื่อบริษัท : </mark> {companyData && companyData.companyName} </p>
              <p><mark className='bg-transparent font-bold mr-2'> เลขประจำตัวผู้เสียภาษี(13 หลัก)* : </mark> {companyData && companyData.taxNumber} </p>
              <p><mark className='bg-transparent font-bold mr-2'> ลำดับที่สาขา : </mark> {companyData && companyData.branchNumber} </p>
              <p><mark className='bg-transparent font-bold mr-2'> เลขที่บัญชีนายจ้าง : </mark> {companyData && companyData.employerNumber} </p>
              <p><mark className='bg-transparent font-bold mr-2'> ชื่อนายจ้าง : </mark> {companyData && companyData.employerName} </p>
              <p><mark className='bg-transparent font-bold mr-2'> ตำแหน่ง : </mark> {companyData && companyData.position} </p>
              <p><mark className='bg-transparent font-bold mr-2'> ที่อยู่ : </mark> {companyData && companyData.address} </p>
            </div>
            <div className='space-y-[2rem]'>
              <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
                <div className='flex items-center lg:space-x-4 space-x-2'>
                  <RiAccountPinBoxFill className='lg:w-10 lg:h-10 w-8 h-8' />
                  <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold'>ข้อมูลพนักงาน</h2>
                </div>
                <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
                  <Input onChange={(e) => setSearchEmployee(e.target.value)} className='xl:w-[30rem] text-[1rem] h-[2.6rem] rounded-xl' placeholder="ค้นหาพนักงานด้วยเลขบัตรประชาชน..." allowClear />
                  <Link href={`/employee/add/${companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
                    <IoIosAddCircle className='w-6 h-6' />
                    <span>เพิ่มข้อมูล</span>
                  </Link>
                </div>
              </div>
              <EmployeeTable searchEmployee={searchEmployee} companyId={companyId} />
            </div>
            <div className='space-y-[2rem]'>
              <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
                <div className='flex items-center lg:space-x-4 space-x-2'>
                  <FaBuilding className='lg:w-10 lg:h-10 w-8 h-8' />
                  <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold'>เงินเดือน ค่าจ้าง ค่าคอม ประจำเดือน</h2>
                </div>
                <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
                  <Input onChange={(e) => setSearchCompanyPayment(e.target.value)} className='xl:w-[30rem] text-[1rem] h-[2.6rem] rounded-xl' placeholder="ค้นหาพนักงานด้วยเลขบัตรประชาชน..." allowClear />
                  <Select className='xl:w-[8rem] w-full h-[2.4rem]' value={selectedYear} onChange={(e) => setSelectedYear(e)} placement='bottomLeft' placeholder="เลือกปี...">
                    {years.map(year => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                  <button onClick={() => setIsPrintContent(true)} className="xl:w-fit w-full flex justify-center items-center space-x-2 px-4 py-2 bg-yellow-600 text-white hover:bg-white hover:text-yellow-600 rounded-xl hover:scale-105 duration-300">
                    <BiSolidFileExport className='w-6 h-6' />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div>
                <CompanyPaymentTable companyName={companyData?.companyName} isPrintContent={isPrintContent} setIsPrintContent={setIsPrintContent} searchCompanyPayment={searchCompanyPayment} selectedYear={selectedYear} />
              </div>
            </div>
          </>
          :
          <div className='h-full w-full flex justify-center items-center'>
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        }
      </div>
    </>
  )
}
