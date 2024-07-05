"use client"

import { CompanyPaymentI, EmployeeI, EmployeePaymentI } from '@/interfaces/company';
import { db } from '@/libs/firebase';
import { Table, TableProps } from 'antd'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BiSolidFileExport } from 'react-icons/bi';
import { FormattedNumber, IntlProvider } from 'react-intl';
import { useReactToPrint } from 'react-to-print';

export default function CompanyPaymentTable(props: any) {
  const { searchCompanyPayment, selectedYear, setIsPrintContent, isPrintContent, companyName } = props

  const [loading, setLoading] = useState<boolean>(true);
  const [employeeData, setEmployeeData] = useState<EmployeeI[]>([]);
  const [paymentData, setPaymentData] = useState<EmployeeI[]>([]);
  const [sumData, setSumData] = useState<number[]>(Array(12).fill(0));
  const { companyId } = useParams();

  const employeeRef = query(
    collection(db, "employee"),
    where('companyId', '==', companyId)
  );

  const fetchAllEmployeeData = async () => {
    onSnapshot(employeeRef, (snapshot) => {
      setLoading(true);
      const data = snapshot.docs.map(doc => ({
        employeeId: doc.id,
        ...doc.data()
      })) as EmployeeI[];
      if (searchCompanyPayment) {
        const filteredData = data.filter(employee => employee.IDcardNumber.includes(searchCompanyPayment) && employee.status !== 'archived');
        setEmployeeData(filteredData);
      } else {
        const filteredData = data.filter(employee => employee.status !== 'archived');
        setEmployeeData(filteredData);
      }
      setLoading(false);
    })
  };

  const fetchAllPaymentData = async () => {
    setLoading(true);
    try {
      const data1Array = new Array(employeeData.length).fill(0);
      const data2Array = new Array(employeeData.length).fill(0);
      const data3Array = new Array(employeeData.length).fill(0);
      const data4Array = new Array(employeeData.length).fill(0);
      const data5Array = new Array(employeeData.length).fill(0);
      const data6Array = new Array(employeeData.length).fill(0);
      const data7Array = new Array(employeeData.length).fill(0);
      const data8Array = new Array(employeeData.length).fill(0);
      const data9Array = new Array(employeeData.length).fill(0);
      const data10Array = new Array(employeeData.length).fill(0);
      const data11Array = new Array(employeeData.length).fill(0);
      const data12Array = new Array(employeeData.length).fill(0);
      await Promise.all(employeeData.map(async (employee, index) => {
        const paymentRef = collection(db, `employee/${employee.employeeId}/payment`);
        const queryRef = query(paymentRef, where('year', '==', selectedYear)); // Filter by selectedYear
        const paymentSnapshot = await getDocs(queryRef);
        const payments = paymentSnapshot.docs.map((paymentDoc) => ({
          paymentId: paymentDoc.id,
          employeeId: employee.employeeId,
          ...paymentDoc.data(),
        })) as EmployeePaymentI[];
        let sumData1 = 0;
        let sumData2 = 0;
        let sumData3 = 0;
        let sumData4 = 0;
        let sumData5 = 0;
        let sumData6 = 0;
        let sumData7 = 0;
        let sumData8 = 0;
        let sumData9 = 0;
        let sumData10 = 0;
        let sumData11 = 0;
        let sumData12 = 0;
        payments.forEach((payment) => {
          sumData1 += payment.data1;
          sumData2 += payment.data2;
          sumData3 += payment.data3;
          sumData4 += payment.data4;
          sumData5 += payment.data5;
          sumData6 += payment.data6;
          sumData7 += payment.data7;
          sumData8 += payment.data8;
          sumData9 += payment.data9;
          sumData10 += payment.data10;
          sumData11 += payment.data11;
          sumData12 += payment.data12;
        });
        data1Array[index] = sumData1;
        data2Array[index] = sumData2;
        data3Array[index] = sumData3;
        data4Array[index] = sumData4;
        data5Array[index] = sumData5;
        data6Array[index] = sumData6;
        data7Array[index] = sumData7;
        data8Array[index] = sumData8;
        data9Array[index] = sumData9;
        data10Array[index] = sumData10;
        data11Array[index] = sumData11;
        data12Array[index] = sumData12;
        const updatedDataArray = employeeData.map((employee, index) => ({
          ...employee,
          data1: data1Array[index],
          data2: data2Array[index],
          data3: data3Array[index],
          data4: data4Array[index],
          data5: data5Array[index],
          data6: data6Array[index],
          data7: data7Array[index],
          data8: data8Array[index],
          data9: data9Array[index],
          data10: data10Array[index],
          data11: data11Array[index],
          data12: data12Array[index]
        }));
        setPaymentData(updatedDataArray);
      }));
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sumAllData = () => {
    const sums: number[] = Array(12).fill(0);
    paymentData.forEach((item: any) => {
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
    fetchAllEmployeeData()
  }, [searchCompanyPayment, selectedYear])

  useEffect(() => {
    fetchAllPaymentData()
  }, [employeeData])

  useEffect(() => {
    sumAllData()
  }, [paymentData])

  const columns: TableProps<any>['columns'] = [
    {
      title: 'เลขบัตรประชาชน',
      dataIndex: 'IDcardNumber',
      key: 'IDcardNumber',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'คำนำหน้านาม',
      dataIndex: 'titleName',
      key: 'titleName',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      key: 'firstName',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'สกุล',
      dataIndex: 'lastName',
      key: 'lastName',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'data1',
      key: 'data1',
      align: 'center',
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center bg-blue-200 rounded-lg text-slate-900 font-semibold p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center bg-yellow-200 rounded-lg text-slate-900 font-semibold p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center bg-green-200 rounded-lg text-slate-900 font-semibold p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p>
          <FormattedNumber
            value={data}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
      )
    },
  ];

  const columnsForPrint: TableProps<any>['columns'] = [
    {
      title: 'เลขบัตรประชาชน',
      dataIndex: 'IDcardNumber',
      key: 'IDcardNumber',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'คำนำหน้านาม',
      dataIndex: 'titleName',
      key: 'titleName',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      key: 'firstName',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'สกุล',
      dataIndex: 'lastName',
      key: 'lastName',
      align: 'center',
      render: (data: string) => (
        <p className='text-center p-2'>
          {data}
        </p>
      )
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'data1',
      key: 'data1',
      align: 'center',
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center font-semibold p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center font-semibold p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p className='text-center font-semibold p-2'>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p>
          <FormattedNumber
            value={data}
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
      render: (data: any) => (
        <p>
          <FormattedNumber
            value={data}
            style="decimal"
            minimumFractionDigits={2}
          />
        </p>
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
    console.log(isPrintContent);
  }, [isPrintContent])

  return (
    <IntlProvider locale="th">
      <Table
        columns={columns}
        dataSource={paymentData}
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell align='center' index={-4}>
            </Table.Summary.Cell>
            <Table.Summary.Cell align='center' index={-3}>
            </Table.Summary.Cell>
            <Table.Summary.Cell align='center' index={-2}>
            </Table.Summary.Cell>
            <Table.Summary.Cell align='center' index={-1} className='font-bold'>
              <p>รวมทั้งสิ้น</p>
            </Table.Summary.Cell>
            {columns.map((column, index) => (
              <>
                {index === 5 ?
                  <Table.Summary.Cell key={column.key} align='center' index={index} className='bg-blue-200 font-bold'>
                    <FormattedNumber
                      value={sumData[0]}
                      style="decimal"
                      minimumFractionDigits={2}
                    />
                  </Table.Summary.Cell>
                  : index === 8 ?
                    <Table.Summary.Cell key={column.key} align='center' index={index} className='bg-yellow-200 font-bold'>
                      <FormattedNumber
                        value={sumData[index]}
                        style="decimal"
                        minimumFractionDigits={2}
                      />
                    </Table.Summary.Cell>
                    : index === 9 ?
                      <Table.Summary.Cell key={column.key} align='center' index={index} className='bg-green-200 font-bold'>
                        <FormattedNumber
                          value={sumData[index]}
                          style="decimal"
                          minimumFractionDigits={2}
                        />
                      </Table.Summary.Cell>
                      : index === 12 || index === 13 || index === 14 || index === 15 ?
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
      <div className={`${isPrintContent ? 'block' : 'hidden'} flex items-center space-x-4 py-[2rem]`}>
        <BiSolidFileExport className='w-10 h-10' />
        <h2 className='font-bold text-[1.8rem] text-white'>ตัวอย่างส่งออก</h2>
      </div>
      <div ref={contentToPrint} className={`${isPrintContent ? 'block' : 'hidden'} printable-content space-y-2 bg-white rounded-xl`}>
        <div className='rounded-lg text-black p-6 space-y-2'>
          <p className='text-end'>ปี {selectedYear}</p>
          <p>{companyName}</p>
        </div>
        <Table
          columns={columnsForPrint}
          dataSource={paymentData}
          loading={loading}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell align='center' index={-4}>
              </Table.Summary.Cell>
              <Table.Summary.Cell align='center' index={-3}>
              </Table.Summary.Cell>
              <Table.Summary.Cell align='center' index={-2}>
              </Table.Summary.Cell>
              <Table.Summary.Cell align='center' index={-1} className='font-bold'>
                <p>รวมทั้งสิ้น</p>
              </Table.Summary.Cell>
              {columns.map((column, index) => (
                <>
                  {index === 5 ?
                    <Table.Summary.Cell key={column.key} align='center' index={index} className='font-bold'>
                      <FormattedNumber
                        value={sumData[0]}
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
                        : index === 12 || index === 13 || index === 14 || index === 15 ?
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
    </IntlProvider>
  )
}
