"use client"

import Link from 'next/link';

import CompanyTable from "@/components/table/companyTable";

import { Input } from 'antd';

import { IoIosAddCircle } from "react-icons/io";
import { useState } from 'react';
import { ImBooks } from 'react-icons/im';

export default function Home() {
  const [searchCompany, setSearchCompany] = useState<string>('')

  return (
    <div className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <ImBooks className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>ระบบจัดการข้อมูลบัญชีบริษัท</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Input onChange={(e) => setSearchCompany(e.target.value)} className='text-[1rem] w-[30rem] h-[2.6rem] rounded-xl' placeholder="ค้นหาสถานประกอบการด้วยเลขประจำตัวผู้เสียภาษี..." allowClear />
          <Link href={'/company/add'} className='h-full flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>เพิ่มข้อมูล</span>
          </Link>
        </div>
      </div>
      <div>
        <CompanyTable searchCompany={searchCompany} />
      </div>
    </div>
  );
}
