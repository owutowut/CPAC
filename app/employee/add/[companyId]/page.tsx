"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'

import { db } from '@/libs/firebase';
import { ref, push } from "firebase/database";
import { useRouter, useParams } from 'next/navigation'
import { EmployeeI } from '@/interfaces/company'
import { initialEmployee } from '@/utils/initial'
import { RiAccountPinBoxFill } from 'react-icons/ri'

export default function CreateEmployee() {
  const router = useRouter()
  const { companyId } = useParams();
  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);

  const onCreateCompany = async (e: any) => {
    e.preventDefault();
    try {
      push(ref(db, `employee/`), {
        companyId: companyId,
        IDcardNumber: employeeData.IDcardNumber,
        titleName: employeeData.titleName,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        address: employeeData.address,
        position: employeeData.position,
        workStartDate: employeeData.workStartDate,
        resignationDate: employeeData.resignationDate,
        status: employeeData.status,
      });
      router.push(`/company/view/${companyId}`)
    } catch (error) {
      console.error(error);
    }
  }

  const handleEmployeeDataChange = (key: string, value: string) => {
    setEmployeeData({
      ...employeeData,
      [key]: value
    });
  };

  return (
    <form onSubmit={onCreateCompany} className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <RiAccountPinBoxFill className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>เพิ่มข้อมูลพนักงาน</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Link href={`/company/view/${companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
          <button type='submit' className='flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>เพิ่มข้อมูล</span>
          </button>
        </div>
      </div>
      <div className='flex space-x-6'>
        <div className='w-full h-full bg-white rounded-xl text-slate-900 p-4 grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <p>เลขบัตรประชาชน</p>
              <input onChange={(e) => handleEmployeeDataChange('IDcardNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>คำนำหน้านาม</p>
              <input onChange={(e) => handleEmployeeDataChange('titleName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>ชื่อ</p>
              <input onChange={(e) => handleEmployeeDataChange('firstName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>สกุล</p>
              <input onChange={(e) => handleEmployeeDataChange('lastName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>ที่อยู่ตามบัตรประชาชนหรือที่อยู่ที่ติดต่อได้</p>
              <textarea onChange={(e) => handleEmployeeDataChange('address', e.target.value)} required rows={6} className='w-full bg-slate-900 rounded-xl text-white p-2'></textarea>
            </div>
          </div>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <p>ตำแหน่งงาน</p>
              <input onChange={(e) => handleEmployeeDataChange('position', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>วันที่เริ่มงาน</p>
              <input onChange={(e) => handleEmployeeDataChange('workStartDate', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>วันที่ลาออก</p>
              <input onChange={(e) => handleEmployeeDataChange('resignationDate', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
          </div>
        </div>
      </div>
    </form >
  )
}
