import {
    LocalFireDepartment,
    CheckCircleOutline,
    OpenInFull,
} from "@mui/icons-material"
import { useMemo, useState } from "react"
import { SecretAlert } from "../../typesFrontend"
import { SecretsDialog } from "./SecretsDialog"
import IconButton from "@mui/material/IconButton"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"

export interface Secrets {
    componentName: string
    alerts: SecretAlert[]
}

export interface SecretProps {
    secretsOverviewData: Secrets[]
}

export const SecretsAlert = ({ secretsOverviewData }: SecretProps) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [onHover, setOnHover] = useState<boolean>(false)

    const reposWithAlerts = useMemo(
        () => secretsOverviewData.filter((r) => r.alerts.length > 0),
        [secretsOverviewData],
    )

    const totalExposedSecrets = secretsOverviewData.reduce(
        (sum, { alerts }) => sum + alerts.length,
        0,
    )

    const hasSecrets = totalExposedSecrets > 0

    const openDialogBox = () => {
        if (hasSecrets) {
            setOpenDialog(true)
        }
    }

    const closeDialogBox = () => {
        setOpenDialog(false)
    }

    const zeroSecretsInfo: string = `Ingen hemmeligheter eksponert`
    const secretsInfo: string = `${totalExposedSecrets} hemmelighet${totalExposedSecrets !== 1 ? "er" : ""} eksponert. Klikk for å se mer.`

    return (
        <>
            <Alert
                severity={hasSecrets ? "error" : "success"}
                icon={
                    hasSecrets ? (
                        <LocalFireDepartment />
                    ) : (
                        <CheckCircleOutline />
                    )
                }
                action={
                    hasSecrets && (
                        <IconButton
                            children={<OpenInFull fontSize="small" />}
                            color="inherit"
                            onClick={openDialogBox}
                        />
                    )
                }
                onClick={openDialogBox}
                onMouseEnter={() => {
                    setOnHover(true)
                }}
                onMouseLeave={() => {
                    setOnHover(false)
                }}
                sx={{
                    cursor: onHover && hasSecrets ? "pointer" : "",
                    boxShadow:
                        onHover && hasSecrets
                            ? "5px 5px 10px 0 rgba(0, 0, 0, 0.1)"
                            : "none",
                }}
            >
                <AlertTitle>
                    {hasSecrets ? secretsInfo : zeroSecretsInfo}
                </AlertTitle>
            </Alert>
            <SecretsDialog
                secretsOverviewData={reposWithAlerts}
                openDialog={openDialog}
                closeDialogBox={closeDialogBox}
            />
        </>
    )
}
