'use client'

import { useState, useEffect, useRef } from 'react'

import { Box, FormControl, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material'

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

const getCurrentYear = () => new Date().getFullYear()
const getCurrentMonth = () => new Date().getMonth()

interface MonthYearPickerProps {
  defaultMonth?: number
  defaultYear?: number
  onChange?: (month: number, year: number) => void
}

export default function MonthYearPicker({ defaultMonth, defaultYear, onChange }: MonthYearPickerProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const nowMonth = getCurrentMonth()
  const nowYear = getCurrentYear()

  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth ?? nowMonth)
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear ?? nowYear)

  const hasFiredDefault = useRef(false)

  useEffect(() => {
    if (!hasFiredDefault.current) {
      onChange?.(defaultMonth ?? nowMonth, defaultYear ?? nowYear)
      hasFiredDefault.current = true
    }
  }, [defaultMonth, defaultYear, onChange])

  const handleMonthChange = (event: any) => {
    const month = event.target.value

    setSelectedMonth(month)
    onChange?.(month, selectedYear)
  }

  const handleYearChange = (event: any) => {
    const year = event.target.value

    setSelectedYear(year)
    onChange?.(selectedMonth, year)
  }

  const yearOptions = Array.from({ length: getCurrentYear() - 2025 + 2 }, (_, i) => 2025 + i)

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200
      }
    }
  }

  return (
    <Box display='flex' flexDirection={isMobile ? 'column' : 'row'} gap={4} width='100%'>
      <FormControl size='small' fullWidth={isMobile} sx={!isMobile ? { minWidth: 150 } : undefined}>
        <InputLabel id='month-label'>Bulan</InputLabel>
        <Select
          labelId='month-label'
          value={selectedMonth}
          label='Bulan'
          onChange={handleMonthChange}
          MenuProps={menuProps}
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={index}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size='small' fullWidth={isMobile} sx={!isMobile ? { minWidth: 150 } : undefined}>
        <InputLabel id='year-label'>Tahun</InputLabel>
        <Select
          labelId='year-label'
          value={selectedYear}
          label='Tahun'
          onChange={handleYearChange}
          MenuProps={menuProps}
        >
          {yearOptions.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
