import React from 'react';
import { useStateStep } from '../context/state_step_context';

function StateStep() {
    // Lấy state hiện tại và loại flow từ context
    const { stateStep, flowType } = useStateStep()

    // Định nghĩa các bước theo loại flow
    const steps = flowType === "non-insurance"
        ? [
            { id: 1, title: "KIỂM TRA THÔNG TIN" },
            { id: 2, title: "CHỌN DỊCH VỤ" },
            { id: 3, title: "THANH TOÁN" },
            { id: 4, title: "IN PHIẾU" }
        ]
        : [
            { id: 1, title: "KIỂM TRA THÔNG TIN" },
            { id: 2, title: "CHỌN DỊCH VỤ" },
            { id: 3, title: "IN PHIẾU" }
        ]

    // Xác định trạng thái của từng bước dựa trên step hiện tại
    const getStepStatus = (stepId) => {
        if (stepId < stateStep) return 'completed'    // Đã hoàn thành
        if (stepId === stateStep) return 'current'    // Đang thực hiện
        return "upcoming"                             // Chưa thực hiện
    }

    // Thiết lập CSS classes cho circle của từng bước
    const getStepClasses = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500 text-white border-green-500'    // Xanh lá - đã xong
            case 'current':
                return 'bg-green-500 text-white border-green-500'    // Xanh lá - đang làm
            case 'upcoming':
                return 'bg-gray-300 text-gray-600 border-gray-300'   // Xám - chưa làm
            default:
                return 'bg-gray-300 text-gray-600 border-gray-300'
        }
    }

    // Thiết lập màu cho đường nối giữa các bước
    // Lưu ý: Sửa logic để đường line hiển thị đúng
    const getLineClasses = (stepId) => {
        // Đường line sau step hiện tại sẽ xanh nếu step đó đã completed, và hiển thị xanh cho line tiếp
        return stepId <= stateStep ? 'bg-green-500' : 'bg-gray-300';
    }

    // Thiết lập CSS classes cho title của từng bước  
    const getTitleClasses = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 font-semibold'     // Xanh đậm - đã hoàn thành
            case 'current':
                return 'text-green-600 font-bold'         // Xanh đậm và đậm - đang thực hiện
            case 'upcoming':
                return 'text-gray-500 font-medium'        // Xám - chưa thực hiện
            default:
                return 'text-gray-500 font-medium'
        }
    }

    return (
        <>
            {/* Container chính cho step progress */}
            <div className="w-full px-4 mb-6 mt-1 md:mt-3">
                {/* Flex container cho các steps */}
                <div className="flex items-start justify-between max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Step Circle và Title */}
                            <div className='w-28'>
                                <div className="flex flex-col items-center">
                                    {/* Circle hiển thị số bước */}
                                    <div className={` w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-bold border-2 transition-all duration-1000 ${getStepClasses(getStepStatus(step.id))}`}>
                                        {step.id}
                                    </div>
                                    {/* Title của bước */}
                                    <span className={`mt-2 text-xs md:text-sm text-center max-w-[120px] leading-tight transition-all duration-1000 ${getTitleClasses(getStepStatus(step.id))}`}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>

                            {/* Đường nối giữa các bước (không hiển thị cho bước cuối) */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 flex items-center h-12 md:h-14">
                                    <div className={`w-full h-1 transition-all duration-500 ${getLineClasses(step.id)}`} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    )
}

export default StateStep;