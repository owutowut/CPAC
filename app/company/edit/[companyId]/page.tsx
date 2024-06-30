"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'

import { db } from '@/libs/firebase';
import { ref, set, onValue } from "firebase/database";
import { useRouter, useParams } from 'next/navigation'
import { CompanyI } from '@/interfaces/company'
import { initialCompany } from '@/utils/initial'

export default function EditCompany() {
  const [companyData, setCompanyData] = useState<CompanyI>(initialCompany);

  const router = useRouter();
  const { companyId } = useParams();
  const companyDataById = ref(db, 'company/' + companyId);

  useEffect(() => {
    companyId &&
      onValue(companyDataById, (snapshot) => {
        const data = snapshot.val();
        data && setCompanyData(data);
      });
  }, [companyId])

  const [allRatesEmployee, setAllRatesEmployee] = useState<any>(0);
  const [allRatesEmployer, setAllRatesEmployer] = useState<any>(0);

  const onSetAllEmployeeRates = () => {
    const newRates = parseFloat(allRatesEmployee)
    const employeeRates = Array.from({ length: 12 }, () => newRates);
    setCompanyData(companyData => ({
      ...companyData,
      employeeSocialSecurityRates: employeeRates
    }));
  }

  const onSetAllEmployerRates = () => {
    const newRates = parseFloat(allRatesEmployer)
    const employerRates = Array.from({ length: 12 }, () => newRates);
    setCompanyData(companyData => ({
      ...companyData,
      employerSocialSecurityRates: employerRates
    }));
  }

  const handleEmployeeRatesChange = (index: any, value: any) => {
    const newRates = [...companyData.employeeSocialSecurityRates];
    newRates[index] = value;
    setCompanyData(data => ({
      ...data,
      employeeSocialSecurityRates: newRates
    }));
  };

  const handleEmployerRatesChange = (index: any, value: any) => {
    const newRates = [...companyData.employerSocialSecurityRates];
    newRates[index] = value;
    setCompanyData(data => ({
      ...data,
      employerSocialSecurityRates: newRates
    }));
  };

  const onEditCompany = async (e: any) => {
    e.preventDefault();
    try {
      set(ref(db, 'company/' + companyId), {
        taxNumber: companyData.taxNumber,
        employerNumber: companyData.employerNumber,
        branchNumber: companyData.employerNumber,
        employerName: companyData.employerName,
        position: companyData.position,
        companyName: companyData.companyName,
        address: companyData.address,
        status: companyData.status,
        employeeSocialSecurityRates: companyData.employeeSocialSecurityRates,
        employerSocialSecurityRates: companyData.employerSocialSecurityRates,
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
    <form onSubmit={onEditCompany} className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <FaBuilding className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>แก้ไขข้อมูลสถานประกอบการ</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Link href={'/'} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
          <button type='submit' className='flex justify-center items-center space-x-2 p-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>บันทึกข้อมูล</span>
          </button>
        </div>
      </div>
      <div className='flex space-x-6'>
        <div className='w-[65%] h-full bg-white rounded-xl text-slate-900 p-4 space-y-4'>
          <div className='space-y-2'>
            <p>เลขประจำตัวผู้เสียภาษี(13 หลัก)*</p>
            <input value={companyData['taxNumber']} onChange={(e) => handleCompanyDataChange('taxNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>เลขที่บัญชีนายจ้าง</p>
            <input value={companyData['employerNumber']} onChange={(e) => handleCompanyDataChange('employerNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ลำดับที่สาขา</p>
            <input value={companyData['branchNumber']} onChange={(e) => handleCompanyDataChange('branchNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ชื่อนายจ้าง</p>
            <input value={companyData['employerName']} onChange={(e) => handleCompanyDataChange('employerName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ตำแหน่ง</p>
            <input value={companyData['position']} onChange={(e) => handleCompanyDataChange('position', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ชื่อบริษัท</p>
            <input value={companyData['companyName']} onChange={(e) => handleCompanyDataChange('companyName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ที่อยู่</p>
            <textarea value={companyData['address']} onChange={(e) => handleCompanyDataChange('address', e.target.value)} required rows={6} className='w-full bg-slate-900 rounded-xl text-white p-2'></textarea>
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
                      value={companyData['employeeSocialSecurityRates'][index]}
                      onChange={(e) => handleEmployeeRatesChange(index, e.target.value)}
                      required
                      className='text-center w-full h-full bg-slate-900 rounded-lg text-white p-2'
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={companyData['employerSocialSecurityRates'][index]}
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
            <input value={allRatesEmployee} type="number" onChange={(e) => setAllRatesEmployee(e.target.value)} required className='w-full h-full bg-slate-900 rounded-lg text-white p-2'></input>
            <span onClick={onSetAllEmployeeRates} className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              แทนที่
            </span>
            <input value={allRatesEmployer} type="number" onChange={(e) => setAllRatesEmployer(e.target.value)} required className='w-full h-full bg-slate-900 rounded-lg text-white p-2'></input>
            <span onClick={onSetAllEmployerRates} className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              แทนที่
            </span>
          </div>
        </div>
      </div>
    </form >
  )
}
