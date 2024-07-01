"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'

import { db } from '@/libs/firebase';
import { onValue, ref, set } from "firebase/database";
import { useRouter, useParams } from 'next/navigation'
import { EmployeeI } from '@/interfaces/company'
import { initialEmployee } from '@/utils/initial'
import { AiFillEdit } from 'react-icons/ai'
import { RiAccountPinBoxFill } from 'react-icons/ri'

export default function EditEmployee() {
  const router = useRouter()
  const { employeeId } = useParams();

  const employeeDataById = ref(db, `employee/${employeeId}`);

  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (employeeId) {
      setLoading(true)
      onValue(employeeDataById, (snapshot) => {
        const data = snapshot.val();
        data && setEmployeeData(data);
      });
      setLoading(false)
    }
  }, [employeeId])

  const onEditCompany = async (e: any) => {
    e.preventDefault();
    try {
      set(ref(db, `employee/${employeeId}`), {
        companyId: employeeData.companyId,
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
      router.push(`/company/view/${employeeData.companyId}`)
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
    <form onSubmit={onEditCompany} className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <RiAccountPinBoxFill className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>แก้ไขข้อมูลพนักงาน</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Link href={`/company/view/${employeeData.companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
          <button type='submit' className='flex justify-center items-center space-x-2 p-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-xl hover:scale-105 duration-300'>
            <AiFillEdit className='w-6 h-6' />
            <span>บันทึกข้อมูล</span>
          </button>
        </div>
      </div>
      {!loading ?
        <div className='flex space-x-6'>
          <div className='w-full h-full bg-white rounded-xl text-slate-900 p-4 grid grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <p>เลขบัตรประชาชน</p>
                <input value={employeeData.IDcardNumber} onChange={(e) => handleEmployeeDataChange('IDcardNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
              <div className='space-y-2'>
                <p>คำนำหน้านาม</p>
                <input value={employeeData.titleName} onChange={(e) => handleEmployeeDataChange('titleName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
              <div className='space-y-2'>
                <p>ชื่อ</p>
                <input value={employeeData.firstName} onChange={(e) => handleEmployeeDataChange('firstName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
              <div className='space-y-2'>
                <p>สกุล</p>
                <input value={employeeData.lastName} onChange={(e) => handleEmployeeDataChange('lastName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
              <div className='space-y-2'>
                <p>ที่อยู่ตามบัตรประชาชนหรือที่อยู่ที่ติดต่อได้</p>
                <textarea value={employeeData.address} onChange={(e) => handleEmployeeDataChange('address', e.target.value)} required rows={6} className='w-full bg-slate-900 rounded-xl text-white p-2'></textarea>
              </div>
            </div>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <p>ตำแหน่งงาน</p>
                <input value={employeeData.position} onChange={(e) => handleEmployeeDataChange('position', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
              <div className='space-y-2'>
                <p>วันที่เริ่มงาน</p>
                <input value={employeeData.workStartDate} onChange={(e) => handleEmployeeDataChange('workStartDate', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
              <div className='space-y-2'>
                <p>วันที่ลาออก</p>
                <input value={employeeData.resignationDate} onChange={(e) => handleEmployeeDataChange('resignationDate', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
              </div>
            </div>
          </div>
        </div>
        :
        <></>
      }
    </form >
  )
}
