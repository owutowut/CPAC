"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'

import { db } from '@/libs/firebase';
import { ref, push } from "firebase/database";
import { useRouter } from 'next/navigation'

export default function CreateCompany() {
  const [companyData, setCompanyData] = useState({
    taxNumber: '',
    employerNumber: '',
    branchNumber: '',
    employerName: '',
    position: '',
    companyName: '',
    address: '',
    status: 'active',
  });

  const [employeeSocialSecurityRates, setEmployeeSocialSecurityRates] = useState<number[]>(Array(12).fill(0));
  const [employerSocialSecurityRates, setEmployerSocialSecurityRates] = useState<number[]>(Array(12).fill(0));
  const [allRatesEmployee, setAllRatesEmployee] = useState<number>(0);
  const [allRatesEmployer, setAllRatesEmployer] = useState<number>(0);

  const onSetAllEmployeeRates = () => {
    const employeeRates = Array(12).fill(allRatesEmployee);
    setEmployeeSocialSecurityRates(employeeRates);
  }

  const onSetAllEmployerRates = () => {
    const employerRates = Array(12).fill(allRatesEmployer);
    setEmployerSocialSecurityRates(employerRates);
  }

  const handleEmployeeRatesChange = (index: any, value: any) => {
    const newRates = [...employeeSocialSecurityRates];
    newRates[index] = value;
    setEmployeeSocialSecurityRates(newRates);
  };

  const handleEmployerRatesChange = (index: any, value: any) => {
    const newRates = [...employerSocialSecurityRates];
    newRates[index] = value;
    setEmployerSocialSecurityRates(newRates);
  };

  const router = useRouter()

  const onCreateCompany = async (e: any) => {
    e.preventDefault();
    try {
      push(ref(db, 'company/'), {
        taxNumber: companyData.taxNumber,
        employerNumber: companyData.employerNumber,
        branchNumber: companyData.employerNumber,
        employerName: companyData.employerName,
        position: companyData.position,
        companyName: companyData.companyName,
        address: companyData.address,
        status: companyData.status,
        employeeSocialSecurityRates: employeeSocialSecurityRates,
        employerSocialSecurityRates: employerSocialSecurityRates,
      });
      router.push('/')
    } catch (error) {
      console.error(error);
    }
  }

  const handleCompanyDataChange = (key: string, value: string) => {
    setCompanyData({
      ...companyData,
      [key]: value
    });
  };

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  return (
    <form onSubmit={onCreateCompany} className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <FaBuilding className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>เพิ่มข้อมูลสถานประกอบการ</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Link href={'/'} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
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
        <div className='w-[65%] h-full bg-white rounded-xl text-slate-900 p-4 space-y-4'>
          <div className='space-y-2'>
            <p>เลขประจำตัวผู้เสียภาษี(13 หลัก)*</p>
            <input onChange={(e) => handleCompanyDataChange('taxNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>เลขที่บัญชีนายจ้าง</p>
            <input onChange={(e) => handleCompanyDataChange('employerNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ลำดับที่สาขา</p>
            <input onChange={(e) => handleCompanyDataChange('branchNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ชื่อนายจ้าง</p>
            <input onChange={(e) => handleCompanyDataChange('employerName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ตำแหน่ง</p>
            <input onChange={(e) => handleCompanyDataChange('position', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ชื่อบริษัท</p>
            <input onChange={(e) => handleCompanyDataChange('companyName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ที่อยู่</p>
            <textarea onChange={(e) => handleCompanyDataChange('address', e.target.value)} required rows={6} className='w-full bg-slate-900 rounded-xl text-white p-2'></textarea>
          </div>
        </div>
        <div className='w-[35%] h-full bg-white rounded-xl text-slate-900 overflow-hidden'>
          <table id='customTable'>
            <thead>
              <tr>
                <th>อัตราประกันสังคม</th>
                <th>ลูกจ้าง</th>
                <th>นายจ้าง</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month, index) => (
                <tr key={index}>
                  <td className='text-center'>{month}</td>
                  <td>
                    <input
                      type="number"
                      value={employeeSocialSecurityRates[index]}
                      onChange={(e) => handleEmployeeRatesChange(index, e.target.value)}
                      required
                      className='text-center w-full h-full bg-slate-900 rounded-lg text-white p-2'
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={employerSocialSecurityRates[index]}
                      onChange={(e) => handleEmployerRatesChange(index, e.target.value)}
                      required
                      className='text-center w-full h-full bg-slate-900 rounded-lg text-white p-2'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex space-x-4 p-4'>
            <span className='font-semibold whitespace-nowrap'>กรอกทั้งหมด ( % )</span>
            <input value={allRatesEmployee} type="number" onChange={(e) => setAllRatesEmployee(parseFloat(e.target.value))} required className='w-full h-full bg-slate-900 rounded-lg text-white p-2'></input>
            <span onClick={onSetAllEmployeeRates} className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              แทนที่
            </span>
            <input value={allRatesEmployer} type="number" onChange={(e) => setAllRatesEmployer(parseFloat(e.target.value))} required className='w-full h-full bg-slate-900 rounded-lg text-white p-2'></input>
            <span onClick={onSetAllEmployerRates} className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              แทนที่
            </span>
          </div>
        </div>
      </div>
    </form >
  )
}
