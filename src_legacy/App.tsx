import { Header } from './components/Header/Header'
import { Intro } from './components/Intro/Intro'
import { Work } from './components/Work/Work'
import { LabeledSection } from './components/LabeledSection/LabeledSection'
import { Footer } from './components/Footer/Footer'
import { usePrefs } from './context/PrefsContext'
import { STRINGS } from './i18n'

export default function App() {
  const { lang } = usePrefs()
  const t = STRINGS[lang]
  return (
    <div className="shell">
      <Header />
      <Intro />
      <Work />
      <LabeledSection label={t.focusLabel} text={t.focusText} />
      <LabeledSection label={t.backgroundLabel} text={t.backgroundText} />
      <Footer />
    </div>
  )
}
