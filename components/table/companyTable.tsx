"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Table } from 'antd';
import type { TableProps } from 'antd';
import { Popconfirm } from 'antd';

import { db } from '@/libs/firebase';
import { collection, getDocs, where, query, doc, updateDoc, onSnapshot } from 'firebase/firestore';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa6';
import { MdDelete, MdEditSquare } from 'react-icons/md';

import { CompanyI } from '@/interfaces/company';
import { initialCompany } from '@/utils/initial';

export default function CompanyTable(props: any) {
  const { searchCompany } = props

  const [loading, setLoading] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<CompanyI[]>([initialCompany]);

  const allCompanyData = query(collection(db, 'company'), where('status', '!=', 'archived'));

  const fetchAllCompanyData = async () => {
    onSnapshot(allCompanyData, (snapshot) => {
      setLoading(true);
      const data = snapshot.docs.map(doc => ({
        companyId: doc.id,
        ...doc.data()
      })) as CompanyI[];
      if (searchCompany) {
        const filteredData = data.filter(company => company.taxNumber.includes(searchCompany));
        setCompanyData(filteredData);
      } else {
        setCompanyData(data);
      }
      setLoading(false);
    })
  };

  useEffect(() => {
    fetchAllCompanyData()
  }, [searchCompany])

  const confirmDelete = async (companyId: string) => {
    try {
      setLoading(true);
      const companyDataByID = doc(db, 'company', companyId);
      await updateDoc(companyDataByID, {
        status: 'archived'
      });
    } catch (error) {
      console.error('Error archiving company:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<CompanyI>['columns'] = [
    {
      title: 'เลขประจำตัวผู้เสียภาษี(13 หลัก)*',
      dataIndex: 'taxNumber',
      key: 'taxNumber',
      sorter: (a, b) => a.taxNumber.localeCompare(b.taxNumber),
      width: 140,
      render: (data) => {
        return (
          <div className='w-[140px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'เลขที่บัญชีนายจ้าง',
      dataIndex: 'employerNumber',
      key: 'employerNumber',
      sorter: (a, b) => a.employerNumber.localeCompare(b.employerNumber),
      width: 210,
      render: (data) => {
        return (
          <div className='w-[210px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ลำดับที่สาขา',
      dataIndex: 'branchNumber',
      key: 'branchNumber',
      sorter: (a, b) => a.branchNumber.localeCompare(b.branchNumber),
      width: 140,
      render: (data) => {
        return (
          <div className='w-[140px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ชื่อนายจ้าง',
      dataIndex: 'employerName',
      key: 'employerName',
      sorter: (a, b) => a.employerName.localeCompare(b.employerName),
      width: 210,
      render: (data) => {
        return (
          <div className='w-[210px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
      width: 140,
      render: (data) => {
        return (
          <div className='w-[140px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ชื่อบริษัท',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      width: 210,
      render: (data) => {
        return (
          <div className='w-[210px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ที่อยู่',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
      width: 210,
      render: (data) => {
        return (
          <div className='w-[210px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
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
            onConfirm={() => confirmDelete(e)}
            placement="left"
          >
            <MdDelete className='w-7 h-7 hover:scale-110 duration-300 text-red-600' />
          </Popconfirm >
        </div>)
    },
  ];

  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 10,
  });

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <Table
      columns={columns}
      dataSource={companyData}
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  )
}
