import { render, screen } from "@testing-library/react"
import { ErrorBanner } from "../components/ErrorBanner"

describe("getErrorAlert", () => {
    it("should render the correct message for 401 input", () => {
        render(
            <ErrorBanner errorMessage="Du har ikke tilgang til å se denne ressursen." />,
        )
        const alertElement = screen.getByRole("alert")
        expect(alertElement).toHaveTextContent(
            "Du har ikke tilgang til å se denne ressursen.",
        )
    })

    it("should render the correct message for other inputs", () => {
        render(<ErrorBanner />)
        const alertElement = screen.getByRole("alert")
        expect(alertElement).toHaveTextContent(
            "En uventet feil oppsto. Vennligst prøv igjen senere.",
        )
    })
})
