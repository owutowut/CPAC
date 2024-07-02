"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import type { TableProps } from 'antd';
import { Popconfirm } from 'antd';

import { initialAlertError, initialAlertInfo, initialAlertSuccess } from '@/utils/initial'
import { Alert, Select, Table } from 'antd'

import { db } from '@/libs/firebase';
import { collection, where, query, doc, updateDoc, onSnapshot, getDocs, addDoc, setDoc } from 'firebase/firestore';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa6';
import { MdDelete, MdEditSquare } from 'react-icons/md';

import { AiFillEdit } from 'react-icons/ai';
import { EmployeePaymentI } from '@/interfaces/company';
import { IoIosAddCircle } from 'react-icons/io';

export default function EmployeePaymentTable(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertInfo);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() + 543);
  const [paymentData, setPaymentData] = useState<EmployeePaymentI[]>([]);

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const fetchPaymentData = async () => {
    const paymentRef = collection(db, `employee/${employeeId}/payment`);
    const queryRef = query(paymentRef, where('year', '==', selectedYear));
    onSnapshot(queryRef, async (snapshot) => {
      try {
        setLoading(true);
        const data = snapshot.docs.map(doc => doc.data() as EmployeePaymentI);
        data && setPaymentData(data.sort((a, b) => a.month - b.month))
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    })
  }

  useEffect(() => {
    fetchPaymentData();
  }, [selectedYear]);

  const { employeeId } = props

  // const onSubmitPayment = async () => {
  //   try {
  //     setLoading(true);
  //     const ref = collection(db, `employee/${employeeId}/payment`);
  //     await addDoc(ref, {
  //       employeeId: employeeId,
  //       year: '2566',
  //       month: 'มกราคม',
  //       data1: 213,
  //       data2: 1230,
  //       data3: 10,
  //       data4: 10,
  //       data5: 130,
  //       data6: 330,
  //       data7: 230,
  //       data8: 30,
  //       data9: 1230,
  //       data10: 1240,
  //       data11: 440,
  //       data12: 1240,
  //     });
  //     setAlert(initialAlertSuccess);
  //     setShowAlert(true);
  //     setTimeout(() => {
  //       setShowAlert(false);
  //     }, 3000);
  //   } catch (error) {
  //     setAlert(initialAlertError);
  //     setShowAlert(true);
  //     setTimeout(() => {
  //       setShowAlert(false);
  //     }, 3000);
  //     console.error('Error creating payment:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const { Option } = Select;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(year => year + 543);

  const title = [
    'เงินเดือน', 'ค่าตำแหน่ง', 'เบี้ยขยัน', 'OT', 'อื่นๆ',
    'รวมเงินได้ 40(1)', 'ค่าจ้าง 40(2)', 'ค่าคอม 40(2)', 'รวมเงินได้  40(2)', 'รวม 40(1)+(2)', 'ประกันสังคม', 'ภาษี'
  ];

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    ...title.map((item, index) => ({
      title: item,
      dataIndex: `data${index + 1}`,
      key: `data${index + 1}`,
    })),
  ];

  const createPayment = async (e: any) => {
    e.preventDefault();
    const paymentRef = collection(db, `employee/${employeeId}/payment`);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    try {
      setLoading(true)
      months.map(async (month) => {
        await addDoc(paymentRef, {
          employeeId: employeeId,
          year: selectedYear,
          month: month,
          data1: 0,
          data2: 0,
          data3: 0,
          data4: 0,
          data5: 0,
          data6: 0,
          data7: 0,
          data8: 0,
          data9: 0,
          data10: 0,
          data11: 0,
          data12: 0,
        });
      });
      console.log('Payment documents created successfully.');
    } catch (error) {
      console.error('Error creating payment documents:', error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="w-full h-full text-black overflow-auto">
      <form className='space-y-[1rem]'>
        <div className='flex justify-end items-center space-x-4'>
          {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
          <Select className='w-[8rem] h-[2.4rem]' value={selectedYear} onChange={(e) => setSelectedYear(e)} placement='bottomLeft' placeholder="เลือกปี...">
            {years.map(year => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          {!paymentData.length &&
            <button onClick={(e) => createPayment(e)} className='flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
              <IoIosAddCircle className='w-6 h-6' />
              <span>สร้างตาราง</span>
            </button>
          }
          {/* <button type='submit' className='flex justify-center items-center space-x-2 p-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-xl hover:scale-105 duration-300'>
              <AiFillEdit className='w-6 h-6' />
              <span>บันทึกข้อมูล</span>
            </button> */}
        </div>
        <div>
          <Table columns={columns} dataSource={paymentData} pagination={false} loading={loading} />
        </div>
      </form>
    </div >
  )
}
