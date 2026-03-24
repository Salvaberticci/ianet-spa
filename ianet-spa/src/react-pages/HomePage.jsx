import { HeroCarousel } from "../components/organisms/HeroCarousel"
import { QuienesSomosSection } from "../components/organisms/QuienesSomosSection"
import { ServiciosSection } from "../components/organisms/ServiciosSection"
import { ActualidadSection } from "../components/organisms/ActualidadSection"
import { ContactSection } from "../components/organisms/ContactSection"

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <QuienesSomosSection />
      <ServiciosSection />
      <ActualidadSection />
      <ContactSection />
    </>
  )
}

export default HomePage


