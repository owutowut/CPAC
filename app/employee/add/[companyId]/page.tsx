"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'

import { Alert } from 'antd';

import { db } from '@/libs/firebase';
import { EmployeeI } from '@/interfaces/company'

import { initialAlertError, initialAlertSuccess, initialEmployee } from '@/utils/initial'

import { RiAccountPinBoxFill } from 'react-icons/ri'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'
import { addDoc, collection } from 'firebase/firestore';

export default function CreateEmployee() {
  const { companyId } = useParams();

  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertSuccess);

  const clearInput = () => {
    setEmployeeData(initialEmployee)
  }

  const onCreateCompany = async (e: any) => {
    e.preventDefault();
    try {
      const ref = collection(db, 'employee');
      await addDoc(ref, {
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
      setAlert(initialAlertSuccess);
      setShowAlert(true)
      clearInput()
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      setAlert(initialAlertError);
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
      <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
        <div className='flex items-center lg:space-x-4 space-x-2'>
          <RiAccountPinBoxFill className='lg:w-10 lg:h-10 w-8 h-8 text-white' />
          <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold text-white'>เพิ่มข้อมูลพนักงาน</h2>
        </div>
        <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
          {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
          <Link href={`/company/view/${companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
          <button type='submit' className='xl:w-fit w-full flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>เพิ่มข้อมูล</span>
          </button>
        </div>
      </div>
      <div className='xl:grid-cols-2 grid-cols-1 w-full h-full bg-white rounded-xl text-slate-900 p-4 grid gap-4'>
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
            <input value={employeeData.resignationDate} onChange={(e) => handleEmployeeDataChange('resignationDate', e.target.value)} className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
        </div>
      </div>
    </form >
  )
}
