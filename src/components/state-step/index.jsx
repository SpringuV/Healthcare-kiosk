import React from 'react';
function StateStep({step}) {
    const steps = [
        { id: 1, title: "Thông tin bệnh nhân" },
        { id: 2, title: "Lựa chọn dịch vụ khám" },
        { id: 3, title: "In phiếu" }
    ]
    return (
        <>
            <div className="flex justify-center items-center gap-3 w-full text-colorOneDark my-3">
                {steps.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <div className="font-semibold text-[20px] flex justify-center items-center">
                            <span className={`w-[90px] h-[90px] inline-flex justify-center items-center p-2 rounded-full mr-2 ${step === item.id ? "bg-green-400 ease-in-out text-white" : "bg-colorOneLighter"}`}> BƯỚC {item.id} </span>
                            <span>{item.title}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="font-semibold text-[20px] mx-2">-----&gt;</div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    )

}
export default StateStep