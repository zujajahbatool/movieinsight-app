import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SectionLayout from '../../common/SectionLayout/SectionLayout';
import styles from './FrequentQueries.module.css';

const FAQ_DATA = [
  {
    question: "What is Omni ?",
    answer: "Omni is your all-in-one entertainment destination featuring the world's greatest stories from HBO, Warner Bros., Disney+, and more.",
  },
  {
    question: "How do I Get Help If I Have Any Issues?",
    answer: "You can reach our 24/7 support team through the help center in the app or via our website's support page.",
  },
  {
    question: "Is Omni Good For Kids & Families?",
    answer: "Absolutely. Omni offers robust parental controls and a dedicated kids' mode with age-appropriate content.",
  },
  {
    question: "How much Does Omni Cost?",
    answer: "We offer several plans starting from a basic ad-supported tier to a premium 4K Ultra HD experience. Check our pricing page for details.",
  },
];

function FrequentQueries() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className={styles['frequent-queries-section']}>
      <SectionLayout title="The Omni Questions Everyone's Asking">
        <div className={styles['faq-list']}>
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={[
                  styles['faq-item'],
                  isOpen ? styles['faq-item--open'] : '',
                ].join(' ')}
              >
                <button
                  type="button"
                  className={styles['faq-item__trigger']}
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles['faq-item__question']}>
                    {item.question}
                  </span>
                  <span className={styles['faq-item__icon-wrap']}>
                    {isOpen ? (
                      <ChevronUp size={24} className={styles['faq-item__icon']} />
                    ) : (
                      <ChevronDown size={24} className={styles['faq-item__icon']} />
                    )}
                  </span>
                </button>

                <div
                  className={[
                    styles['faq-item__content-grid'],
                    isOpen ? styles['faq-item__content-grid--open'] : '',
                  ].join(' ')}
                >
                  <div className={styles['faq-item__content-wrapper']}>
                    <p className={styles['faq-item__answer']}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionLayout>
    </div>
  );
}

export default FrequentQueries;
