"use client"

import React from 'react';
import { Table, Input } from 'antd';
import type { TableProps } from 'antd';
import { FaBuilding } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { AlignType } from 'rc-table/lib/interface'
import Link from 'next/link';

interface DataType {
  taxNumber: string;
  employerNumber: string;
  branchNumber: string;
  employerName: string;
  position: string;
  companyName: string;
  address: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'เลขประจำตัวผู้เสียภาษี(13 หลัก)*',
    dataIndex: 'taxNumber',
    key: 'taxNumber',
    sorter: (a, b) => a.taxNumber.localeCompare(b.taxNumber)
  },
  {
    title: 'เลขที่บัญชีนายจ้าง',
    dataIndex: 'employerNumber',
    key: 'employerNumber',
    sorter: (a, b) => a.employerNumber.localeCompare(b.employerNumber)
  },
  {
    title: 'ลำดับที่สาขา',
    dataIndex: 'branchNumber',
    key: 'branchNumber',
    sorter: (a, b) => a.branchNumber.localeCompare(b.branchNumber)
  },
  {
    title: 'ชื่อนายจ้าง',
    dataIndex: 'employerName',
    key: 'employerName',
    sorter: (a, b) => a.employerName.localeCompare(b.employerName)
  },
  {
    title: 'ตำแหน่ง',
    dataIndex: 'position',
    key: 'position',
    sorter: (a, b) => a.position.localeCompare(b.position)
  },
  {
    title: 'ชื่อบริษัท',
    dataIndex: 'companyName',
    key: 'companyName',
    sorter: (a, b) => a.companyName.localeCompare(b.companyName)
  },
  {
    title: 'ที่อยู่',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.address.localeCompare(b.address)
  },
  {
    title: 'Action',
    dataIndex: 'taxNumber',
    key: 'taxNumber',
    render: (e) => (<div className='flex justify-center items-center'><Link href={'/company/' + e}><FaEdit className='w-8 h-8 hover:scale-105 duration-300 hover:text-blue-800' /></Link></div>)
  },
];

const data: DataType[] = [
  {
    taxNumber: '0633563000047',
    employerNumber: '6320000627',
    branchNumber: '00000',
    employerName: 'นายพิศาล จินดาทอง',
    position: 'กรรมการผู้จัดการ',
    companyName: 'ห้างหุ้นส่วนจำกัด รถมือสองแม่สอด ดีที่สุด',
    address: '381 หมู่ที่ 2 ตำบลแม่กุ อำเภอแม่สอด จังหวัดตาก 63110',
  },
];

export default function CompanyTable() {
  return (
    <div className='space-y-[2rem]'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <FaBuilding className='w-10 h-10' />
          <h2 className='font-bold text-[1.8rem]'>ข้อมูลสถานประกอบการ</h2>
        </div>
        <div className='flex items-center space-x-6 w-1/3'>
          <Input className='h-[2.6rem] w-full rounded-xl hover:scale-105 duration-300' placeholder="ค้นหาชื่อสถานประกอบการ..." allowClear />
          <Link href={'/company/add'} className='flex justify-center items-center space-x-2 h-[2.6rem] w-[10rem] bg-slate-600 text-white hover:bg-white hover:text-slate-600 rounded-xl hover:scale-105 duration-300'>
            <IoIosAddCircle className='w-6 h-6' />
            <span>เพิ่มข้อมูล</span>
          </Link>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
