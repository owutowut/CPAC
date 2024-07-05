"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import type { TableProps } from 'antd';
import { Popconfirm } from 'antd';

import { initialAlertError, initialAlertInfo, initialAlertSuccess, initialEmployee } from '@/utils/initial'
import { Alert, Select, Table } from 'antd'

import { db } from '@/libs/firebase';
import { collection, where, query, doc, updateDoc, onSnapshot, getDocs, addDoc, setDoc, getDoc } from 'firebase/firestore';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa6';
import { MdDelete, MdEditSquare } from 'react-icons/md';

import { AiFillEdit } from 'react-icons/ai';
import { EmployeeI, EmployeePaymentI } from '@/interfaces/company';
import { IoIosAddCircle } from 'react-icons/io';

import { IntlProvider, FormattedNumber } from 'react-intl';
import { useReactToPrint } from 'react-to-print';
import { BiSolidFileExport } from 'react-icons/bi';

export default function EmployeePaymentTable(props: any) {
  const { isPrintContent, setIsPrintContent, employeeId } = props
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialAlertInfo);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() + 543);
  const [selectedTitle, setSelectedTitle] = useState<number>(1);
  const [paymentData, setPaymentData] = useState<EmployeePaymentI[]>([]);
  const [dataReplace, setDataReplace] = useState<any>('0');
  const [sumData, setSumData] = useState<number[]>(Array(12).fill(0));
  const [employeeData, setEmployeeData] = useState<EmployeeI>(initialEmployee);

  const refByID = doc(db, `employee/${employeeId}`);

  const fetchEmployeeByID = async () => {
    setLoading(true)
    const snapshot = await getDoc(refByID);
    if (snapshot.exists()) {
      const data = {
        companyId: snapshot.id,
        ...snapshot.data()
      } as EmployeeI;
      setEmployeeData(data);
    } else {
      setEmployeeData(initialEmployee)
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchEmployeeByID();
  }, []);

  const fetchPaymentData = async () => {
    const paymentRef = collection(db, `employee/${employeeId}/payment`);
    const queryRef = query(paymentRef, where('year', '==', selectedYear));
    onSnapshot(queryRef, async (snapshot) => {
      try {
        setLoading(true);
        const data = snapshot.docs.map((doc) => ({
          paymentId: doc.id,
          ...doc.data(),
        })) as EmployeePaymentI[]
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

  const onReplaceData = async () => {
    try {
      setLoading(true)
      const updatedData = await Promise.all(paymentData.map(async (paymentItem) => {
        const updatedItem = {
          ...paymentItem,
          [`data${selectedTitle}`]: dataReplace,
        };
        updatedItem.data6 = updatedItem.data1 + updatedItem.data2 + updatedItem.data3 + updatedItem.data4 + updatedItem.data5
        updatedItem.data9 = updatedItem.data7 + updatedItem.data8
        updatedItem.data10 = updatedItem.data6 + updatedItem.data9
        return updatedItem;
      }));
      setPaymentData(updatedData);
    } catch (error) {
      console.error('Error updating payment data:', error);
    } finally {
      setLoading(false)
    }
  };

  const onEditPayment = async () => {
    try {
      setLoading(true)
      paymentData.map(async (paymentData) => {
        const paymentRef = doc(db, `employee/${employeeId}/payment/${paymentData.paymentId}`);
        await updateDoc(paymentRef, {
          employeeId: paymentData.employeeId,
          year: paymentData.year,
          month: paymentData.month,
          data1: paymentData.data1,
          data2: paymentData.data2,
          data3: paymentData.data3,
          data4: paymentData.data4,
          data5: paymentData.data5,
          data6: paymentData.data6,
          data7: paymentData.data7,
          data8: paymentData.data8,
          data9: paymentData.data9,
          data10: paymentData.data10,
          data11: paymentData.data11,
          data12: paymentData.data12,
        });
      });
      console.log('Payment documents updated successfully.');
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
    } finally {
      setLoading(false)
    }
  }

  const { Option } = Select;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(year => year + 543);

  const createPayment = async () => {
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

  const handleChangeDataTable = (month: number, field: string, value: any) => {
    const newData = paymentData.map((item) => {
      if (item.month === month) {
        const updatedItem = {
          ...item,
          [field]: value,
        };
        updatedItem.data6 = updatedItem.data1 + updatedItem.data2 + updatedItem.data3 + updatedItem.data4 + updatedItem.data5
        updatedItem.data9 = updatedItem.data7 + updatedItem.data8
        updatedItem.data10 = updatedItem.data6 + updatedItem.data9
        return updatedItem;
      }
      return item;
    });
    setPaymentData(newData);
  };

  const sumAllData = () => {
    const sums: number[] = Array(12).fill(0);
    paymentData.forEach((item) => {
      sums[0] += item.data1;
      sums[1] += item.data2;
      sums[2] += item.data3;
      sums[3] += item.data4;
      sums[4] += item.data5;
      sums[5] += item.data6;
      sums[6] += item.data7;
      sums[7] += item.data8;
      sums[8] += item.data9;
      sums[9] += item.data10;
      sums[10] += item.data11;
      sums[11] += item.data12;
    });
    setSumData(sums);
  }

  useEffect(() => {
    sumAllData()
  }, [paymentData]);

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const title = [
    'เงินเดือน', 'ค่าตำแหน่ง', 'เบี้ยขยัน', 'OT', 'อื่นๆ',
    'รวมเงินได้ 40(1)', 'ค่าจ้าง 40(2)', 'ค่าคอม 40(2)', 'รวมเงินได้  40(2)', 'รวม 40(1)+(2)', 'ประกันสังคม', 'ภาษี'
  ];


  const columns: TableProps<EmployeePaymentI>['columns'] = [
    {
      title: 'เดือน',
      dataIndex: 'month',
      key: 'month',
      align: 'center',
      render: (data: number) => (
        months.map((month, index) => {
          if (index + 1 === data) {
            return month
          }
        }
        ))
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'data1',
      key: 'data1',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data1', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'ค่าตำแหน่ง',
      dataIndex: 'data2',
      key: 'data2',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data2', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'เบี้ยขยัน',
      dataIndex: 'data3',
      key: 'data3',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data3', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'OT',
      dataIndex: 'data4',
      key: 'data4',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data4', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'อื่นๆ',
      dataIndex: 'data5',
      key: 'data5',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data5', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'รวมเงินได้ 40(1)',
      dataIndex: 'data6',
      key: 'data6',
      align: 'center',
      render: (data6) => (
        <p className='text-center bg-blue-200 rounded-lg text-slate-900 font-semibold p-2'>
          <FormattedNumber
            value={data6}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ค่าจ้าง 40(2)',
      dataIndex: 'data7',
      key: 'data7',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data7', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'ค่าคอม 40(2)',
      dataIndex: 'data8',
      key: 'data8',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data8', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'รวมเงินได้ 40(2)',
      dataIndex: 'data9',
      key: 'data9',
      align: 'center',
      render: (data9) => (
        <p className='text-center bg-yellow-200 rounded-lg text-slate-900 font-semibold p-2'>
          <FormattedNumber
            value={data9}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'รวม 40(1)+(2)',
      dataIndex: 'data10',
      key: 'data10',
      align: 'center',
      render: (data10) => (
        <p className='text-center bg-green-200 rounded-lg text-slate-900 font-semibold p-2'>
          <FormattedNumber
            value={data10}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ประกันสังคม',
      dataIndex: 'data11',
      key: 'data11',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data11', parseFloat(e.target.value))}
        />
      )
    },
    {
      title: 'ภาษี',
      dataIndex: 'data12',
      key: 'data12',
      align: 'center',
      render: (data: any, record: EmployeePaymentI) => (
        <input
          type='number'
          value={data}
          className='text-center w-full border-slate-900 border rounded-lg text-slate-900 p-2'
          onChange={(e) => handleChangeDataTable(record.month, 'data12', parseFloat(e.target.value))}
        />
      )
    },
  ];

  const contentToPrint = useRef(null);

  const printContent = useReactToPrint({
    content: () => contentToPrint.current,
    onAfterPrint: () => {
      setIsPrintContent(false)
    }
  });

  useEffect(() => {
    if (isPrintContent) {
      printContent()
    }
  }, [isPrintContent])

  const columnsForPrint: TableProps<EmployeePaymentI>['columns'] = [
    {
      title: 'เดือน',
      dataIndex: 'month',
      key: 'month',
      align: 'center',
      render: (data: number) => (
        <p className='font-semibold'>
          {
            months.map((month, index) => {
              if (index + 1 === data) {
                return month
              }
            }
            )
          }
        </p>
      )
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'data1',
      key: 'data1',
      align: 'center',
      render: (data1) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data1}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ค่าตำแหน่ง',
      dataIndex: 'data2',
      key: 'data2',
      align: 'center',
      render: (data2) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data2}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'เบี้ยขยัน',
      dataIndex: 'data3',
      key: 'data3',
      align: 'center',
      render: (data3) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data3}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'OT',
      dataIndex: 'data4',
      key: 'data4',
      align: 'center',
      render: (data4) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data4}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'อื่นๆ',
      dataIndex: 'data5',
      key: 'data5',
      align: 'center',
      render: (data5) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data5}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'รวมเงินได้ 40(1)',
      dataIndex: 'data6',
      key: 'data6',
      align: 'center',
      render: (data6) => (
        <p className='text-center rounded-lg font-bold p-2'>
          <FormattedNumber
            value={data6}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ค่าจ้าง 40(2)',
      dataIndex: 'data7',
      key: 'data7',
      align: 'center',
      render: (data7) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data7}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ค่าคอม 40(2)',
      dataIndex: 'data8',
      key: 'data8',
      align: 'center',
      render: (data8) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data8}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'รวมเงินได้ 40(2)',
      dataIndex: 'data9',
      key: 'data9',
      align: 'center',
      render: (data9) => (
        <p className='text-center rounded-lg font-bold p-2'>
          <FormattedNumber
            value={data9}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'รวม 40(1)+(2)',
      dataIndex: 'data10',
      key: 'data10',
      align: 'center',
      render: (data10) => (
        <p className='text-center rounded-lg font-bold p-2'>
          <FormattedNumber
            value={data10}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ประกันสังคม',
      dataIndex: 'data11',
      key: 'data11',
      align: 'center',
      render: (data11) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data11}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
    {
      title: 'ภาษี',
      dataIndex: 'data12',
      key: 'data12',
      align: 'center',
      render: (data12) => (
        <p className='text-center rounded-lg p-2'>
          <FormattedNumber
            value={data12}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
  ];

  return (
    <IntlProvider locale="th">
      <div className="w-full h-full text-black overflow-auto space-y-[1rem]">
        <div className='xl:flex xl:items-center xl:justify-between xl:space-y-0 space-y-2'>
          <div className='xl:flex xl:items-center xl:space-x-3 xl:space-y-0 space-y-2'>
            <input
              type='number'
              value={dataReplace}
              className='xl:w-[8rem] w-full h-[2.4rem] text-center border-slate-900 border rounded-lg text-slate-900 p-2'
              onChange={(e) => setDataReplace(parseFloat(e.target.value))}
            />
            <Select className='xl:w-[10rem] w-full h-[2.4rem]' value={selectedTitle} onChange={(e) => setSelectedTitle(e)} placement='bottomLeft' placeholder="เลือกข้อมูล...">
              {title.map((title, index) => (
                <>
                  {index + 1 === 6 || index + 1 === 9 || index + 1 === 10 ?
                    <></>
                    :
                    <Option key={title} value={index + 1}>
                      {title}
                    </Option>
                  }
                </>
              ))}
            </Select>
            <span onClick={() => onReplaceData()} className='xl:w-[5rem] w-full cursor-default h-full flex justify-center items-center space-x-2 p-2 bg-slate-600 text-white rounded-lg hover:scale-105 duration-300'>
              ตกลง
            </span>
          </div>
          <div className='xl:flex xl:items-center xl:space-x-3 xl:space-y-0 space-y-2'>
            {showAlert && <Alert className={alert.className} message={alert.message} type={alert.type} showIcon />}
            <Select className='xl:w-[8rem] w-full h-[2.4rem]' value={selectedYear} onChange={(e) => setSelectedYear(e)} placement='bottomLeft' placeholder="เลือกปี...">
              {years.map(year => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
            <div className='p-1'>
              {!paymentData.length ?
                <button onClick={() => createPayment()} className='xl:w-fit w-full h-full flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
                  <IoIosAddCircle className='w-6 h-6' />
                  <span>สร้างตาราง</span>
                </button>
                :
                <button onClick={() => onEditPayment()} className='xl:w-fit w-full h-full flex justify-center items-center space-x-2 p-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-xl hover:scale-105 duration-300'>
                  <AiFillEdit className='w-6 h-6' />
                  <span>บันทึกข้อมูล</span>
                </button>
              }
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl overflow-auto'>
          <Table
            columns={columns}
            dataSource={paymentData}
            pagination={false}
            loading={loading}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell align='center' index={-1}>
                  รวมทั้งสิ้น
                </Table.Summary.Cell>
                {columns.map((column, index) => (
                  <>
                    {index === 5 ?
                      <Table.Summary.Cell key={column.key} align='center' index={index} className='bg-blue-200 font-semibold'>
                        <FormattedNumber
                          value={sumData[index]}
                          style="decimal"
                          minimumFractionDigits={2}
                        />
                      </Table.Summary.Cell>
                      : index === 8 ?
                        <Table.Summary.Cell key={column.key} align='center' index={index} className='bg-yellow-200 font-semibold'>
                          <FormattedNumber
                            value={sumData[index]}
                            style="decimal"
                            minimumFractionDigits={2}
                          />
                        </Table.Summary.Cell>
                        : index === 9 ?
                          <Table.Summary.Cell key={column.key} align='center' index={index} className='bg-green-200 font-semibold'>
                            <FormattedNumber
                              value={sumData[index]}
                              style="decimal"
                              minimumFractionDigits={2}
                            />
                          </Table.Summary.Cell>
                          : index === 12 ?
                            <></>
                            :
                            <Table.Summary.Cell key={column.key} align='center' index={index} className='font-semibold'>
                              <FormattedNumber
                                value={sumData[index]}
                                style="decimal"
                                minimumFractionDigits={2}
                              />
                            </Table.Summary.Cell>
                    }
                  </>
                ))}
              </Table.Summary.Row>
            )}
          />
        </div>
      </div >
      <div className={`${isPrintContent ? 'block' : 'hidden'} flex items-center space-x-4 pt-[1rem]`}>
        <BiSolidFileExport className='w-10 h-10' />
        <h2 className='font-bold text-[1.8rem] text-white'>ตัวอย่างส่งออก</h2>
      </div>
      <div ref={contentToPrint} className={`${isPrintContent ? 'block' : 'hidden'} printable-content space-y-2 bg-white rounded-xl`}>
        <div className='rounded-lg text-black p-6 space-y-2'>
          <p className='text-end'>ปี {selectedYear}</p>
          <p><mark className='bg-transparent font-semibold mr-4'> ชื่อ-สกุล พนักงาน : </mark> {employeeData.titleName} {employeeData.firstName} {employeeData.lastName}</p>
          <p><mark className='bg-transparent font-semibold mr-4'> เลขประจำตัวประชาชน : </mark> {employeeData.IDcardNumber}</p>
        </div>
        <div>
          <Table
            columns={columnsForPrint}
            dataSource={paymentData}
            pagination={false}
            loading={loading}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell align='center' index={-1} className='font-bold'>
                  รวมทั้งสิ้น
                </Table.Summary.Cell>
                {columns.map((column, index) => (
                  <>
                    {index === 5 ?
                      <Table.Summary.Cell key={column.key} align='center' index={index} className='font-bold'>
                        <FormattedNumber
                          value={sumData[index]}
                          style="decimal"
                          minimumFractionDigits={2}
                        />
                      </Table.Summary.Cell>
                      : index === 8 ?
                        <Table.Summary.Cell key={column.key} align='center' index={index} className='font-bold'>
                          <FormattedNumber
                            value={sumData[index]}
                            style="decimal"
                            minimumFractionDigits={2}
                          />
                        </Table.Summary.Cell>
                        : index === 9 ?
                          <Table.Summary.Cell key={column.key} align='center' index={index} className='font-bold'>
                            <FormattedNumber
                              value={sumData[index]}
                              style="decimal"
                              minimumFractionDigits={2}
                            />
                          </Table.Summary.Cell>
                          : index === 12 ?
                            <></>
                            :
                            <Table.Summary.Cell key={column.key} align='center' index={index} className='font-bold'>
                              <FormattedNumber
                                value={sumData[index]}
                                style="decimal"
                                minimumFractionDigits={2}
                              />
                            </Table.Summary.Cell>
                    }
                  </>
                ))}
              </Table.Summary.Row>
            )}
          />
        </div>
      </div>
    </IntlProvider>
  )
}
