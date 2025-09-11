import { Helmet } from "react-helmet-async"
import { useSelector } from "react-redux"
import { select_history_booking_data } from "../../reducers"
import DataTable from "./data_table"
import InfoUser from "./info_user"
import { Switch } from "antd"
import { useEffect, useState } from "react"
import DataGridList from "./data_grid_list"
function ResultSearch() {
    // State quản lý
    const patient_history_booking = useSelector(select_history_booking_data)
    const patient = patient_history_booking?.patient
    const [isTable, setIsTable] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    const handleChangeDisplay = () => {
        setIsTable(!isTable)
    }

    const handleChangeDisplayInfo = () => {
        setShowInfo(!showInfo)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true)
                // ép về Grid nếu là mobile
                setIsTable(false)
            } else {
                setIsMobile(false)
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="mx-[5%] bg-white p-3 rounded-lg mb-20">
            {patient ? (
                <>
                    <Helmet>
                        <title>Lịch sử khám bệnh</title>
                    </Helmet>
                    <div className="flex items-center justify-between mb-3 w-full">
                        <h1 className="text-center text-lg md:text-2xl lg:text-3xl font-semibold w-5/6 flex-1">Thông tin người khám</h1>
                        <div className="flex justify-center items-center h-full">
                            <h3 className="text-base">Thông tin: &nbsp;</h3>
                            <Switch onClick={handleChangeDisplayInfo} checkedChildren="Hiện" unCheckedChildren="Ẩn"></Switch>
                        </div>
                    </div>
                    {showInfo && (
                        <InfoUser patient={patient} />
                    )}
                    <br />
                    <div className="flex items-center justify-between mb-5 w-full">
                        <h1 className="text-center text-lg md:text-2xl lg:text-3xl font-semibold w-5/6 flex-1">Lịch sử khám bệnh</h1>
                        <div className="flex justify-center items-center h-full">
                            {isMobile == false ? (
                                <>
                                    <h3>Kiểu: &nbsp;</h3>
                                    <Switch onClick={handleChangeDisplay} checkedChildren="Bảng" unCheckedChildren="Lưới"></Switch>
                                </>
                            ) : (<></>)}
                        </div>
                    </div>
                    {isTable == true ? (
                        <DataTable data_patient_history_booking={patient_history_booking} />
                    ) : (
                        <DataGridList data_patient_history_booking={patient_history_booking} />
                    )}
                </>
            ) : (
                <div className="text-center text-red-500 font-bold">
                    Không có thông tin người khám
                </div>
            )}
        </div>
    )
}

export default ResultSearch