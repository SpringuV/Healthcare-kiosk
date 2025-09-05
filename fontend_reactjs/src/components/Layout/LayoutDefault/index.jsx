import Header from "../../Header"
import StateStep from "../../state-step"
import { Outlet } from "react-router-dom"
import { useState } from "react"
function LayoutDefault({ flowType }) {

    const [stateStep, setStateStep] = useState(1);
    return (
        <>
            <header>
                <Header />
            </header>

            <main>
                <StateStep step={stateStep} flowType={flowType} />
                {/* The main content will be rendered here */}
                <Outlet context={{ stateStep, setStateStep, flowType  }}/>
            </main>
            <footer>
                {/* Footer content can be added here */}
            </footer>
        </>
    )
}

export default LayoutDefault