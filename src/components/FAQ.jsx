import { useState } from 'react'
import { FAQS } from '../data/faq'
import { getWhatsAppUrl } from '../config/site'

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState([0]) // First question open by default

  const toggleIndex = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <section id="faq" className="section-padding faq-section" aria-labelledby="faq-title">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">Frequently Asked Questions</span>
          <h2 id="faq-title" className="section-heading section-heading-center">
            Helpful Bakery Details
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            Everything you need to know about placing an order, advance notice, delivery, and flavours.
          </p>
        </div>

        <div className="faq-accordion-list" role="region" aria-label="Bakery FAQs">
          {FAQS.map((item, index) => {
            const isOpen = openIndexes.includes(index)
            const questionId = `faq-q-${index}`
            const answerId = `faq-a-${index}`

            return (
              <div
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                key={index}
              >
                <button
                  type="button"
                  id={questionId}
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleIndex(index)}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-icon-indicator" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={answerId}
                  className="faq-answer-container"
                  role="region"
                  aria-labelledby={questionId}
                  hidden={!isOpen}
                >
                  <p className="faq-answer-text">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Supporting FAQ Callout */}
        <div className="faq-support-callout">
          <p className="faq-callout-text">
            Have a unique celebration in mind or a question not listed here?
          </p>
          <a
            className="btn btn-secondary"
            href={getWhatsAppUrl('Hi M² Cakery! I have a question regarding an upcoming order.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Ask us on WhatsApp</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
