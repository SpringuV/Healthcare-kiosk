import Header from "../../Header"
import StateStep from "../../state-step"
import { Outlet } from "react-router-dom"
import { useState } from "react"
function LayoutDefault() {

    const [stateStep, setStateStep] = useState(1);
    return (
        <>
            <header>
                <Header />
            </header>

            <main>
                <StateStep step={stateStep} />
                {/* The main content will be rendered here */}
                <Outlet context={{ stateStep, setStateStep }}/>
            </main>
            <footer>
                {/* Footer content can be added here */}
            </footer>
        </>
    )
}

export default LayoutDefault