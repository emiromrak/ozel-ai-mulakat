import useAppStore from './store/useAppStore'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import StepBar from './components/StepBar'
import LoadingOverlay from './components/ui/LoadingOverlay'
import Toast from './components/ui/Toast'
import InputView from './components/views/InputView'
import QuestionsView from './components/views/QuestionsView'
import TestView from './components/views/TestView'
import ReportView from './components/views/ReportView'

export default function App() {
  const { currentView } = useAppStore()

  return (
    <>
      <Header />
      <StepBar />

      <main>
        {currentView === 'input'     && <InputView />}
        {currentView === 'questions' && <QuestionsView />}
        {currentView === 'test'      && <TestView />}
        {currentView === 'report'    && <ReportView />}
      </main>

      <Footer />
      <LoadingOverlay />
      <Toast />
    </>
  )
}
