"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { Alert } from 'antd'

import { db } from '@/libs/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { CompanyI } from '@/interfaces/company'
import { initialAlertError, initialAlertInfo, initialCompany } from '@/utils/initial'

import { IoCaretBack } from 'react-icons/io5'
import { AiFillEdit } from 'react-icons/ai'
import { RiAccountPinBoxFill } from 'react-icons/ri'

export default function EditEmployee() {
  const [loading, setLoading] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<CompanyI>(initialCompany);
  const [allRatesEmployee, setAllRatesEmployee] = useState<any>(0);
  const [allRatesEmployer, setAllRatesEmployer] = useState<any>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertInfo);

  const { companyId } = useParams();
  const refByID = doc(db, `company/${companyId}`);

  const fetchCompanyByID = async () => {
    setLoading(true)
    const snapshot = await getDoc(refByID);
    if (snapshot.exists()) {
      const data = {
        companyId: snapshot.id,
        ...snapshot.data()
      } as CompanyI;
      setCompanyData(data);
    } else {
      setCompanyData(initialCompany)
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchCompanyByID();
  }, []);

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
      await updateDoc(refByID, {
        taxNumber: companyData.taxNumber,
        employerNumber: companyData.employerNumber,
        branchNumber: companyData.branchNumber,
        employerName: companyData.employerName,
        position: companyData.position,
        companyName: companyData.companyName,
        address: companyData.address,
        status: companyData.status,
        employeeSocialSecurityRates: companyData.employeeSocialSecurityRates,
        employerSocialSecurityRates: companyData.employerSocialSecurityRates,
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
      <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
        <div className='flex items-center lg:space-x-4 space-x-2'>
          <RiAccountPinBoxFill className='lg:w-10 lg:h-10 w-8 h-8' />
          <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold text-white'>แก้ไขข้อมูลสถานประกอบการ</h2>
        </div>
        <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
          {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
          <Link href={'/'} className='flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
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
        <div className='xl:flex xl:space-x-4 xl:space-y-0 space-y-4'>
          <div className='xl:w-[60%] h-full bg-white rounded-xl text-slate-900 p-4 space-y-4'>
            <div className='space-y-2'>
              <p>เลขประจำตัวผู้เสียภาษี(13 หลัก)*</p>
              <input type='number' value={companyData['taxNumber']} onChange={(e) => handleCompanyDataChange('taxNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>เลขที่บัญชีนายจ้าง</p>
              <input type='number' value={companyData['employerNumber']} onChange={(e) => handleCompanyDataChange('employerNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
            </div>
            <div className='space-y-2'>
              <p>ลำดับที่สาขา</p>
              <input type='number' value={companyData['branchNumber']} onChange={(e) => handleCompanyDataChange('branchNumber', e.target.value)} required className='w-full bg-slate-900 rounded-lg text-white p-2'></input>
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
