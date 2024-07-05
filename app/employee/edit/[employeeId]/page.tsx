"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { Alert } from 'antd'

import { db } from '@/libs/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { EmployeeI } from '@/interfaces/company'
import { initialAlertError, initialAlertInfo, initialEmployee } from '@/utils/initial'

import { IoCaretBack } from 'react-icons/io5'
import { AiFillEdit } from 'react-icons/ai'
import { RiAccountPinBoxFill } from 'react-icons/ri'

export default function EditEmployee() {
  const [loading, setLoading] = useState<boolean>(true);
  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertInfo);

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

  const onEditCompany = async (e: any) => {
    e.preventDefault();
    try {
      updateDoc(refByID, {
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
      setAlert(initialAlertInfo);
      setShowAlert(true)
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
    <form onSubmit={onEditCompany} className='space-y-[2rem]'>
      <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
        <div className='flex items-center lg:space-x-4 space-x-2'>
          <RiAccountPinBoxFill className='lg:w-10 lg:h-10 w-8 h-8 text-white' />
          <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold text-white'>แก้ไขข้อมูลพนักงาน</h2>
        </div>
        <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
          {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
          <Link href={`/company/view/${employeeData.companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
          <button type='submit' className='xl:w-fit w-full flex justify-center items-center space-x-2 p-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-xl hover:scale-105 duration-300'>
            <AiFillEdit className='w-6 h-6' />
            <span>บันทึกข้อมูล</span>
          </button>
        </div>
      </div>
      {!loading ?
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
        :
        <div className='h-full w-full flex justify-center items-center'>
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }
    </form >
  )
}
