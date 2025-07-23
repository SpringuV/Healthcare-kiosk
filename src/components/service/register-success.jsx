import html2pdf from 'html2pdf.js'
import { useRef, useState } from 'react'
import { QRCode } from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useService } from '../context/service_context'
import { useForm } from '../context/form_context'
import { useInsurrance } from '../context/insurrance_context'
function RegisterSuccess() {

    const { insurranceInfo } = useInsurrance()
    const { selectedService } = useService()
    const { formData } = useForm()
    const userInfo = insurranceInfo || formData

    // pdf
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
    const handleConfirmAndReturnHome = () => {
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
                            ['Dịch vụ khám:', `${selectedService}`],
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

// NOTE:
// Backend sẽ trả về một cái link url có chứa mã định danh, 🔹 Bước 1. Khi người dùng hoàn tất đăng ký
// Backend tạo ra một uniqueId(mã đăng ký).

// Ví dụ: abc123, dk - 202507201035 - abcd, UUID hoặc mã có tiền tố CCCD.

// 🔹 Bước 2. Trả về link
// Ví dụ:
// {
//     "message": "Đăng ký thành công",
//         "link": "https://kiosk.example.com/ket-qua/abc123"
// }
// Bạn hiển thị link này cho người dùng hoặc tạo QR code để in / quét.
//  Bước 3. Trang /ket-qua/:id truy vấn lại dữ liệu
// React (sử dụng useParams)
// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// function ResultPage() {
//   const { id } = useParams(); // Lấy 'abc123' từ URL
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     fetch(`/api/registration/${id}`)
//       .then(res => res.json())
//       .then(data => setResult(data))
//       .catch(() => alert("Không tìm thấy mã đăng ký!"));
//   }, [id]);

//   if (!result) return <div>Đang tải...</div>;

//   return (
//     <div>
//       <h1>Thông tin đăng ký khám</h1>
//       <p>Họ tên: {result.name}</p>
//       <p>Ngày đăng ký: {result.date}</p>
//       {/* Các thông tin khác */}
//     </div>
//   );
// }
export default RegisterSuccess