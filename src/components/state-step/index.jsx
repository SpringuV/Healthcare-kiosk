import React from 'react';
function StateStep({step}) {
    const steps = [
        { id: 1, title: "Thông tin bệnh nhân" },
        { id: 2, title: "Chọn dịch vụ khám" },
        { id: 3, title: "In phiếu" }
    ]
    return (
        <>
            <div className="grid grid-cols-3 gap-1 md:flex md:justify-evenly items-center lg:gap-3 w-screen text-colorOneDark px-1 mb-3">
                {steps.map((item) => (
                    <React.Fragment key={item.id}>
                        <div className="flex md:min-w-[15vw] justify-center items-center flex-col text-center text-[12px] font-semibold md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[16px]">
                            <span className={`w-16 h-16 md:w-24 md:h-24 inline-flex justify-center text-center items-center p-2 rounded-full ${step === item.id ? "bg-green-400 ease-in-out text-white" : "bg-colorOneLighter"}`}> BƯỚC {item.id} </span>
                            <span>{item.title}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </>
    )

}
export default StateStep