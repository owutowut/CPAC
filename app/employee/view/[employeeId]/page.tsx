"use client"

import EmployeePaymentTable from '@/components/table/employeePaymentTable'
import { EmployeeI } from '@/interfaces/company'
import { db } from '@/libs/firebase'
import { initialEmployee } from '@/utils/initial'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { BiSolidFileExport } from 'react-icons/bi'

import { IoCaretBack } from 'react-icons/io5'
import { RiAccountPinBoxFill } from 'react-icons/ri'

import { useReactToPrint } from 'react-to-print';

export default function ViewEmployee() {
  const [loading, setLoading] = useState<boolean>(true);
  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);
  const [isPrintContent, setIsPrintContent] = useState<boolean>(false);

  const { employeeId } = useParams();
  const refByID = doc(db, `employee/${employeeId}`);

  const fetchEmployeeByID = async () => {
    setLoading(true)
    const snapshot = await getDoc(refByID);
    if (snapshot.exists()) {
      const data = {
        companyId: snapshot.id,
        ...snapshot.data()
      } as EmployeeI;
      setEmployeeData(data);
    } else {
      setEmployeeData(initialEmployee)
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchEmployeeByID();
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl drop-shadow-xl p-[2rem] xl:mx-[4rem] xl:my-[2rem] md:mx-[2rem] md:my-[2rem] mx-[1rem] my-[1rem]">
      <div className='space-y-[2rem]'>
        <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
          <div className='flex items-center lg:space-x-4 space-x-2'>
            <RiAccountPinBoxFill className='lg:w-10 lg:h-10 w-8 h-8 text-white' />
            <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold text-white'>ข้อมูลพนักงาน</h2>
          </div>
          <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
            <Link href={`/company/view/${employeeData.companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
              <IoCaretBack className='w-6 h-6' />
              <span>ย้อนกลับ</span>
            </Link>
            <button onClick={() => setIsPrintContent(true)} className="xl:w-fit w-full flex justify-center items-center space-x-2 px-4 py-2 bg-yellow-600 text-white hover:bg-white hover:text-yellow-600 rounded-xl hover:scale-105 duration-300">
              <BiSolidFileExport className='w-6 h-6' />
              <span>Export</span>
            </button>
          </div>
        </div>
        {!loading ?
          <div className='space-y-[2rem]'>
            <div className='bg-white rounded-lg text-black p-6 space-y-2'>
              <p><mark className='bg-transparent font-semibold'> ชื่อ-สกุล พนักงาน : </mark> {employeeData.titleName} {employeeData.firstName} {employeeData.lastName}</p>
              <p><mark className='bg-transparent font-semibold'> เลขประจำตัวประชาชน : </mark> {employeeData.IDcardNumber}</p>
            </div>
            <EmployeePaymentTable isPrintContent={isPrintContent} setIsPrintContent={setIsPrintContent} employeeId={employeeId} />
          </div>
          :
          <div className='h-full w-full flex justify-center items-center'>
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        }
      </div>
    </div>
  )
}
