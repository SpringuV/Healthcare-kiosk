function Header() {
    return (
        <>
            <div className='fixed top-0 flex p-4 w-full bg-colorOne z-[1000]'>
                <h1 className='flex-1 text-center text-white font-extrabold sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[28px] 2xl:text-[31px] '>BỆNH VIỆN THẬN HÀ NỘI</h1>
                <div className='flex items-center justify-end'>
                    <a className='text-white'><i className='fa-solid fa-house'></i></a>
                </div>
            </div>
        </>
    )
}

export default Header