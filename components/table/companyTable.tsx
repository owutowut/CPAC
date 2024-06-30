"use client"

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

import Link from 'next/link';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { db } from '@/libs/firebase';
import { onValue, ref, update } from 'firebase/database';

import { Popconfirm } from 'antd';
import { FaEye } from 'react-icons/fa6';
import { CompanyI } from '@/interfaces/company';

export default function CompanyTable() {
  const [companyData, setCompanyData] = useState<CompanyI[]>([]);

  const allCompanyData = ref(db, 'company');

  useEffect(() => {
    onValue(allCompanyData, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const companyArray = Object.keys(data).map(companyId => ({
          companyId,
          ...data[companyId]
        }));
        setCompanyData(companyArray.filter((data) => data.status !== 'archived'));
      } else {
        setCompanyData([]);
      }
    });
  }, [])

  const confirm = (companyId: string) => {
    update(ref(db, 'company/' + companyId), {
      status: 'archived',
    });
  };

  const columns: TableProps<CompanyI>['columns'] = [
    {
      title: 'เลขประจำตัวผู้เสียภาษี(13 หลัก)*',
      dataIndex: 'taxNumber',
      key: 'taxNumber',
      sorter: (a, b) => a.taxNumber.localeCompare(b.taxNumber),
      width: 180,
      render: (taxNumber) => (
        <div className='w-[160px]'>
          {taxNumber}
        </div>
      ),
    },
    {
      title: 'เลขที่บัญชีนายจ้าง',
      dataIndex: 'employerNumber',
      key: 'employerNumber',
      sorter: (a, b) => a.employerNumber.localeCompare(b.employerNumber),
      width: 180,
      render: (employerNumber) => (
        <div className='w-[160px]'>
          {employerNumber}
        </div>
      ),
    },
    {
      title: 'ลำดับที่สาขา',
      dataIndex: 'branchNumber',
      key: 'branchNumber',
      sorter: (a, b) => a.branchNumber.localeCompare(b.branchNumber),
      width: 120,
      render: (branchNumber) => (
        <div className='w-[100px]'>
          {branchNumber}
        </div>
      ),
    },
    {
      title: 'ชื่อนายจ้าง',
      dataIndex: 'employerName',
      key: 'employerName',
      sorter: (a, b) => a.employerName.localeCompare(b.employerName),
      width: 260,
      render: (employerName) => (
        <div className='w-[240px]'>
          {employerName}
        </div>
      ),
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
      width: 180,
      render: (employerName) => (
        <div className='w-[160px]'>
          {employerName}
        </div>
      ),
    },
    {
      title: 'ชื่อบริษัท',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      width: 260,
      render: (address) => (
        <div className='w-[240px]'>
          {address}
        </div>
      ),
    },
    {
      title: 'ที่อยู่',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
      width: 240,
      render: (address) => (
        <div className='w-[220px]'>
          {address}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'companyId',
      key: 'companyId',
      render: (e) => (
        <div className='flex justify-center items-center space-x-3'>
          <Link href={'/company/view/' + e} className='cursor-default'>
            <FaEye className='w-7 h-7 hover:scale-110 duration-300 text-slate-600' />
          </Link>
          <Link href={'/company/edit/' + e} className='cursor-default'>
            <MdEditSquare className='w-7 h-7 hover:scale-110 duration-300 text-blue-600' />
          </Link>
          <Popconfirm
            title="ยืนยันการลบข้อมูล"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            description="ข้อมูลของคุณจะถูกลบออกจากระบบ กรุณาตรวจสอบข้อมูลอีกครั้ง"
            okText="ยืนยัน"
            cancelText="ยกเลิก"
            onConfirm={() => confirm(e)}
            placement="left"
          >
            <MdDelete className='w-7 h-7 hover:scale-110 duration-300 text-red-600' />
          </Popconfirm >
        </div>)
    },
  ];

  return (
    <Table columns={columns} dataSource={companyData} />
  )
}
