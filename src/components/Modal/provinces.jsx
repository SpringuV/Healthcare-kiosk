import { useState, useEffect } from "react"

function Provinces({ onSelect }) {
    // address
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("")
    const [selectedWard, setSelectedWard] = useState("")

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then(res => res.json())
            .then(data => setProvinces(data))
    }, [])

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setDistricts(data.districts)
                }
                )
        }
    }, [selectedProvince])

    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards))
        }
    }, [selectedDistrict])

    useEffect(() => { // người dùng chọn đủ 3 cấp thì gọi onSelect(fullAddress)
        if (selectedProvince && selectedDistrict && selectedWard) {
            const province = provinces.find(p => p.code === +selectedProvince)?.name
            const district = districts.find(d => d.code === +selectedDistrict)?.name
            const ward = wards.find(w => w.code === +selectedWard)?.name
            if (province && district && ward) {
                const fullAddress = `${ward}, ${district}, ${province}`
                onSelect(fullAddress)
            }
        }
    }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards])
    
    return (
        <>
            <div className="flex flex-col p-1">
                <label htmlFor="selectProvince">Tỉnh: </label>
                <select id="selectProvince" className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setSelectedDistrict(""); setSelectedWard("") }}>
                    <option value={""}>--- Chọn tỉnh ---</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>{province.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col p-1">
                <label htmlFor="selectDistrict">Chọn Quận/Huyện:</label>
                <select id="selectDistrict" className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedWard("") }}>
                    <option value={""}>--- Chọn Quận/Huyện ---</option>
                    {districts.map((district) => (
                        <option value={district.code} key={district.code}>{district.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col p-1">
                <label htmlFor="selectWard">Chọn Phường/Xã:</label>
                <select id="selectWard" className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" value={selectedWard} onChange={(e) => { setSelectedWard(e.target.value) }}>
                    <option value={""}>--- Chọn Phường/Xã ---</option>
                    {wards.map((ward) => (
                        <option value={ward.code} key={ward.code}>{ward.name}</option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default Provinces