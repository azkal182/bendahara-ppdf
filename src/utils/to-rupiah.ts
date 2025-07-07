export function toRupiah(amount: number): string {
  // Menggunakan Intl.NumberFormat untuk memformat ke IDR tanpa simbol mata uang
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  // Menambahkan prefix "Rp" dan memformat angka
  return `Rp ${formatter.format(amount)}`
}
