import { Fragment } from 'react'
import useAppStore from '../store/useAppStore'

export default function StepBar() {
  const { currentStep } = useAppStore()

  const steps = [
    { n: 1, label: 'Bilgi' },
    { n: 2, label: 'Mülakat' },
    { n: 3, label: 'Rapor' },
  ]

  return (
    <div className="steps-bar">
      {steps.map((s, i) => (
        <Fragment key={s.n}>
          <div
            className={`step-item ${currentStep === s.n ? 'active' : ''} ${currentStep > s.n ? 'done' : ''}`}
          >
            <div className="step-num">{s.n}</div>
            <div className="step-label">{s.label}</div>
          </div>
          {i < steps.length - 1 && <div className="step-connector" />}
        </Fragment>
      ))}
    </div>
  )
}
