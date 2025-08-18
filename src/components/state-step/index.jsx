import React from 'react';
function StateStep({step}) {
    const steps = [
        { id: 1, title: "KIỂM TRA THÔNG TIN" },
        { id: 2, title: "CHỌN DỊCH VỤ" },
        { id: 3, title: "IN PHIẾU" }
    ]
    return (
        <>
            <div className="grid grid-cols-3 gap-1 md:flex md:justify-evenly items-center md:mt-2 lg:gap-3 w-full text-colorOneDark px-1 mb-3">
                {steps.map((item) => (
                    <React.Fragment key={item.id}>
                        <div className="h-full flex md:min-w-[15vw] justify-start items-center flex-col text-center text-[12px] font-semibold md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]">
                            <span className={`w-16 h-16 md:w-24 md:h-24 inline-flex justify-center text-center items-center p-2 bg-gradient-to-r rounded-full ${step === item.id ? "from-green-500 to-emerald-500 ease-in-out text-white italic" : "from-teal-600 to-emerald-600 text-white"}`}> BƯỚC {item.id} </span>
                            <span className={`mt-2 px-0.5 rounded-md text-[14px] font-semibold md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] ${step === item.id ? " italic font-extrabold " : ""}`}>{item.title}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </>
    )

}
export default StateStep