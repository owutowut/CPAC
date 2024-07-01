"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import EmployeeTable from '@/components/table/employeeTable'

import { Input, Select } from 'antd'

import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'
import { useParams, useRouter } from 'next/navigation'
import { onValue, ref } from 'firebase/database'
import { CompanyI } from '@/interfaces/company'
import { db } from '@/libs/firebase';
import { RiAccountPinBoxFill } from 'react-icons/ri'
import { FaEdit } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'

export default function ViewCompany() {
  const [loading, setLoading] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<CompanyI>();

  const { companyId } = useParams();
  const companyDataById = ref(db, 'company/' + companyId);

  useEffect(() => {
    setLoading(true)
    if (companyId) {
      onValue(companyDataById, (snapshot) => {
        const data = snapshot.val();
        data && setCompanyData(data);
      });
    }
    setLoading(false)
  }, [companyId])

  const [searchEmployee, setSearchEmployee] = useState<string>('')

  const { Option } = Select;

  const months = [
    { value: '1', label: 'มกราคม' },
    { value: '2', label: 'กุมภาพันธ์' },
    { value: '3', label: 'มีนาคม' },
    { value: '4', label: 'เมษายน' },
    { value: '5', label: 'พฤษภาคม' },
    { value: '6', label: 'มิถุนายน' },
    { value: '7', label: 'กรกฎาคม' },
    { value: '8', label: 'สิงหาคม' },
    { value: '9', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(year => year + 543);

  return (
    <>
      <div className='space-y-[2rem]'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <FaBuilding className='w-10 h-10' />
            <h2 className='font-bold text-[1.8rem]'>ข้อมูลสถานประกอบการ</h2>
          </div>
          <Link href={'/'} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
        </div>
        {!loading ?
          <>
            <div className='bg-white rounded-lg text-black p-6 grid grid-cols-3 gap-4'>
              <p><mark className='bg-transparent font-semibold'> ชื่อบริษัท : </mark> {companyData && companyData.companyName} </p>
              <p><mark className='bg-transparent font-semibold'> เลขประจำตัวผู้เสียภาษี(13 หลัก)* : </mark> {companyData && companyData.taxNumber} </p>
              <p><mark className='bg-transparent font-semibold'> ลำดับที่สาขา : </mark> {companyData && companyData.branchNumber} </p>
              <p><mark className='bg-transparent font-semibold'> เลขที่บัญชีนายจ้าง : </mark> {companyData && companyData.employerNumber} </p>
              <p><mark className='bg-transparent font-semibold'> ชื่อนายจ้าง : </mark> {companyData && companyData.employerName} </p>
              <p><mark className='bg-transparent font-semibold'> ตำแหน่ง : </mark> {companyData && companyData.position} </p>
              <p><mark className='bg-transparent font-semibold'> ที่อยู่ </mark> {companyData && companyData.address} </p>
            </div>
            <div className='space-y-[2rem]'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <RiAccountPinBoxFill className='w-10 h-10' />
                  <h2 className='font-bold text-[1.8rem]'>ข้อมูลพนักงาน</h2>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input onChange={(e) => setSearchEmployee(e.target.value)} className='text-[1rem] w-[30rem] h-[2.6rem] rounded-xl' placeholder="ค้นหาพนักงานด้วยเลขบัตรประชาชน..." allowClear />
                  <Link href={`/employee/add/${companyId}`} className='flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
                    <IoIosAddCircle className='w-6 h-6' />
                    <span>เพิ่มข้อมูล</span>
                  </Link>
                </div>
              </div>
              <EmployeeTable searchEmployee={searchEmployee} companyId={companyId} />
            </div>
            <div className='space-y-[2rem]'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <RiAccountPinBoxFill className='w-10 h-10' />
                  <h2 className='font-bold text-[1.8rem]'>เงินเดือน ค่าจ้าง ค่าคอม ประจำเดือน</h2>
                </div>
                <div className='flex items-center space-x-4'>
                  <Select placement='bottomLeft' placeholder="เลือกเดือน..." style={{ width: 120 }}>
                    {months.map(month => (
                      <Option key={month.value} value={month.value}>
                        {month.label}
                      </Option>
                    ))}
                  </Select>
                  <Select placement='bottomLeft' placeholder="เลือกปี..." style={{ width: 120 }}>
                    {years.map(year => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <EmployeeTable searchEmployee={searchEmployee} companyId={companyId} />
            </div>
          </>
          :
          <></>
        }
      </div>
    </>
  )
}
