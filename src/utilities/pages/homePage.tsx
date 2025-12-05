import { useChangeColor } from '@/utilities/hooks/useChangeColor';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import AutoPlay from "embla-carousel-autoplay"
import { useRef, useState, useEffect } from 'react'

const carouselItems = [
    {
        imageSrc: "/carousel/image1.webp",
        altText: "Imagen de calidad",
        text: "Acelere su proyecto. Proceso fluido, precisión incomparable, velocidad inmejorable. Convierta su diseño en realidad comenzando su viaje con nosotros hoy."
    },
    {
        imageSrc: "/carousel/image2.webp",
        altText: "Imagen de precisión",
        text: "Corte láser de precisión. Nuestro equipo de expertos utiliza tecnología de vanguardia para ofrecer resultados precisos y de alta calidad."
    },
    {
        imageSrc: "/carousel/image3.webp",
        altText: "Imagen de velocidad",
        text: "Corte láser de alta velocidad. Nuestro equipo de última generación nos permite ofrecer resultados rápidos sin comprometer la calidad."
    }
]

function CarouselSection() {
    const plugin = useRef(
        new (AutoPlay as any)({ delay: 3000, stopOnInteraction: true })
    )
    const [api, setApi] = useState<any>(null)
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])
    return (
        <div className="flex justify-center w-full flex-col items-center gap-4">
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                    slidesToScroll: 1,
                }}
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full max-w-[800px] h-[550px]"
            >
                <CarouselContent>
                    {carouselItems.map((item, index) => (
                        <CarouselItem key={index}>
                            <Card className="w-[800px] h-[550px]">
                                <CardContent className='w-full h-full'>
                                    <div className='w-full h-full flex justify-center items-center relative'>
                                        <img
                                            className='max-h-[500px] object-contain brightness-50'
                                            src={item.imageSrc}
                                            alt={item.altText} />
                                        <p className='absolute text-center text-[2vw] px-10 font-bold uppercase text-white'>
                                            {item.text}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex gap-2 justify-center">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 rounded-full transition-all ${index === current ? 'w-8 bg-red-600' : 'w-2 bg-gray-400'
                            }`}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default function HomePage() {
    const color = useChangeColor();
    return (
        <div>
            <main className="w-full h-screen flex items-center">
                <h1 className={`text-9xl font-bold w-full  text-center`}>
                    <span className='transition-colors duration-750' style={{ color }}>Corte</span>
                    <span>Laser</span>
                </h1>
            </main>
            <section
                className="w-full flex flex-row p-5 justify-around items-center gap-5 mb-10 flex-warp">
                <div
                    className='basis-1/3'>
                    <h2
                        className='text-5xl'>
                        <span>¿Qué significa</span>
                        <span
                            className='text-[#dd0240]'>"Corte"</span>
                        <span>?</span>
                    </h2>
                    <p className='mt-0 mb-2.5  p-[3%] rounded-4xl grid text-justify text-[1.2vw]'>
                        En el contexto del corte por láser, el término "corte" se refiere al ancho del material eliminado o vaporizado durante el proceso. Básicamente, la ranura es el espacio que se crea cuando el rayo láser corta el material.
                        <br /> <br />
                        En Cortelazer, nos dedicamos a brindar soluciones de corte láser de primera categoría para satisfacer las necesidades más exigentes de nuestros clientes. Nos destacamos como líderes en la industria gracias a nuestra combinación única de tecnología avanzada, experiencia especializada y un compromiso inquebrantable con la calidad.
                    </p>
                </div>
                <div>
                    <img
                        className='max-h-[420px] max-w-full object-contain'
                        src="/homeLazer.png"
                        alt="Imagen ilustrativa de corte láser" />
                </div>
            </section>
            <section className='w-full p-10 flex justify-center items-center'>
                <CarouselSection />
            </section>
        </div>
    );
}