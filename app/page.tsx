"use client"

import Link from 'next/link';

import CompanyTable from "@/components/table/companyTable";

import { Input } from 'antd';

import { IoIosAddCircle } from "react-icons/io";
import { useState } from 'react';
import { ImBooks } from 'react-icons/im';

import "./globals.css";
import { useEffect } from "react";
import LoginModal from "@/components/form/LoginForm";

export default function Home() {
  const [searchCompany, setSearchCompany] = useState<string>('')

  const accessToken = localStorage.getItem('accessACPN');

  useEffect(() => {
    if (accessToken !== 'true') {
      setModalVisible(true);
    } else {
      setModalVisible(false);

    }
  }, [accessToken]);

  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      {modalVisible ?
        <LoginModal visible={modalVisible} onClose={handleCloseModal} />
        :
        <div className="bg-slate-900 rounded-2xl drop-shadow-xl p-[2rem] xl:mx-[4rem] xl:my-[2rem] md:mx-[2rem] md:my-[2rem] mx-[1rem] my-[1rem]">
          <div className='xl:space-y-[2rem] space-y-[1rem]'>
            <div className='xl:flex xl:justify-between xl:items-center xl:space-y-0 space-y-4'>
              <div className='flex items-center lg:space-x-4 space-x-2'>
                <ImBooks className='lg:w-10 lg:h-10 w-8 h-8 text-white' />
                <h2 className='lg:text-[1.8rem] text-[1.3rem] font-bold text-white'>ระบบจัดการข้อมูลบัญชีบริษัท</h2>
              </div>
              <div className='xl:flex xl:items-center xl:space-x-4 xl:space-y-0 space-y-4'>
                <Input type='number' onChange={(e) => setSearchCompany(e.target.value)} className='xl:w-[30rem] text-[1rem] h-[2.6rem] rounded-xl' placeholder="ค้นหาสถานประกอบการด้วยเลขประจำตัวผู้เสียภาษี..." allowClear />
                <Link href={'/company/add'} className='h-full flex justify-center items-center space-x-2 p-2 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-xl hover:scale-105 duration-300'>
                  <IoIosAddCircle className='w-6 h-6' />
                  <span className='text-[1rem]'>เพิ่มข้อมูล</span>
                </Link>
              </div>
            </div>
            <div>
              <CompanyTable searchCompany={searchCompany} />
            </div>
          </div>
        </div>
      }
    </>
  );
}

export function getCookie(name: string) {
  const cookieValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return cookieValue ? cookieValue[2] : null;
}