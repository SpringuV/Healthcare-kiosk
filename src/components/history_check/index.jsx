import { useLocation } from "react-router-dom"

function ResultSearch(){
    const location = useLocation()
    const state = location.state
    console.log(state)
    return (
        <>
            REsult Search
        </>
    )
}

export default ResultSearch