// === Export KHS ke PDF ===
"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { mataKuliahData, mahasiswaData, riwayatIPSData } from "@/lib/mock-data"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Konversi huruf mutu ke angka
function nilaiToAngka(nilai: string | null): number {
  if (!nilai) return 0
  const map: Record<string, number> = {
    "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D": 1.0, "E": 0,
  }
  return map[nilai] ?? 0
}

export function ExportKHSButton() {
  const handleExport = () => {
    const mhs = mahasiswaData
    const doc = new jsPDF({ unit: "mm", format: "a4" })

    // === Header ===
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("KARTU HASIL STUDI (KHS)", 105, 18, { align: "center" })
    
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("UPN Veteran Jawa Timur", 105, 24, { align: "center" })
    
    doc.setDrawColor(34, 197, 94) // green-500
    doc.setLineWidth(0.8)
    doc.line(15, 28, 195, 28)

    // === Info Mahasiswa ===
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    const infoY = 35
    const col1X = 15
    const col2X = 115

    doc.text(`Nama          : ${mhs.nama}`, col1X, infoY)
    doc.text(`NPM           : ${mhs.npm}`, col1X, infoY + 5)
    doc.text(`Program Studi : ${mhs.prodi}`, col1X, infoY + 10)
    doc.text(`Fakultas      : ${mhs.fakultas}`, col1X, infoY + 15)

    doc.text(`Semester  : ${mhs.semester}`, col2X, infoY)
    doc.text(`Angkatan  : ${mhs.angkatan}`, col2X, infoY + 5)
    doc.text(`Status    : ${mhs.status}`, col2X, infoY + 10)

    // === Tabel Mata Kuliah ===
    const tableData = mataKuliahData.map((mk, i) => [
      (i + 1).toString(),
      mk.kode,
      mk.nama,
      mk.sks.toString(),
      mk.nilai ?? "-",
      nilaiToAngka(mk.nilai).toFixed(1),
      (mk.sks * nilaiToAngka(mk.nilai)).toFixed(1),
    ])

    autoTable(doc, {
      startY: 58,
      head: [["No", "Kode", "Mata Kuliah", "SKS", "Nilai", "Bobot", "Mutu"]],
      body: tableData,
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 60 },
        3: { halign: "center", cellWidth: 15 },
        4: { halign: "center", cellWidth: 15 },
        5: { halign: "center", cellWidth: 15 },
        6: { halign: "center", cellWidth: 15 },
      },
      margin: { left: 15, right: 15 },
      theme: "grid",
    })

    // === Summary di bawah tabel ===
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(`IPK: ${mhs.ipk.toFixed(2)}`, 15, finalY)
    doc.text(`IPS: ${mhs.ips.toFixed(2)}`, 55, finalY)
    doc.text(`SKS Lulus: ${mhs.sksLulus}`, 95, finalY)
    doc.text(`SKS Maksimal: ${mhs.sksMaksimal}`, 140, finalY)

    // === Riwayat IPS per semester ===
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Riwayat IPS per Semester", 15, finalY + 12)

    autoTable(doc, {
      startY: finalY + 16,
      head: [["Semester", "IPS", "IPK Kumulatif", "SKS Semester"]],
      body: riwayatIPSData.map((r) => [
        r.semester,
        r.ips.toFixed(2),
        r.ipk.toFixed(2),
        r.sks.toString(),
      ]),
      headStyles: {
        fillColor: [59, 130, 246], // blue-500
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: { fontSize: 8, halign: "center" },
      margin: { left: 15, right: 15 },
      theme: "grid",
    })

    // === Footer ===
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(150)
    doc.text(
      `Dicetak dari MY UPN v4.0 — ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
      105,
      pageHeight - 10,
      { align: "center" }
    )

    // === Simpan file ===
    doc.save(`KHS_${mhs.npm}_Semester${mhs.semester}.pdf`)
    toast.success("KHS berhasil diunduh!", {
      description: `File: KHS_${mhs.npm}_Semester${mhs.semester}.pdf`,
    })
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
    >
      <FileDown size={16} />
      <span className="text-xs font-bold">Export KHS (PDF)</span>
    </Button>
  )
}
