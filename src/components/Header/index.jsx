function Header() {
    return (
        <>
            <div className='fixed top-0 flex p-4 w-full bg-colorOne'>
                <h1 className='flex-1 text-center text-white font-extrabold text-[30px]'>BỆNH VIỆN THẬN HÀ NỘI</h1>
                <div className='w-[50px] flex items-center justify-end'>
                    <a className='text-white'><i className='fa-solid fa-house'></i></a>
                </div>
            </div>
        </>
    )
}

export default Header