import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"

interface CardTitleProps {
    title: string
    children?: ReactNode
}

export const CardTitle = ({ title, children }: CardTitleProps) => {
    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography fontWeight="bold" variant="h6" m={2}>
                {title}
            </Typography>
            {children}
        </Paper>
    )
}
