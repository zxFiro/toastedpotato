import type { GetServerSideProps } from 'next'
import dynamic from "next/dynamic";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";

//remover los siguientes 6 importaciones cuando se implemente el fetch en getserversideprops, falta la url de la db con la query correspondiente
import ejercicio1 from "../tutor/fracciones/fracc1.json";
import ejercicio2 from "../tutor/fracciones/fracc2.json";
import ejercicio3 from "../tutor/potencias/pot1.json";
import ejercicio4 from "../tutor/potencias/pot2.json";
import ejercicio5 from "../tutor/potencias/pot3.json";
import ejercicio6 from "../tutor/potencias/pot4.json";


const Lvltutor = dynamic(
    () => {
      return import("../components/lvltutor/Tools/Solver2");
    },
    { ssr: false },
);

export const Plainb = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
    let a:string=topicId as string;
    a="1";
    return (
        <>
      {steps?.type == "lvltutor" ? (
            <Lvltutor key={a} topicId={a} steps={steps} />
        ) : (
            "potato"
        )}
    </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    //const router = useRouter();
    const pid  = await context.query.pid as string;

    
    let e:ExType=ejercicio1 as ExType;

    switch(pid) {
        case "e1":
            e=ejercicio1 as ExType;
            break;
        case "e2":
            e=ejercicio2 as ExType;
            break;
        case "e3":
            e=ejercicio3 as ExType;
            break;
        case "e4":
            e=ejercicio4 as ExType;
            break;
        case "e5":
            e=ejercicio5 as ExType;
            break;
        case "e6":
            e=ejercicio6 as ExType;
            break;
        default:
            e=ejercicio1 as ExType;
    } 

    //Agregar la url con la query a la db de manera segura aqui, eliminar el switch y clase de arriba
    //const res = await fetch(load)
    //const ejercicio = await res.json()

    return {
      props: {steps:e}, // will be passed to the page component as props
    }
}

export default Plainb;

