"use client"

import Link from 'next/link'
import React, { useState } from 'react'

import { Alert } from 'antd'

import { db } from '@/libs/firebase';
import { addDoc, collection } from 'firebase/firestore'

import { CompanyI } from '@/interfaces/company'
import { initialAlertError, initialAlertSuccess, initialCompany } from '@/utils/initial'

import { FaBuilding } from 'react-icons/fa6'
import { IoIosAddCircle } from 'react-icons/io'
import { IoCaretBack } from 'react-icons/io5'

export default function CreateCompany() {
  const [companyData, setCompanyData] = useState<CompanyI>(initialCompany);
  const [employeeSocialSecurityRates, setEmployeeSocialSecurityRates] = useState<number[]>(Array(12).fill(0));
  const [employerSocialSecurityRates, setEmployerSocialSecurityRates] = useState<number[]>(Array(12).fill(0));
  const [allRatesEmployee, setAllRatesEmployee] = useState<number>(0);
  const [allRatesEmployer, setAllRatesEmployer] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertSuccess);

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

  const clearInput = () => {
    setCompanyData(initialCompany)
    setEmployeeSocialSecurityRates(Array(12).fill(0))
    setEmployerSocialSecurityRates(Array(12).fill(0))
    setAllRatesEmployee(0)
    setAllRatesEmployer(0)
  }

  const onCreateCompany = async (e: any) => {
    e.preventDefault();
    try {
      const ref = collection(db, 'company');
      await addDoc(ref, {
        taxNumber: companyData.taxNumber,
        employerNumber: companyData.employerNumber,
        branchNumber: companyData.branchNumber,
        employerName: companyData.employerName,
        position: companyData.position,
        companyName: companyData.companyName,
        address: companyData.address,
        status: companyData.status,
        employeeSocialSecurityRates: employeeSocialSecurityRates,
        employerSocialSecurityRates: employerSocialSecurityRates,
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
      <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
        <div className='flex items-center lg:space-x-4 space-x-2'>
          <FaBuilding className='lg:w-10 lg:h-10 w-8 h-8' />
          <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold'>เพิ่มข้อมูลสถานประกอบการ</h2>
        </div>
        <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
          {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
          <Link href={'/'} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoCaretBack className='w-6 h-6' />
            <span>ย้อนกลับ</span>
          </Link>
          <button type='submit' className='xl:w-fit w-full flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>เพิ่มข้อมูล</span>
          </button>
        </div>
      </div>
      <div className='xl:flex xl:space-x-4 xl:space-y-0 space-y-4'>
        <div className='xl:w-[60%] h-full bg-white rounded-xl text-slate-900 p-4 space-y-4'>
          <div className='space-y-2'>
            <p>เลขประจำตัวผู้เสียภาษี(13 หลัก)*</p>
            <input type='number' value={companyData.taxNumber} onChange={(e) => handleCompanyDataChange('taxNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>เลขที่บัญชีนายจ้าง</p>
            <input type='number' value={companyData.employerNumber} onChange={(e) => handleCompanyDataChange('employerNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ลำดับที่สาขา</p>
            <input type='number' value={companyData.branchNumber} onChange={(e) => handleCompanyDataChange('branchNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ชื่อนายจ้าง</p>
            <input value={companyData.employerName} onChange={(e) => handleCompanyDataChange('employerName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ตำแหน่ง</p>
            <input value={companyData.position} onChange={(e) => handleCompanyDataChange('position', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ชื่อบริษัท</p>
            <input value={companyData.companyName} onChange={(e) => handleCompanyDataChange('companyName', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
          </div>
          <div className='space-y-2'>
            <p>ที่อยู่</p>
            <textarea value={companyData.address} onChange={(e) => handleCompanyDataChange('address', e.target.value)} required rows={6} className='w-full bg-slate-900 rounded-xl text-white p-2'></textarea>
          </div>
        </div>
        <div className='xl:w-[40%] h-full bg-white rounded-xl text-slate-900 overflow-auto'>
          <table id='customTable'>
            <thead>
              <tr>
                <th>อัตราประกันสังคม</th>
                <th>ลูกจ้าง ( % )</th>
                <th>นายจ้าง ( % )</th>
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
          <div className='xl:flex xl:space-x-4 xl:space-y-0 p-4 space-y-4'>
            <span className='xl:justify-start justify-center flex font-semibold whitespace-nowrap'>กรอกทั้งหมด</span>
            <input value={allRatesEmployee} type="number" onChange={(e) => setAllRatesEmployee(parseFloat(e.target.value))} required className='text-center w-full h-full bg-slate-900 rounded-lg text-white p-2'></input>
            <span onClick={onSetAllEmployeeRates} className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              ตกลง
            </span>
            <input value={allRatesEmployer} type="number" onChange={(e) => setAllRatesEmployer(parseFloat(e.target.value))} required className='text-center w-full h-full bg-slate-900 rounded-lg text-white p-2'></input>
            <span onClick={onSetAllEmployerRates} className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              ตกลง
            </span>
          </div>
        </div>
      </div>
    </form >
  )
}
