import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps } from "@mui/material/Tooltip"

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} slotProps={{ tooltip: { className: className } }} />
))(`
    color: black;
    background-color: white;
    font-size: 16px;
    max-width: 750px;
    padding: 8px;
    word-wrap: break-word;
    border: 1px solid black;
`)
