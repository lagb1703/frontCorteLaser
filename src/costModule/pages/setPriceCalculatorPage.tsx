import PriceCalculatorChange from "../components/priceCalculatorChange";

export default function SetPriceCalculatorPage() {
    return (
        <div className="p-4 h-full w-full flex flex-col justify-around">
            <h1 className="text-2xl font-bold mb-4">Configurar Calculadora de Precios</h1>
            <div className="w-full flex justify-around items-center flex-wrap">
                <div className="h-full w-full">
                    <PriceCalculatorChange />
                </div>
            </div>
        </div>
    );
}