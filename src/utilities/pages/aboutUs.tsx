
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Helmet } from 'react-helmet-async';
import { useChangeColor } from '@/utilities/hooks/useChangeColor';
import {
    Flag,
    CircleCheck,
    File,
    Copy
} from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button";
import Typed from 'typed.js';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"

const carouselItems = [
    {
        imageSrc: "/aboutUs/Abb_logo.jpg",
        altText: "logo de abb",
    },
    {
        imageSrc: "/aboutUs/ayco.png",
        altText: "logo de ayco",
    },
    {
        imageSrc: "/aboutUs/cemex.png",
        altText: "logo de cemex",
    },
    {
        imageSrc: "/aboutUs/gm_soldaduras.jpg",
        altText: "logo de gm soldaduras",
    },
    {
        imageSrc: "/aboutUs/magnetrosn.jpg",
        altText: "logo de magnetrosn",
    },
    {
        imageSrc: "/aboutUs/movitram.jpg",
        altText: "logo de movitram",
    },
    {
        imageSrc: "/aboutUs/nuclero.jpg",
        altText: "logo de soluciones integrales",
    },
    {
        imageSrc: "/aboutUs/Persianas_pentagrama.jpg",
        altText: "logo de persianas pentagrama"
    },
    {
        imageSrc: "/aboutUs/susuki.jpg",
        altText: "logo de susuki"
    },
    {
        imageSrc: "/aboutUs/troncos.jpg",
        altText: "logo de troncos"
    },
    {
        imageSrc: "/aboutUs/ukumari.jpg",
        altText: "logo de ukumari"
    }
]

function CarouselSection() {
    const plugin = useRef(
        new (AutoPlay as any)({ delay: 3000, stopOnInteraction: true })
    )
    const [api, setApi] = useState<any>(null)
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [_, setVisibleCount] = useState(1)

    useEffect(() => {
        if (!api) {
            return
        }

        const updateCarousel = () => {
            const snapList = api.scrollSnapList()
            const slideSize = api.slideNodes().length
            const visibleSlides = Math.ceil(slideSize / Math.max(1, Math.ceil(slideSize / snapList.length)))
            setVisibleCount(visibleSlides)
            setCount(snapList.length)
            setCurrent(api.selectedScrollSnap())
        }

        updateCarousel()
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })

        window.addEventListener("resize", updateCarousel)
        return () => window.removeEventListener("resize", updateCarousel)
    }, [api])

    return (
        <div className="flex justify-center w-full flex-col items-center gap-0 lg:gap-4">
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                    slidesToScroll: 1,
                }}
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-[300px] sm:w-full sm:h-[220px] md:h-[280px] lg:h-[350px]"
            >
                <CarouselContent>
                    {carouselItems.map((item, index) => (
                        <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <Card className="w-full h-[200px] sm:h-[220px] md:h-[280px] lg:h-[300px]">
                                <CardContent className='w-full h-full'>
                                    <div className='w-full h-full flex justify-center items-center relative'>
                                        <img
                                            className='max-h-[90%] object-contain brightness-50'
                                            src={item.imageSrc}
                                            alt={item.altText} />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex gap-2 justify-center mt-10 lg:mt-0">
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

export default function AboutUs() {
    const color = useChangeColor();
    const textRef = useRef<HTMLParagraphElement>(null);
    const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://metal-cortes.example';
    useEffect(() => {
        const typed = new Typed(textRef.current, {
            strings: ['<i>transformamos</i> metal.', 'creamos ideas.'],
            typeSpeed: 50,
            loop: true,
        });

        return () => {
            typed.destroy();
        };
    }, []);
    const handleCopyAddress = useCallback(() => {
        const address = 'Calle 18 # 16b-09';
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(address);
            return;
        }
        const tempInput = document.createElement('input');
        tempInput.value = address;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        tempInput.remove();
    }, []);
    return (
        <TooltipProvider>
            <Helmet>
                <title>Metal Cortes — Nosotros</title>
                <meta name="description" content="Metal Cortes: Más de 20 años en corte láser, mecanizado y transformación de metales. Calidad y tecnología para tus proyectos." />
                <meta property="og:title" content="Metal Cortes — Nosotros" />
                <meta property="og:description" content="Servicios de corte láser, cizalla, doblado, rolado y mecanizado. Asesoría experta y maquinaria de alta tecnología." />
                <link rel="canonical" href={`${SITE_URL}/nosotros`} />
                <script type="application/ld+json">
                    {`{
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Metal Cortes",
                        "url": "${SITE_URL}",
                        "description": "Corte láser y transformación de metales"
                    }`}
                </script>
            </Helmet>
            <main
                className="
                    w-full md:p-5 
                    flex flex-col items-center
                    my-10
                    ">
                <h1 className="text-4xl md:text-9xl font-bold mb-8">Nosotros</h1>
                <div className="flex">
                    <p ref={textRef} className=""></p>
                </div>
                <Button
                    variant="default"
                    onClick={() => {
                        const url = encodeURI('/Catálogo-Metal-Cortes.pdf');
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Catálogo-Metal-Cortes.pdf';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }}
                    className="cursor-pointer p-2 mt-10"
                >
                    <File className="inline mr-2" />
                    Nuestro catalogo
                </Button>
            </main>
            <section
                className="
                    w-full 
                    flex flex-col md:flex-row justify-around gap-10 lg
                    mt-8 p-5
                    ">
                <Card
                    className="
                        basis-[40%] 
                        min-w-[100px] 
                        md:min-w-[500px] 
                        sm:min-h-[350px]
                        transition-all duration-750
                        "
                    style={{
                        border: `2px solid ${color}`,
                        boxShadow: `0 0 20px ${color}40`
                    }}>
                    <CardHeader
                        className="flex justify-start items-center">
                        <Flag className={`inline mr-2 transition-colors duration-750`} style={{ color }} />
                        <h2 className="text-xl font-semibold transition-colors duration-750" style={{ color }}>Nuestra misión</h2>
                    </CardHeader>
                    <CardContent>
                        <p>
                            SOMOS UNA EMPRESA DEL EJE CAFETERO, COMPROMETIDA EN OFRECER A SUS CLIENTES LAS MEJORES SOLUCIONES DE CORTE LASER, 
                            PLASMA, CIZALLA, DOBLADO, ROLADO, MECANIZADO Y ENSAMBLE PARA MATERIALES FERROSOS Y NO FERROSOS, APOYADOS EN 
                            MAQUINARIA DE ALTA TECNOLOGIA, SOFTWARE ESPECIALIZADO Y UN EQUIPO DE TRABAJO PREPARADO CON AMPLIA EXPERIENCIA 
                            PARA ASESORAR SUS PROYECTOS.
                        </p>
                    </CardContent>
                </Card>
                <Card
                    className="
                        basis-[40%] 
                        min-w-[200px] 
                        md:min-w-[500px] 
                        sm:min-h-[350px]
                        transition-all duration-750"
                    style={{
                        border: `2px solid ${color}`,
                        boxShadow: `0 0 20px ${color}40`
                    }}>
                    <CardHeader className="flex justify-start items-center">
                        <CircleCheck className="inline mr-2 transition-colors duration-750" style={{ color }} />
                        <h2 className="text-xl font-semibold transition-colors duration-750" style={{ color }}>Nuestra visión</h2>
                    </CardHeader>
                    <CardContent>
                        <p>
                            SER UNA EMPRESA LIDER EN LA TRANSFORMACION DE METALES QUE AYUDE A CREAR Y DESARROLLAR LAS IDEAS DE SUS CLIENTES 
                            A TRAVES DE NUESTRA ASESORIA, APOYADOS EN PROCESOS GESTIONADOS CON CALIDAD.
                        </p>
                    </CardContent>
                </Card>
            </section>
            <section
                className="p-5">
                <article
                    className="w-full flex flex-wrap flex-row p-5 justify-around items-center my-6 lg:my-0 lg:mb-10">
                    <div
                        className="basis-full lg:basis-1/3">
                        <h2 className="text-4xl lg:text-5xl mb-10 lg:mb-0">Nuestra Historia</h2>
                        <p
                            className="mt-0 mb-2.5 lg:p-[3%] rounded-4xl grid text-justify lg:text-[1.2vw]">
                            METAL CORTES RISARALDA S.A.S es una empresa con más de 20 años de experiencia en el mercado,
                            dedicada a la comercialización de láminas y servicios de corte, mecanizado,
                            cizalla, doblado y rolado. A lo largo de su trayectoria, ha logrado consolidarse como un referente en la industria,
                            gracias a su compromiso con la calidad, la innovación y la satisfacción del cliente.
                        </p>
                    </div>
                    <div className="basis-full lg:basis-auto flex justify-center items-center p-5">
                        <img
                            src="/aboutUs/header_nuestra_empresa.jpg"
                            alt="Imagen de la empresa"
                            className="max-h-[380px] max-w-full object-contain" />
                    </div>
                </article>
            </section>
            <section className="p-0 lg:p-5">
                <h2 className="text-2xl font-bold mb-4">Nuestros clientes</h2>
                <CarouselSection />
            </section>
            <section
                className="w-full flex flex-col items-center gap-4 mt-8">
                <h2 className="text-2xl font-bold mb-4">Nuestra Ubicación</h2>
                <article
                    className="w-full flex flex-wrap flex-row p-0 md:p-5 justify-around items-center my-6 lg:my-0 lg:mb-10">
                    <div className="basis-full h-[300px] md:max-w-[1000px] md:h-[500px] lg:h-[500px]">
                        <iframe
                            title="ubicacion-metal-cortes"
                            src={"https://www.google.com/maps?q=Calle+18+%2316b-09&output=embed"}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p
                                className="
                                text-lg font-medium 
                                flex items-center gap-2 cursor-pointer
                                "
                                onClick={handleCopyAddress}>
                                <Copy className="inline mr-2" />
                                <span className="">Calle 18 # 16b-09</span>
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            Copiar
                        </TooltipContent>
                    </Tooltip>
                </article>
            </section>
        </TooltipProvider>
    );
}