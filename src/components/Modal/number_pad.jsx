function NumberPad({ onClose, onInput }) {
    return (
        <>
            <div className="grid grid-cols-3 gap-3 p-3 bg-colorBody rounded-lg shadow-lg place-items-center h-fit">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((text, index) => (
                    <button type="button" onClick={() => onInput(text)} className="px-3 py-1 border-2 w-full h-full bg-colorOne hover:bg-blue-700 rounded-md text-colorBody text-[20px]" key={index}>{text}</button>
                ))}
                <div onClick={() => onInput('delete')} className="flex justify-center items-center px-3 py-1 border-2 w-full h-full bg-red-600 hover:bg-blue-700 rounded-md text-colorBody text-[20px]">
                    <i className="fa-solid fa-xmark"></i>
                </div>
                <button type="button" onClick={() => onInput(0)} className="flex justify-center items-center px-3 py-1 border-2 w-full h-full bg-colorOne hover:bg-blue-700 rounded-md text-colorBody text-[20px]">0</button>
                <div className="flex justify-center items-center px-3 py-1 border-2 w-full h-full hover:bg-green-700 bg-blue-700 rounded-md text-colorBody text-[20px]" onClick={onClose}>
                    <i className="fa-solid fa-right-to-bracket"></i>
                </div>
            </div>
        </>
    )
}

export default NumberPad