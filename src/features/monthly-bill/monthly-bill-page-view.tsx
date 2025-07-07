'use client'

import type { SyntheticEvent } from 'react'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import type { SelectChangeEvent } from '@mui/material'
import { Card, CardContent, CircularProgress, MenuItem, Tab, Typography } from '@mui/material'

import TabList from '@mui/lab/TabList'

import TabPanel from '@mui/lab/TabPanel'

import TabContext from '@mui/lab/TabContext'

import MonthlyBillTable from './components/monthly-bill-table'
import MonthYearPicker from '@/components/MonthYearPicker'
import { getMonthlyBillsByDivisionId, getMonthlyDivisionBills } from '@/actions/monthly-division-bill-action'
import type { MonthlyDivisionBillResponse } from '@/actions/monthly-division-bill-action'
import CustomTextField from '@/@core/components/mui/TextField'
import type { ResponseDivision } from '@/actions/divisi-action'
import { getDivisi } from '@/actions/divisi-action'

const MonthlyBillPageView = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const now = new Date()
  const defaultMonth = now.getMonth() + 1 // 1-based
  const defaultYear = now.getFullYear()

  const [data, setData] = useState<MonthlyDivisionBillResponse[] | null>(null)
  const [loading, setLoading] = useState(true)

  const monthParam = parseInt(searchParams.get('month') || `${defaultMonth}`, 10)
  const yearParam = parseInt(searchParams.get('year') || `${defaultYear}`, 10)
  const [value, setValue] = useState<string>('1')
  const [divisi, setDivisi] = useState<ResponseDivision[]>([])
  const [divisiData, setDivisiData] = useState<MonthlyDivisionBillResponse[]>([])

  const fetchDivisi = async () => {
    const data = await getDivisi()

    setDivisi(data)
  }

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  // Update URL jika param belum ada (hanya sekali)
  useEffect(() => {
    const url = new URLSearchParams(searchParams.toString())
    let shouldUpdate = false

    if (!searchParams.get('month')) {
      url.set('month', defaultMonth.toString())
      shouldUpdate = true
    }

    if (!searchParams.get('year')) {
      url.set('year', defaultYear.toString())
      shouldUpdate = true
    }

    if (shouldUpdate) {
      router.replace(`?${url.toString()}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch data berdasarkan month & year
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const result = await getMonthlyDivisionBills(yearParam, monthParam)

      setData(result)
      setLoading(false)
    }

    fetch()
  }, [monthParam, yearParam])

  useEffect(() => {
    fetchDivisi()
  }, [])

  const handleChange = (month: number, year: number) => {
    const url = new URLSearchParams(searchParams.toString())

    url.set('month', (month + 1).toString()) // month from picker is 0-based
    url.set('year', year.toString())
    router.push(`?${url.toString()}`)
  }

  const handleDivisionChange = async (divisionId: SelectChangeEvent) => {
    const result = await getMonthlyBillsByDivisionId(divisionId.target.value)

    setDivisiData(result)
  }

  return (
    <div>
      <TabContext value={value}>
        <TabList variant='standard' onChange={handleChangeTab} aria-label='full width tabs example'>
          <Tab value='1' label='Bulanan' />
          <Tab value='2' label='Per Divisi' />
        </TabList>
        <TabPanel value='1'>
          <Card className='mt-4'>
            <CardContent>
              <MonthYearPicker defaultMonth={monthParam - 1} defaultYear={yearParam} onChange={handleChange} />
              {loading ? (
                <div className='mt-4 flex justify-center'>
                  <CircularProgress />
                </div>
              ) : (
                <MonthlyBillTable data={data ?? []} />
              )}
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value='2'>
          <Card>
            <CardContent>
              <CustomTextField
                size='small'
                sx={{ width: '200px' }}
                fullWidth
                select
                placeholder='select'
                label='Divisi'
                defaultValue={''}
                slotProps={{
                  select: {
                    onChange: handleDivisionChange
                  }
                }}
              >
                <MenuItem value=''>NONE</MenuItem>
                {divisi?.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
              <MonthlyBillTable data={divisiData ?? []} monthAndYear={true} />
            </CardContent>
          </Card>
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default MonthlyBillPageView
