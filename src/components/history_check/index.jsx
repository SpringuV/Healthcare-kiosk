import { useLocation } from "react-router-dom"

function ResultSearch(){
    const location = useLocation()
    const state = location.state
    console(state)
    return (
        <>
            REsult Search
        </>
    )
}

export default ResultSearch