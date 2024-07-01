"use client"

import React, { useEffect, useState } from 'react'

import { EmployeeI } from '@/interfaces/company';
import { onValue, ref, update } from 'firebase/database';
import { db } from '@/libs/firebase';
import { Popconfirm, Table, TableProps } from 'antd';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa6';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function EmployeeTable(props: any) {
  const { searchEmployee, companyId } = props

  const [loading, setLoading] = useState<boolean>(true);
  const [employeeData, setEmployeeData] = useState<EmployeeI[]>([]);

  const companyDataById = ref(db, 'employee');

  useEffect(() => {
    onValue(companyDataById, (snapshot) => {
      setLoading(true)
      const data = snapshot.val();
      if (data) {
        const employeeArray = Object.keys(data).map(employeeId => ({
          employeeId,
          ...data[employeeId]
        }));
        if (searchEmployee) {
          setEmployeeData(employeeArray.filter((data) => data.IDcardNumber.toLowerCase().includes(searchEmployee.trim().toLowerCase()) && data.status !== 'archived' && data.companyId === companyId));
        } else {
          setEmployeeData(employeeArray.filter((data) => data.status !== 'archived' && data.companyId === companyId));
        }
      }
      setLoading(false)
    });
  }, [searchEmployee])

  const confirmDelete = (employeeId: string) => {
    update(ref(db, `employee/${employeeId}`), {
      status: 'archived',
    });
  };

  const columns: TableProps<EmployeeI>['columns'] = [
    {
      title: 'เลขบัตรประชาชน',
      dataIndex: 'IDcardNumber',
      key: 'IDcardNumber',
      sorter: (a, b) => a.IDcardNumber.localeCompare(b.IDcardNumber),
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
      title: 'คำนำหน้านาม',
      dataIndex: 'titleName',
      key: 'titleName',
      sorter: (a, b) => a.titleName.localeCompare(b.titleName),
      width: 120,
      render: (data) => {
        return (
          <div className='w-[120px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      width: 180,
      render: (data) => {
        return (
          <div className='w-[180px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'สกุล',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      width: 180,
      render: (data) => {
        return (
          <div className='w-[180px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'ที่อยู่ตามบัตรประชาชนหรือที่อยู่ที่ติดต่อได้',
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
      title: 'ตำแหน่งงาน',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
      width: 160,
      render: (data) => {
        return (
          <div className='w-[160px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'วันที่เริ่มงาน',
      dataIndex: 'workStartDate',
      key: 'workStartDate',
      sorter: (a, b) => a.address.localeCompare(b.address),
      width: 110,
      render: (data) => {
        return (
          <div className='w-[110px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'วันที่ลาออก',
      dataIndex: 'resignationDate',
      key: 'resignationDate',
      sorter: (a, b) => a.address.localeCompare(b.address),
      width: 110,
      render: (data) => {
        return (
          <div className='w-[110px] overflow-hidden line-clamp-1'>
            {data}
          </div>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (employeeId) => (
        <div className='flex justify-center items-center space-x-3'>
          <Link href={`/employee/view/${employeeId}`} className='cursor-default'>
            <FaEye className='w-7 h-7 hover:scale-110 duration-300 text-slate-600' />
          </Link>
          <Link href={`/employee/edit/${employeeId}`} className='cursor-default'>
            <MdEditSquare className='w-7 h-7 hover:scale-110 duration-300 text-blue-600' />
          </Link>
          <Popconfirm
            title="ยืนยันการลบข้อมูล"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            description="ข้อมูลของคุณจะถูกลบออกจากระบบ กรุณาตรวจสอบข้อมูลอีกครั้ง"
            okText="ยืนยัน"
            cancelText="ยกเลิก"
            onConfirm={() => confirmDelete(employeeId)}
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
    <>
      <div className='h-full w-full relative'>
        <p className='bg-transparent absolute bottom-[6%] left-[1%] z-20 text-red-500 text-[0.9rem]'>* กรณีไม่สามารถใช้ที่อยู่ตามบัตรฯ ให้ใช้ที่อยู่บริษัทที่ทำงานปัจจุบัน</p>
        <Table
          columns={columns}
          dataSource={employeeData}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          rowKey={'key'}
        />
      </div>
    </>
  )
}
