import Header from "../../Header"
import StateStep from "../../state-step"
import { Outlet } from "react-router-dom"
function LayoutHome() {

    return (
        <>
            <header>
                <Header />
            </header>

            <main>
                {/* The main content will be rendered here */}
                <Outlet />
            </main>
            <footer>
                {/* Footer content can be added here */}
            </footer>
        </>
    )
}

export default LayoutHome