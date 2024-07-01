"use client"

import { EmployeeI } from '@/interfaces/company'
import { db } from '@/libs/firebase'
import { initialEmployee } from '@/utils/initial'
import { onValue, ref } from 'firebase/database'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { IoCaretBack } from 'react-icons/io5'
import { RiAccountPinBoxFill } from 'react-icons/ri'

export default function ViewEmployee() {
  const router = useRouter()
  const { employeeId } = useParams();

  const employeeDataById = ref(db, `employee/${employeeId}`);

  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true)
    if (employeeId) {
      onValue(employeeDataById, (snapshot) => {
        const data = snapshot.val();
        data && setEmployeeData(data);
      });
    }
    setLoading(false)
  }, [])

  return (
    <div className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <RiAccountPinBoxFill className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>ข้อมูลพนักงาน</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Link href={`/company/view/${employeeData.companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
        </div>
      </div>
      {!loading ?
        <div>
          <div className='bg-white rounded-lg text-black p-6 space-y-2'>
            <p><mark className='bg-transparent font-semibold'> ชื่อ-สกุล พนักงาน : </mark> {employeeData.titleName} {employeeData.firstName} {employeeData.lastName}</p>
            <p><mark className='bg-transparent font-semibold'> เลขประจำตัวประชาชน : </mark> {employeeData.IDcardNumber}</p>
          </div>
        </div>
        :
        <></>
      }
    </div>
  )
}
