import Header from "../../Header"
import StateStep from "../../state-step"
import { Outlet, useOutletContext } from "react-router-dom"
function LayoutDefault() {
    const outletContext = useOutletContext?.() || {}
    const stateStep = outletContext.stateStep || 1;
    return (
        <>
            <header>
                <Header />
            </header>

            <main>
                <StateStep step={stateStep} />
                {/* The main content will be rendered here */}
                <Outlet />
            </main>
            <footer>
                {/* Footer content can be added here */}
            </footer>
        </>
    )
}

export default LayoutDefault