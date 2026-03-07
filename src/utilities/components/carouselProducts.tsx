
import { useRef, useState, useEffect } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import AutoPlay from "embla-carousel-autoplay"

const carouselItems = [
    {
        imageSrc: "/carouselProductos/1.jpg",
        altText: "Escaleras cortelaser",
    },
    {
        imageSrc: "/carouselProductos/2.jpg",
        altText: "Logo Cia Cortelaser",
    },
    {
        imageSrc: "/carouselProductos/3.jpg",
        altText: "Estribo",
    },
    {
        imageSrc: "/carouselProductos/4.jpg",
        altText: "Paneles Cortelaser",
    },
    {
        imageSrc: "/carouselProductos/5.jpg",
        altText: "Oso cortelaser",
    },
    {
        imageSrc: "/carouselProductos/6.jpg",
        altText: "Techo cortelaser",
    },
    {
        imageSrc: "/carouselProductos/7.jpg",
        altText: "Soporte cortelaser",
    },
    {
        imageSrc: "/carouselProductos/8.png",
        altText: "mas paneles cortelaser",
    }
]

export default function CarouselProducts() {
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
                className="w-full lg:max-w-[800px] lg:h-[550px]"
            >
                <CarouselContent>
                    {carouselItems.map((item, index) => (
                        <CarouselItem key={index}>
                            <Card className="lg:w-[800px] lg:h-[550px]">
                                <CardContent className='w-full h-full'>
                                    <div className='w-full h-full flex justify-center items-center'>
                                        <img
                                            className='lg:max-h-[500px] object-contain brightness-50'
                                            src={item.imageSrc}
                                            alt={item.altText} />
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