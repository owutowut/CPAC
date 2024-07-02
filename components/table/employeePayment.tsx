"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import type { TableProps } from 'antd';
import { Popconfirm } from 'antd';

import { initialAlertInfo, initialEmployeePayment } from '@/utils/initial'
import { Alert, Select, Table } from 'antd'

import { db } from '@/libs/firebase';
import { collection, where, query, doc, updateDoc, onSnapshot, getDocs } from 'firebase/firestore';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa6';
import { MdDelete, MdEditSquare } from 'react-icons/md';

import { EmployeePaymentI } from '@/interfaces/company';
import { AiFillEdit } from 'react-icons/ai';
import { render } from 'react-dom';

export default function EmployeePaymentTable(props: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentData, setPaymentData] = useState<EmployeePaymentI[]>([initialEmployeePayment]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertInfo);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() + 543);

  const { employeeId } = props


  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const ref = query(collection(db, `employee/${employeeId}/payment`), where('year', '==', selectedYear));
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map(payment => ({
        ...payment.data()
      })) as EmployeePaymentI[];
      if (data.length > 0) {
        setPaymentData(data);
      } else {
        setPaymentData([initialEmployeePayment]);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setPaymentData([initialEmployeePayment]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [selectedYear]);

  const confirmDelete = async (employeeId: string) => {
    try {
      setLoading(true);
      const paymentByID = doc(db, `employee/${employeeId}/payment`, employeeId);
      await updateDoc(paymentByID, {
        status: 'archived'
      });
    } catch (error) {
      console.error('Error archiving company:', error);
    } finally {
      setLoading(false);
    }
  };

  const { Option } = Select;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(year => year + 543);

  const title = [
    '', 'ค่าตำแหน่ง', 'เบี้ยขยัน', 'OT', 'อื่นๆ',
    'รวมเงินได้ 40(1)', 'ค่าจ้าง 40(2)', 'ค่าคอม 40(2)', 'รวมเงินได้  40(2)', 'รวม 40(1)+(2)', 'ประกันสังคม', 'ภาษี'
  ];
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const columns = [
    {
      title: 'เดือน',
      dataIndex: 'month',
      key: 'month',
      render: (data: string) => (
        <p>{months.map((item) => item)}</p>
      )
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'month',
      key: 'month',
    },
  ];

  return (
    <div className="w-full h-full text-black overflow-auto">
      {!loading ?
        <form className='space-y-[1rem]'>
          <div className='flex justify-end items-center space-x-4'>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e)} placement='bottomLeft' placeholder="เลือกปี..." style={{ width: 120 }}>
              {years.map(year => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
            {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
            <button type='submit' className='flex justify-center items-center space-x-2 p-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-xl hover:scale-105 duration-300'>
              <AiFillEdit className='w-6 h-6' />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
          {/* <table className="table-auto border-collapse bg-white rounded-lg">
            <thead>
              <tr>
                {title.map((title, index) => (
                  <>
                    {title === 'ประกันสังคม' || title === 'ภาษี' ?
                      <th key={index} className="p-4 text-red-600">{title}</th> :
                      <th key={index} className="p-4">{title}</th>
                    }
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">มกราคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input value={paymentData[0].jan[i]} onChange={(e) => setPaymentData(paymentData[0].jan[i] = e)} className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input value={paymentData[0].jan[i]} onChange={(e) => setPaymentData(paymentData[0].jan[i] = e)} className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input value={paymentData[0].jan[i]} onChange={(e) => setPaymentData(paymentData[0].jan[i] = e)} className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input value={paymentData[0].jan[i]} onChange={(e) => setPaymentData(paymentData[0].jan[i] = e)} className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input value={paymentData[0].jan[i]} onChange={(e) => setPaymentData(paymentData[0].jan[i] = e)} className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">กุมภาพันธ์</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">มีนาคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">เมษายน</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input value={'s'} className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input value={'s'} className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input value={'s'} className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input value={'s'} className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input value={'s'} className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">พฤษภาคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">มิถุนายน</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">กรกฎาคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">สิงหาคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">กันยายน</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">ตุลาคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">พฤศจิกายน</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">ธันวาคม</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">รวมทั้งสิ้น</td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input disabled className='border-slate-600 border-2 font-semibold w-full rounded-lg p-2 text-black' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input disabled className='border-slate-600 border-2 font-semibold w-full text-black rounded-lg p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input disabled className='border-slate-600 border-2 font-semibold w-full text-black rounded-lg p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input disabled className='border-slate-600 border-2 font-semibold w-full text-black rounded-lg p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input disabled className='border-slate-600 border-2 w-full rounded-lg text-black p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
              <tr>
                <td className="p-4">
                  <span className='cursor-default h-full w-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
                    แทนที่
                  </span>
                </td>
                {Array.from({ length: 12 }, (_, i) => (
                  <>
                    {i === 5 ?
                      <td className='p-2' key={i}>
                        <input className='font-semibold w-full rounded-lg text-black p-2 bg-blue-100' />
                      </td>
                      : i === 8 ?
                        <td className='p-2' key={i}>
                          <input className='font-semibold w-full bg-yellow-100 rounded-lg text-black p-2' />
                        </td> : i === 9 ?
                          <td className='p-2' key={i}>
                            <input className='font-semibold w-full bg-green-100 rounded-lg text-black p-2' />
                          </td> : i === 10 || i === 11 ?
                            <td className='p-2' key={i}>
                              <input className='font-semibold w-full bg-slate-100 rounded-lg text-red-600 p-2' />
                            </td> :
                            <td className='p-2' key={i}>
                              <input className='w-full bg-slate-900 rounded-lg text-white p-2' />
                            </td>
                    }
                  </>
                ))}
              </tr>
            </tbody>
          </table> */}
          <Table columns={columns} dataSource={paymentData} pagination={false} />
        </form>
        :
        <div className='h-full w-full flex justify-center items-center'>
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }
    </div >
  )
}
