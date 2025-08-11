import carmentisLogoDarkUrl from "@/assets/carmentis-logo-dark.svg";
import {HTMLAttributes} from "react";

export default function CarmentisLogoDark(props: HTMLAttributes<any>) {
    return <img
        src={carmentisLogoDarkUrl}
        alt="Carmentis"
        {...props}
    />
}