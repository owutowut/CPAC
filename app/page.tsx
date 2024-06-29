"use client"

import Link from 'next/link';

import CompanyTable from "@/components/table/companyTable";

import { Input } from 'antd';

import { FaBuilding } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";

export default function Home() {
  return (
    <div className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <FaBuilding className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>ข้อมูลสถานประกอบการ</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Input className='w-[30rem] h-[2.6rem] rounded-xl hover:scale-105 duration-300' placeholder="ค้นหาชื่อสถานประกอบการ..." allowClear />
          <Link href={'/company/add'} className='h-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>เพิ่มข้อมูล</span>
          </Link>
        </div>
      </div>
      <CompanyTable />
    </div>
  );
}
