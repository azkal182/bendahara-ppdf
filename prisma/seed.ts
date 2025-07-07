import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await hash('password', 10)

  // 1. Buat akun default untuk Divisi A (income & expense)
  const akunPemasukanDivisi = await prisma.account.create({
    data: {
      name: 'Kas Masuk Divisi A',
      type: 'INCOME',
      isCentral: false
    }
  })

  const akunPengeluaranDivisi = await prisma.account.create({
    data: {
      name: 'Operasional Divisi A',
      type: 'EXPENSE',
      isCentral: false
    }
  })

  // 2. Buat Divisi A dan hubungkan akun default
  const divisiA = await prisma.division.create({
    data: {
      name: 'Divisi A',
      incomeAccount: { connect: { id: akunPemasukanDivisi.id } },
      expenseAccount: { connect: { id: akunPengeluaranDivisi.id } },
      accounts: {
        connect: [{ id: akunPemasukanDivisi.id }, { id: akunPengeluaranDivisi.id }]
      }
    }
  })

  // Update account dengan divisionId
  await prisma.account.updateMany({
    where: {
      id: { in: [akunPemasukanDivisi.id, akunPengeluaranDivisi.id] }
    },
    data: {
      divisionId: divisiA.id
    }
  })

  // 3. Buat akun pusat (income & expense)
  const akunPusatMasuk = await prisma.account.create({
    data: {
      name: 'Kas Masuk Pusat',
      type: 'INCOME',
      isCentral: true
    }
  })

  const akunPusatKeluar = await prisma.account.create({
    data: {
      name: 'Pengeluaran Pusat',
      type: 'EXPENSE',
      isCentral: true
    }
  })

  // 4. Buat user Pusat
  const pusat = await prisma.user.create({
    data: {
      username: 'pusat',
      name: 'Pusat',
      password: passwordHash,
      role: 'PUSAT'
    }
  })

  // 5. Buat user Divisi
  const userDivisi = await prisma.user.create({
    data: {
      username: 'divisia',
      name: 'Divisi A',
      password: passwordHash,
      role: 'DIVISI',
      divisionId: divisiA.id
    }
  })

  // 6. Transaksi pemasukan Divisi
  await prisma.transaction.create({
    data: {
      accountId: akunPemasukanDivisi.id,
      divisionId: divisiA.id,
      amount: 2000000,
      description: 'Pemasukan donasi',
      type: 'INCOME',
      userId: userDivisi.id
    }
  })

  // 7. Transaksi pengeluaran Divisi
  await prisma.transaction.create({
    data: {
      accountId: akunPengeluaranDivisi.id,
      divisionId: divisiA.id,
      amount: 500000,
      description: 'Beli ATK',
      type: 'EXPENSE',
      userId: userDivisi.id
    }
  })

  // 8. Setoran dari divisi ke pusat
  const fromTx = await prisma.transaction.create({
    data: {
      accountId: akunPengeluaranDivisi.id,
      divisionId: divisiA.id,
      amount: 800000,
      description: 'Setor ke pusat',
      type: 'EXPENSE',
      userId: pusat.id
    }
  })

  const toTx = await prisma.transaction.create({
    data: {
      accountId: akunPusatMasuk.id,
      amount: 800000,
      description: 'Penerimaan dari Divisi A',
      type: 'INCOME',
      userId: pusat.id
    }
  })

  await prisma.transferToCentral.create({
    data: {
      fromDivisionId: divisiA.id,
      amount: 800000,
      description: 'Setoran bulan Mei dari Divisi A',
      fromTransactionId: fromTx.id,
      toTransactionId: toTx.id
    }
  })

  // 9. Pusat melakukan pengeluaran
  await prisma.transaction.create({
    data: {
      accountId: akunPusatKeluar.id,
      amount: 300000,
      description: 'Biaya sewa gedung wisuda',
      type: 'EXPENSE',
      userId: pusat.id
    }
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
