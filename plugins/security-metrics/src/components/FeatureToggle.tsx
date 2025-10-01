import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import { useContext } from "react"
import { AppContext } from "./AppContext"

const FeatureToggle = () => {
    const { isUsingNewFeature, setIsUsingNewFeature } = useContext(AppContext)
    return (
        <FormControlLabel
            control={
                <Switch
                    onChange={() =>
                        isUsingNewFeature
                            ? setIsUsingNewFeature(false)
                            : setIsUsingNewFeature(true)
                    }
                />
            }
            label="Ny feature"
        />
    )
}

export default FeatureToggle
