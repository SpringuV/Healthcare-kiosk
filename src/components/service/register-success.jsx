import html2pdf from 'html2pdf.js'
import { useRef, useState } from 'react'
import { QRCode } from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
function RegisterSuccess() {
    const printRef = useRef()
    const [pdfUrl, setPdfUrl] = useState(null)
    const handleGeneratePdf = async () => {
        const element = printRef.current
        const opt = {
            margin: 0,
            filename: 'phieu-dang-ky.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
        }

        // Tạo blob PDF
        const worker = html2pdf().set(opt).from(element);
        const pdfBlob = await worker.outputPdf('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url); // gán URL cho mã QR
    }

    const navigate = useNavigate()
    const handleConfirmAndReturnHome = ()=>{
        navigate('/')
    }

    return (
        <>
            {/* lớp phủ ngoài */}
            <div className='flex justify-center w-full  my-3 py-3'>
                <div className='bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw] flex flex-col max-h-[90vh]'>
                    {/* Header */}
                    <div className='bg-colorOne px-4 py-2 text-center text-white font-bold text-[20px] rounded-t-lg'>
                        <h3>Xác nhận thông tin đăng kí</h3>
                    </div>

                    {/* Scrollable content */}
                    <div ref={printRef} className='overflow-y-auto px-5 py-2 flex-1'>
                        <span className='flex justify-center items-center text-[25px] font-bold w-full mb-2'>PHIẾU KHÁM BỆNH</span>
                        {[
                            ['Họ và tên:', 'Nguyễn Văn A'],
                            ['Giới tính:', 'Nam'],
                            ['Ngày sinh:', '02-10-2002'],
                            ['Dịch vụ khám:', 'Khám nội tổng quát'],
                            ['CCCD:', '987654321000'],
                            ['Phòng khám:', 'Tầng 1 - Khu B, Phòng 101 - Tai Mũi Họng'],
                            ['Bác sĩ:', 'Bác sĩ Lê Văn D'],
                            ['Số phiếu đợi:', '8'],
                            ['Bảo hiểm y tế:', 'Có'],
                            ['Ngày đăng kí:', '22-07-2025'],
                        ].map(([label, value], index) => (
                            <div key={index} className='py-2 flex justify-between items-center border-b-2 text-[18px]'>
                                <label>{label}</label>
                                <span className='font-medium text-center'>{value}</span>
                            </div>
                        ))}

                        {/* QR */}
                        {pdfUrl && (
                            <div className='my-4 flex flex-col items-center justify-center'>
                                <p className="text-center text-[16px] font-medium mb-2">Quét mã QR để tải phiếu khám</p>
                                <QRCode value={pdfUrl} size={128} />
                                <a href={pdfUrl} download="phieu-dang-ky.pdf" className="mt-2 text-blue-600 underline hover:text-blue-800">Hoặc bấm vào đây để tải trực tiếp</a>
                            </div>
                        )}
                    </div>

                    {/* Footer buttons */}
                    <div className='flex justify-end rounded-b-lg px-5 py-2'>
                        <button className='text-[17px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700 ' type='button' onClick={handleConfirmAndReturnHome}>Xác nhận và về trang chủ</button>
                        <button className='ml-5 text-[17px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600' type='button' onClick={handleGeneratePdf}>In phiếu</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterSuccess