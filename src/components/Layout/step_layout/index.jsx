import Header from "../../Header"
import StateStep from "../../state-step"
import { Outlet } from "react-router-dom"
import { useState } from "react"

function LayoutWithStep() {
    const [stateStep, setStateStep] = useState(1);

    return (
        <>
            <header>
                <Header />
            </header>

            <main>
                <StateStep step={stateStep} />
                <Outlet context={{ stateStep, setStateStep }}/>
            </main>

            <footer>
                {/* Footer content */}
            </footer>
        </>
    )
}

export default LayoutWithStep
